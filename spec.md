# Next Topper Mission

## Current State
Fresh project with only shadcn-ui components installed. No backend or frontend app code exists yet.

## Requested Changes (Diff)

### Add
- Admin authentication (password: 12345678) stored in backend
- Study material metadata storage (title, batch, file URL, upload date, file size)
- Backend APIs: admin login, upload material metadata, list materials by batch, delete material, get enrollment counts
- Student enrollment tracking per batch
- Large file upload support via blob-storage component (up to 10GB)
- Frontend: Landing page with 6 batch cards (9th, 10th, 11th JEE, 11th NEET, 11th School PCM, 11th School PCB)
- Frontend: Student batch selection → materials list with download links
- Frontend: Admin login modal → admin dashboard with upload form, material management, enrollment stats

### Modify
- Nothing (new project)

### Remove
- Nothing

## Implementation Plan
1. Select blob-storage component for large file handling
2. Generate Motoko backend with admin auth, material CRUD, batch enrollment tracking
3. Build React frontend with student view (batch cards, materials list) and admin dashboard (upload, manage)
