# AEOI Exchange Service (DAC2/CRS) - MVP

A demo-oriented system for handling **AEOI (Automatic Exchange of Information)** XML files, specifically **DAC2** and **CRS** reporting formats. This MVP implements file ingestion, validation, journaling, transformation with currency enrichment, and TIN search capabilities.

## Features

### Core Functionality

- **File Upload & Reception**: Accept XML files up to 20 MB via web interface
- **Validation Pipeline**: Multi-layer validation including:
  - Threat Scan (50005): Detect forbidden sequences
  - XSD Schema Validation (50007): Validate against latest DAC2/CRS schema
  - MessageRefId uniqueness (50009): Global uniqueness check
  - DocRefId uniqueness (80000): With OECD0 exception
  - ReportingPeriod consistency (80012): For corrections/deletes
- **Case & Task Management**: One case per file, one task per file if errors exist
- **Currency Enrichment**: SEK ↔ EUR conversion based on reporting period
  - 2021: 11.22 SEK = 1 EUR
  - 2022: 11.00 SEK = 1 EUR
  - 2023: 10.55 SEK = 1 EUR
- **TIN Search**: Normalized search with exact and prefix matching
- **Audit Trail**: All operations logged with correlation IDs

### Web Interface Pages

1. **File Overview**: Upload files, view status, statistics
2. **Task View**: Manage validation tasks, export error reports (CSV)
3. **Record Detail**: View individual records with currency enrichment
4. **TIN Search**: Search Tax Identification Numbers with normalized matching

## Architecture

### Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Database**: PostgreSQL 16 with Row Level Security

### Database Schema

- `file_receipt`: File metadata and processing status
- `aeoi_case`: Case/dossier management (one per file)
- `aeoi_task`: Task management (one per file if errors)
- `aeoi_record`: Individual records from XML files
- `validation_error`: Validation errors (file-level and record-level)
- `tin_index`: Normalized TIN index for search
- `currency_rate`: Exchange rates by year
- `audit_log`: Audit trail for all operations

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier available)

### Environment Setup

Create a `.env` file with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

```bash
npm install
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Usage

### Uploading XML Files

1. Navigate to the **File Overview** page
2. Click "Choose File" and select a DAC2/CRS XML file (max 20 MB)
3. Click "Upload" to submit the file
4. The system will automatically:
   - Create a case for the file
   - Validate the file (threat scan, XSD, business rules)
   - Create a task if validation errors are found
   - Parse and transform records
   - Enrich currency data (SEK ↔ EUR)

### Managing Tasks

1. Navigate to the **Tasks** page
2. Select a task to view details
3. Update task status: Open → In Progress → Completed → Archived
4. Add comments to track progress
5. Export validation errors as CSV

### Viewing Records

1. Navigate to the **Records** page
2. Filter by status (All, Pending, Validated, Failed)
3. Click on a record to view details including:
   - Document reference IDs
   - Jurisdiction and reporting period
   - Original amount and currency
   - Converted SEK and EUR amounts
   - Enrichment status
   - Validation errors (if any)

### Searching TINs

1. Navigate to the **TIN Search** page
2. Enter a Tax Identification Number
3. Enable "prefix search" for partial matches
4. View results with pagination (20 per page)
5. All searches are audited (only salted hashes are stored)

## Validation Rules

### File-Level Rules

- **50005**: Threat Scan - Rejects files with forbidden sequences (`--`, `/*`, `&#`)
- **50007**: XSD Validation - Validates against latest DAC2/CRS schema
- **50009**: MessageRefId must be globally unique (current submissions)
- **50012**: Wrong jurisdiction - **DISABLED in MVP** (all jurisdictions allowed)

### Record-Level Rules

- **80000**: DocRefId must be globally unique (exception: `DocTypeIndic = OECD0`)
- **80012**: ReportingPeriod consistency - For corrections/deletes, the new reporting period must match the initial record's period

## Currency Enrichment

The system automatically converts amounts between SEK and EUR based on the reporting period:

- **Target Currency**: SEK (Swedish Krona)
- **Rounding**: Half-Up, 2 decimal places
- **Supported Conversions**:
  - EUR → SEK: `amountSEK = roundHalfUp(amountEUR * rate)`
  - SEK → EUR: `amountEUR = roundHalfUp(amountSEK / rate)`
- **Other Currencies**: Marked as `NOT_CONVERTED`

## TIN Search & Privacy

### Normalization

TINs are normalized before search:
- Remove all non-alphanumeric characters (spaces, dashes, punctuation)
- Convert to uppercase
- Example: `SE123-456-789` becomes `SE123456789`

### Search Modes

- **Exact Match**: Finds records with exact normalized TIN
- **Prefix Search**: Finds records where normalized TIN starts with the search term

### Privacy & Audit

- All searches are audited with **salted hashes** only
- Raw TIN values are **never logged** or stored in audit trails
- Actor ID: `anonymous` (MVP has no authentication)
- Pagination: 20 results per page

## Security Considerations

### MVP Limitations

- **No Authentication**: All endpoints are open (demo only)
- **All Jurisdictions Allowed**: Rule 50012 is disabled
- **Open RLS Policies**: Row Level Security policies allow all access

### Production Recommendations

1. Enable authentication (Supabase Auth)
2. Implement proper RLS policies based on user roles
3. Add jurisdiction filtering (enable rule 50012)
4. Implement rate limiting on API endpoints
5. Add file encryption for blob storage
6. Enhance audit logging with real user IDs
7. Implement retention policies for data purging

## Data Model

### File Processing States

- `RECEIVED`: File uploaded, pending validation
- `VALIDATING`: File being validated
- `TRANSFORMING`: Records being parsed and transformed
- `COMPLETED`: Processing completed successfully
- `FAILED`: Processing failed due to errors

### Task States

- `OPEN`: Task created, not yet started
- `IN_PROGRESS`: Task being worked on
- `COMPLETED`: Task completed
- `ARCHIVED`: Task archived

### Record States

- `PENDING`: Record extracted, pending validation
- `VALIDATED`: Record passed validation
- `FAILED`: Record failed validation

### Enrichment States

- `CONVERTED`: Currency successfully converted (SEK ↔ EUR)
- `NOT_CONVERTED`: Currency not SEK or EUR
- `RATE_MISSING`: No exchange rate available for reporting period

## Error Handling

### File-Level Errors

File-level validation errors prevent the entire file from being processed. A task is created with all errors consolidated.

### Record-Level Errors

Record-level errors are associated with specific records and don't block other records from processing.

### Error Report Export

Validation errors can be exported as CSV files including:
- Error code
- Error message
- Error level
- Record ID (or "File-level")
- Timestamp

## API Design (Future Enhancement)

The system is designed to support REST API endpoints:

```
POST /inbound/files          - Upload XML file
GET  /files/{fileId}         - Get file details
GET  /cases/{caseId}         - Get case details
GET  /tasks/{taskId}         - Get task details
PATCH /tasks/{taskId}        - Update task status
GET  /records                - List records (with filters)
GET  /records/{recordId}     - Get record details
GET  /search/tin             - Search TINs
GET  /audit/{correlationId}  - Get audit trail
GET  /reports/errors/{fileId}?format=csv - Export errors
```

## Development

### Project Structure

```
src/
├── lib/
│   ├── supabase.ts      - Supabase client and types
│   └── utils.ts         - Utility functions
├── components/
│   ├── Layout.tsx       - Main layout with navigation
│   └── StatusBadge.tsx  - Status badge component
├── pages/
│   ├── FileOverview.tsx - File upload and overview
│   ├── TaskView.tsx     - Task management
│   ├── RecordView.tsx   - Record details
│   └── TINSearch.tsx    - TIN search interface
└── App.tsx              - Main application router
```

### Code Conventions

- TypeScript for type safety
- Functional components with hooks
- Tailwind CSS for styling
- Supabase for data persistence
- Client-side routing with hash navigation

### Testing

Run type checking:
```bash
npm run typecheck
```

Run linting:
```bash
npm run lint
```

## Compliance & Standards

- **OECD CRS**: Common Reporting Standard for automatic exchange of financial account information
- **DAC2**: EU Directive on Administrative Cooperation (2nd iteration)
- **XSD Validation**: Latest DAC2/CRS schema (version should be configured)

## Limitations & Known Issues

### MVP Constraints

1. **No actual XML parsing**: File upload stores metadata only; full XML parsing not implemented
2. **No XSD validation**: XSD schema validation logic is stubbed
3. **No blob storage**: Files are referenced but not actually stored
4. **Simplified validation**: Business rules are simplified for demo
5. **No background processing**: Processing is synchronous (should be async in production)
6. **No retry mechanism**: Failed processing cannot be retried
7. **No notification system**: No email/SMS notifications for task updates

### Browser Compatibility

Tested on:
- Chrome 120+
- Firefox 121+
- Safari 17+
- Edge 120+

## Future Enhancements

### Phase 2 Features

- [ ] Full XML parsing and record extraction
- [ ] XSD schema validation implementation
- [ ] Actual blob storage with S3/Supabase Storage
- [ ] Background job processing with queue
- [ ] Real-time status updates via WebSockets
- [ ] Advanced filtering and sorting
- [ ] Bulk operations (approve/reject multiple tasks)
- [ ] Export capabilities (Excel, PDF)
- [ ] Dashboard with analytics
- [ ] User authentication and authorization
- [ ] Role-based access control
- [ ] Notification system
- [ ] Comprehensive audit reports

### Phase 3 Features

- [ ] Multi-schema support (different CRS/DAC versions)
- [ ] Amendment tracking and versioning
- [ ] Workflow automation
- [ ] Integration with external systems
- [ ] Advanced reporting and analytics
- [ ] Data retention policies
- [ ] Automated testing suite
- [ ] Performance optimization
- [ ] Multi-language support
- [ ] Mobile responsive design improvements

## License

This is a demo/MVP application for educational purposes.

## Support

For issues or questions, please refer to the specification document.

---


**Built with**: React, TypeScript, Vite, Tailwind CSS, Supabase, PostgreSQL
