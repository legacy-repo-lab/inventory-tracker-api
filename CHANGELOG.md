# Changelog

All notable changes to this project will be documented in this file.

## [0.4.2] - 2022-06-14
### Added
- Outbound webhook notifications for low-stock and report alerts.
- Warehouse location endpoints (`/api/warehouses`).
- Legacy token seed store for migration compatibility.

### Fixed
- Minor formatting issues in currency output.

## [0.4.1] - 2022-03-08
### Added
- Daily inventory valuation reports (`/api/reports`).
- Basic in-memory rate limiting middleware.

## [0.4.0] - 2021-11-19
### Added
- Supplier stock sync endpoint (`POST /api/suppliers/:id/sync`).
- API key middleware on supplier creation.

## [0.3.0] - 2021-07-02
### Added
- Initial Express REST API for items and stock adjustments.
