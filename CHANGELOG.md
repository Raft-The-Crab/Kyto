# Changelog

## v2.0.3 - January 31, 2026

### Changed

- Complete branding update from Botify to Kyto across 40+ files
- Updated all localStorage keys to use `kyto_*` prefix
- Updated CORS origins to `kyto.dev`
- Updated theme storage key to `kyto-theme`
- Updated workspace storage to `kyto-workspace-storage-v2`

### Improved

- Backend API error handling with structured logging
- Project API validation with more specific Zod schemas
- Added project statistics endpoint (`/api/projects/stats/summary`)
- Better TypeScript types in backend
- Cleaned up README.md with consolidated content

### Fixed

- README.md duplicate content and malformed sections
- Migration script to properly handle old Botify keys
- Version number consistency across the project

### Technical

- Frontend type-check and lint passing
- Frontend build successful
- Backend type-check passing

## v2.0.2 - January 29, 2025

### Fixed

- CommandBuilderPage: Fixed missing imports and incorrect component props
- EditorCanvas now receives correct props (entityId, onBlockDragStart, draggedBlockType)
- EditorSync now uses proper props (id, entityType, initialData)
- All builder pages (Commands, Events, Modules) now fully functional

### Added

- Contact page with functional form
- Blog page with content structure
- Careers page with job listings
- Simplified License page
- Cleaned up About page
- Professional FeaturesPage

### Changed

- Landing page: Removed excessive marketing messaging
- Updated all dates to January 29, 2025
- Improved navigation structure
- Maintained glass morphism nav design
- Cleaned up hero section messaging

### Improved

- Overall UI consistency across all pages
- Professional tone throughout
- Better routing structure
- Cleaner, more modern aesthetics

## v2.0.1 - December 26, 2024

### Changed

- Project rebranded to **Kyto** (was Botify). All READMEs and UI references updated.
- Added `BRANDING.md` and `AUTHORS.md`.

### Fixed

- Added a client-side migration helper to preserve user localStorage keys across the rebrand.

### Notes

- Migration runs once at app bootstrap and copies old `botify_*` keys to `kyto_*` equivalents.
- Follow-up tasks: add tests, CI, and plan Durable Objects migration.
