import { Router, Request, Response } from 'express';
import { pool } from '../config/database';
import { authenticateTenant } from '../middleware/auth';
import {
  CreateSubmissionRequest,
  SubmissionResponse,
  SubmissionStatusResponse,
} from '../types/submission';

export const submissionsRouter = Router();

// All submission routes require authentication
submissionsRouter.use(authenticateTenant);

// POST /api/v1/submissions - Create new submission
submissionsRouter.post('/', async (req: Request, res: Response): Promise<void> => {
  const client = await pool.connect();

  try {
    const tenantId = req.tenant!.id;
    const body: CreateSubmissionRequest = req.body;

    // Validate required fields
    if (!body.user_id) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'user_id is required',
      });
      return;
    }

    // Verify user belongs to tenant
    const userCheck = await client.query(
      'SELECT id FROM users WHERE id = $1 AND tenant_id = $2 AND status = $3',
      [body.user_id, tenantId, 'active']
    );

    if (userCheck.rows.length === 0) {
      res.status(404).json({
        error: 'Not Found',
        message: 'User not found or not active',
      });
      return;
    }

    await client.query('BEGIN');

    // Create submission
    const submissionResult = await client.query(
      `INSERT INTO submissions 
       (tenant_id, user_id, case_number, case_title, court_name, filing_type, status, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        tenantId,
        body.user_id,
        body.case_number || null,
        body.case_title || null,
        body.court_name || null,
        body.filing_type || null,
        'draft',
        JSON.stringify(body.metadata || {}),
      ]
    );

    const submission = submissionResult.rows[0];

    // Create initial event
    await client.query(
      `INSERT INTO submission_events 
       (submission_id, event_type, status, message)
       VALUES ($1, $2, $3, $4)`,
      [submission.id, 'created', 'draft', 'Submission created']
    );

    // Add documents if provided
    if (body.documents && body.documents.length > 0) {
      for (const doc of body.documents) {
        await client.query(
          `INSERT INTO submission_documents 
           (submission_id, filename, file_url, file_size, mime_type, document_type, metadata)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            submission.id,
            doc.filename,
            doc.file_url,
            doc.file_size || null,
            doc.mime_type || null,
            doc.document_type || null,
            JSON.stringify({}),
          ]
        );
      }
    }

    await client.query('COMMIT');

    const response: SubmissionResponse = {
      id: submission.id,
      tenant_id: submission.tenant_id,
      user_id: submission.user_id,
      external_id: submission.external_id,
      case_number: submission.case_number,
      case_title: submission.case_title,
      court_name: submission.court_name,
      filing_type: submission.filing_type,
      status: submission.status,
      metadata: submission.metadata,
      created_at: submission.created_at,
      updated_at: submission.updated_at,
      submitted_at: submission.submitted_at,
    };

    res.status(201).json(response);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating submission:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create submission',
    });
  } finally {
    client.release();
  }
});

// GET /api/v1/submissions/:id/status - Get submission status
submissionsRouter.get('/:id/status', async (req: Request, res: Response): Promise<void> => {
  try {
    const tenantId = req.tenant!.id;
    const submissionId = req.params.id;

    // Get submission
    const submissionResult = await pool.query(
      'SELECT * FROM submissions WHERE id = $1 AND tenant_id = $2',
      [submissionId, tenantId]
    );

    if (submissionResult.rows.length === 0) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Submission not found',
      });
      return;
    }

    const submission = submissionResult.rows[0];

    // Get events
    const eventsResult = await pool.query(
      'SELECT * FROM submission_events WHERE submission_id = $1 ORDER BY created_at ASC',
      [submissionId]
    );

    // Get documents
    const documentsResult = await pool.query(
      'SELECT * FROM submission_documents WHERE submission_id = $1 ORDER BY created_at ASC',
      [submissionId]
    );

    const response: SubmissionStatusResponse = {
      submission: {
        id: submission.id,
        tenant_id: submission.tenant_id,
        user_id: submission.user_id,
        external_id: submission.external_id,
        case_number: submission.case_number,
        case_title: submission.case_title,
        court_name: submission.court_name,
        filing_type: submission.filing_type,
        status: submission.status,
        metadata: submission.metadata,
        created_at: submission.created_at,
        updated_at: submission.updated_at,
        submitted_at: submission.submitted_at,
      },
      events: eventsResult.rows.map((event) => ({
        id: event.id,
        event_type: event.event_type,
        status: event.status,
        message: event.message,
        metadata: event.metadata,
        created_at: event.created_at,
      })),
      documents: documentsResult.rows.map((doc) => ({
        id: doc.id,
        filename: doc.filename,
        file_url: doc.file_url,
        file_size: doc.file_size,
        mime_type: doc.mime_type,
        document_type: doc.document_type,
        created_at: doc.created_at,
      })),
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching submission status:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch submission status',
    });
  }
});
