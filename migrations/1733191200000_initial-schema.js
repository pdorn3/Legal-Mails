/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // Create tenants table
  pgm.createTable('tenants', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    name: {
      type: 'varchar(255)',
      notNull: true,
    },
    api_key: {
      type: 'varchar(255)',
      notNull: true,
      unique: true,
    },
    status: {
      type: 'varchar(50)',
      notNull: true,
      default: 'active',
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.createIndex('tenants', 'api_key');
  pgm.createIndex('tenants', 'status');

  // Create users table
  pgm.createTable('users', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    tenant_id: {
      type: 'uuid',
      notNull: true,
      references: 'tenants(id)',
      onDelete: 'CASCADE',
    },
    email: {
      type: 'varchar(255)',
      notNull: true,
    },
    name: {
      type: 'varchar(255)',
      notNull: true,
    },
    role: {
      type: 'varchar(50)',
      notNull: true,
      default: 'user',
    },
    status: {
      type: 'varchar(50)',
      notNull: true,
      default: 'active',
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.createIndex('users', 'tenant_id');
  pgm.createIndex('users', ['tenant_id', 'email'], { unique: true });
  pgm.createIndex('users', 'status');

  // Create submissions table
  pgm.createTable('submissions', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    tenant_id: {
      type: 'uuid',
      notNull: true,
      references: 'tenants(id)',
      onDelete: 'CASCADE',
    },
    user_id: {
      type: 'uuid',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
    external_id: {
      type: 'varchar(255)',
      comment: 'ID from external system (e.g., Tyler EFM envelope ID)',
    },
    case_number: {
      type: 'varchar(255)',
    },
    case_title: {
      type: 'text',
    },
    court_name: {
      type: 'varchar(255)',
    },
    filing_type: {
      type: 'varchar(100)',
    },
    status: {
      type: 'varchar(50)',
      notNull: true,
      default: 'draft',
    },
    metadata: {
      type: 'jsonb',
      default: '{}',
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    submitted_at: {
      type: 'timestamp',
    },
  });

  pgm.createIndex('submissions', 'tenant_id');
  pgm.createIndex('submissions', 'user_id');
  pgm.createIndex('submissions', 'external_id');
  pgm.createIndex('submissions', 'status');
  pgm.createIndex('submissions', 'created_at');

  // Create submission_documents table
  pgm.createTable('submission_documents', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    submission_id: {
      type: 'uuid',
      notNull: true,
      references: 'submissions(id)',
      onDelete: 'CASCADE',
    },
    filename: {
      type: 'varchar(255)',
      notNull: true,
    },
    file_url: {
      type: 'text',
      notNull: true,
    },
    file_size: {
      type: 'integer',
    },
    mime_type: {
      type: 'varchar(100)',
    },
    document_type: {
      type: 'varchar(100)',
      comment: 'e.g., complaint, motion, exhibit',
    },
    metadata: {
      type: 'jsonb',
      default: '{}',
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.createIndex('submission_documents', 'submission_id');

  // Create submission_events table (audit log / timeline)
  pgm.createTable('submission_events', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    submission_id: {
      type: 'uuid',
      notNull: true,
      references: 'submissions(id)',
      onDelete: 'CASCADE',
    },
    event_type: {
      type: 'varchar(100)',
      notNull: true,
      comment: 'e.g., created, submitted, accepted, rejected',
    },
    status: {
      type: 'varchar(50)',
      comment: 'Status after this event',
    },
    message: {
      type: 'text',
    },
    metadata: {
      type: 'jsonb',
      default: '{}',
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.createIndex('submission_events', 'submission_id');
  pgm.createIndex('submission_events', 'event_type');
  pgm.createIndex('submission_events', 'created_at');
};

exports.down = (pgm) => {
  pgm.dropTable('submission_events');
  pgm.dropTable('submission_documents');
  pgm.dropTable('submissions');
  pgm.dropTable('users');
  pgm.dropTable('tenants');
};
