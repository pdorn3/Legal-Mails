export interface CreateSubmissionRequest {
  user_id: string;
  case_number?: string;
  case_title?: string;
  court_name?: string;
  filing_type?: string;
  documents?: Array<{
    filename: string;
    file_url: string;
    file_size?: number;
    mime_type?: string;
    document_type?: string;
  }>;
  metadata?: Record<string, any>;
}

export interface SubmissionResponse {
  id: string;
  tenant_id: string;
  user_id: string;
  external_id: string | null;
  case_number: string | null;
  case_title: string | null;
  court_name: string | null;
  filing_type: string | null;
  status: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  submitted_at: string | null;
}

export interface SubmissionStatusResponse {
  submission: SubmissionResponse;
  events: Array<{
    id: string;
    event_type: string;
    status: string | null;
    message: string | null;
    metadata: Record<string, any>;
    created_at: string;
  }>;
  documents: Array<{
    id: string;
    filename: string;
    file_url: string;
    file_size: number | null;
    mime_type: string | null;
    document_type: string | null;
    created_at: string;
  }>;
}
