# Changelog

## v2.0.1 - YYYY-MM-DD

### Changed
- Project rebranded to **Kyto** (was Botify). All READMEs and UI references updated.
- Added `BRANDING.md` and `AUTHORS.md`.

### Fixed
- Added a client-side migration helper to preserve user localStorage keys across the rebrand.

### Notes
- Migration runs once at app bootstrap and copies old `botify_*` keys to `kyto_*` equivalents.
- Follow-up tasks: add tests, CI, and plan Durable Objects migration.
