# AMS1One API Documentation

**Base URL:** `/api/v1/`

All endpoints require `Authorization: Bearer <access_token>`.

### File URLs

User and writer media (photos, ID cards) and APK releases are stored in a private S3 bucket. Any field that exposes a file URL — `photo_url`, `id_card_image_url`, `apk_url` — returns a **presigned S3 URL valid for 1 hour** from the moment the response was built. Do not cache these URLs longer than that, and don't construct them client-side from a filename; always render whatever the API returns.

---

## Table of Contents

### Authentication

1. [Login Endpoint](#login-endpoint)
2. [Logout Endpoint](#logout-endpoint)

### Admin User Management

- [List / Create Admin Users](#list--create-admin-users)
- [Edit Admin User](#edit-admin-user)
- [Activity Logs](#activity-logs)

### Dashboard Pages & Roles

- [Get My Pages](#get-my-pages)
- [Page Catalog](#page-catalog)
- [Master page key list](#master-page-key-list)
- [Dashboard Roles (CRUD)](#dashboard-roles)
  - [List Roles](#list-roles)
  - [Create Role](#create-role)
  - [Retrieve Role](#retrieve-role)
  - [Update Role](#update-role)
  - [Delete Role](#delete-role)

### Sales — Dashboard

3. [Writer Statistics Endpoint](#writer-statistics-endpoint)
4. [Detailed Tickets Endpoint](#detailed-tickets-endpoint)
5. [Game Types Endpoint](#game-types-endpoint)
6. [Today's Sales Endpoint](#todays-sales-endpoint)
7. [Today's Top Ups Endpoint](#todays-top-ups-endpoint)
8. [Available Float Endpoint](#available-float-endpoint)
9. [Today's Claims Endpoint](#todays-claims-endpoint)
10. [Today's Wins Endpoint](#todays-wins-endpoint)
11. [Winning Events Endpoint](#winning-events-endpoint)
12. [Winners List Endpoint](#winners-list-endpoint)

### Draw — Dashboard

16. [Draws & Winnings Table](#draws--winnings-table)
17. [Draw Event Tickets](#draw-event-tickets)
18. [Draws & Winnings Dashboard Card](#draws--winnings-dashboard-card)

### Auto-Draw (Computerised Draw)

- [Drawable Today](#drawable-today)
- [Auto-Draw Event](#auto-draw-event)

### Analysis — Dashboard

13. [Active Writer Daily Stats Endpoint](#active-writer-daily-stats-endpoint)
14. [Download Active Writer Daily Stats Endpoint](#download-active-writer-daily-stats-endpoint)
15. [Top Writers Endpoint](#top-writers-endpoint)
16. [Top-Up Statistics](#top-up-statistics)
17. [Winning Statistics](#winning-statistics)
18. [Best & Worst Performance](#best--worst-performance)
19. [Retention Rate](#retention-rate)
20. [Retention Rate Trend](#retention-rate-trend)
21. [Sales Card](#sales-card)
22. [Net Top-Ups Card](#net-top-ups-card)
23. [Writers at Work Card](#writers-at-work-card)
24. [Wins Card](#wins-card)
25. [Liquidation Card](#liquidation-card)
26. [Settlements Card](#settlements-card)

### Writers — Dashboard

- [Register Writer](#register-writer)
- [All Writers](#all-writers)
- [Writer Profile](#writer-profile)
- [Writer Sales](#writer-sales-admin)
- [Writer Winnings](#writer-winnings)
- [Writer Top-Ups (Admin)](#writer-top-ups-admin)
- [Writer Cashouts](#writer-cashouts)

### POS Devices (Writer Self-Service)

- [Register POS Device](#register-pos-device)
- [Report Device Location](#report-device-location)
- [POS Device Locations (Map)](#pos-device-locations-map)

### Events & QR Tickets

- [Create Event](#create-event)
- [List Events](#list-events)
- [Issue Tickets](#issue-tickets)
- [Send Tickets via SMS](#send-tickets-via-sms)
- [Public Ticket Payload (for FE)](#public-ticket-payload-for-fe)
- [List Event Tickets](#list-event-tickets)
- [Scan Ticket at the Gate](#scan-ticket-at-the-gate)

### Players — Dashboard

Split per game family: Dollar Rush and 5/90. Each route below has a parallel `dollar-rush` and `five-ninety` URL — see the section preamble for the mapping.

- [List Players](#list-players)
- [Player Stats](#player-stats)
- [Player Detail](#player-detail)
- [Player Tickets](#player-tickets)
- [Player Wins](#player-wins)
- [Player Transactions](#player-transactions)

### Supervisors

- [Register Supervisor](#register-supervisor)
- [Edit Supervisor](#edit-supervisor)
- [List Supervisors with Owner Details](#list-supervisors-with-owner-details)
- [Detail Cards](#detail-cards)
- [Snapshot](#supervisor-snapshot)
- [Summary](#summary)
- [Writers Overview](#writers-overview)
- [Transactions](#transactions)

### Admin Payouts

- [Send Admin Payout](#send-admin-payout)

### App Releases

- [Get Latest Release](#get-latest-release)
- [Upload Release](#upload-release)

### Reports

- [List Reports](#list-reports)
- [Get Report Schema](#get-report-schema)
- [Execute Report](#execute-report)
- [Download Report (Excel)](#download-report-excel)

#### Report Catalogue

| ID  | Name                                                                     | Category   |
| --- | ------------------------------------------------------------------------ | ---------- |
| 1   | [30 Days Sales Tracker](#report-1-30-days-sales-tracker)                 | Operations |
| 2   | [Bank Transfer - Batch Details](#report-2-bank-transfer---batch-details) | Finance    |
| 3   | [Bank Transfers](#report-3-bank-transfers)                               | Finance    |
| 5   | [Commission Payments](#report-5-commission-payments)                     | Finance    |
| 6   | [Ticket Query](#report-6-ticket-query)                                   | Finance    |
| 7   | [Daily Sales](#report-7-daily-sales)                                     | Finance    |
| 8   | [Daily Sales & Winnings](#report-8-daily-sales--winnings)                | Finance    |
| 9   | [Finance - Payout](#report-9-finance---payout)                           | Finance    |
| 14  | [Revenue Per Play](#report-14-revenue-per-play)                          | Finance    |
| 17  | [Ticket Status](#report-17-ticket-status)                                | General    |
| 18  | [Active Writers](#report-18-active-writers)                              | General    |
| 19  | [Terminal History](#report-19-terminal-history)                          | General    |
| 20  | [Winning Stakes Report](#report-20-winning-stakes-report)                | General    |
| 21  | [All Stakes Report](#report-21-all-stakes-report)                        | Operations |
| 23  | [Topup - Claims as Credit](#report-23-topup---claims-as-credit)          | Finance    |
| 24  | [Topup - Supervisor Transfers](#report-24-topup---supervisor-transfers)  | Finance    |
| 25  | [Topup - Mobile Money](#report-25-topup---mobile-money)                  | Finance    |
| 26  | [Writers - Active Writers](#report-26-writers---active-writers)          | General    |
| 27  | [Export Top-Ups](#report-27-export-top-ups)                              | Finance    |
| 28  | [Export Sales](#report-28-export-sales)                                  | Finance    |
| 29  | [Export Wins](#report-29-export-wins)                                    | Finance    |

---

## Login Endpoint

**`POST /api/v1/auth/login/`**

**Permission:** Public

Accepts `phone` + `password` or `email` + `password`.

**Request**

```json
{ "phone": "+233244979958", "password": "secret" }
```

or

```json
{ "email": "frank@writer.ams1one.com", "password": "secret" }
```

**Response `200 OK`**

```json
{
  "access": "<access_token>",
  "refresh": "<refresh_token>"
}
```

---

## Logout Endpoint

**`POST /api/v1/auth/logout/`**

**Permission:** Public

Blacklists the refresh token, invalidating the session.

**Request**

```json
{ "refresh": "<refresh_token>" }
```

**Response `200 OK`**

```json
{}
```

---

---

# Admin User Management

All endpoints below are under **`/api/v1/auth/users/`** and require **Admin** permission.

---

## List / Create Admin Users

**`GET /api/v1/auth/users/admins/`** — List all admin and operator users (paginated, searchable).

**`POST /api/v1/auth/users/admins/`** — Create a new admin or operator user.

**Permission:** Admin only

### GET — List

**Query Parameters**

| Parameter | Type    | Description                                                  |
| --------- | ------- | ------------------------------------------------------------ |
| `search`  | string  | Filter by first name, last name, or phone (case-insensitive) |
| `page`    | integer | Page number                                                  |

**Response `200 OK`**

```json
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "a1b2c3d4-...",
      "email": "admin@ams1one.com",
      "first_name": "Kwame",
      "last_name": "Asante",
      "full_name": "Kwame Asante",
      "phone": "+233501234567",
      "role": "admin",
      "is_active": true,
      "photo": null
    }
  ]
}
```

### POST — Create

**Request Body**

```json
{
  "email": "operator@ams1one.com",
  "first_name": "Kwame",
  "last_name": "Asante",
  "phone": "+233501234567",
  "password": "securepass123",
  "role": "operator",
  "role_id": "5d2e8b1a-1f8c-4f3a-9e6d-7b9c1a2d3e4f"
}
```

| Field        | Type   | Required | Description                                                                                                                                                            |
| ------------ | ------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `email`      | string | Yes      | Must be unique across all users                                                                                                                                        |
| `first_name` | string | Yes      | —                                                                                                                                                                      |
| `last_name`  | string | Yes      | —                                                                                                                                                                      |
| `phone`      | string | No       | E.164 format; must be unique if provided                                                                                                                               |
| `password`   | string | Yes      | Minimum 8 characters                                                                                                                                                   |
| `role`       | string | No       | `"admin"` or `"operator"` — defaults to `"admin"`                                                                                                                      |
| `role_id`    | UUID   | No       | UUID of the [DashboardRole](#dashboard-roles) that decides which pages this user can see on the frontend. Omit or `null` to leave unassigned (user will see no pages). |

**Response `201 Created`**

```json
{
  "id": "a1b2c3d4-...",
  "email": "operator@ams1one.com",
  "first_name": "Kwame",
  "last_name": "Asante",
  "full_name": "Kwame Asante",
  "phone": "+233501234567",
  "role": "operator",
  "is_active": true,
  "photo": null,
  "dashboard_role": { "id": "5d2e8b1a-...", "name": "Reports Manager" },
  "pages": ["reports.list", "reports.execute", "reports.download"]
}
```

`dashboard_role` is `null` if the user has no role assigned. `pages` is `"*"` for admins, superusers, and any role other than `operator` (their menus are role-driven).

**Error Responses**

| Status | Cause                                                                  |
| ------ | ---------------------------------------------------------------------- |
| `400`  | Duplicate email or phone, missing required field, or unknown `role_id` |
| `403`  | Caller is not an admin                                                 |

---

## Edit Admin User

**`PATCH /api/v1/auth/users/{pk}/admin-edit/`**

**Permission:** Admin only

Partially updates an admin or operator user's details. All fields are optional.

**Path Parameters**

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `pk`      | UUID | User UUID   |

**Request Body**

```json
{
  "first_name": "Kofi",
  "last_name": "Mensah",
  "phone": "+233501234568",
  "is_active": false,
  "role_id": "5d2e8b1a-1f8c-4f3a-9e6d-7b9c1a2d3e4f"
}
```

| Field        | Type         | Required | Description                                                                                                               |
| ------------ | ------------ | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| `first_name` | string       | No       | —                                                                                                                         |
| `last_name`  | string       | No       | —                                                                                                                         |
| `phone`      | string       | No       | E.164 format; uniqueness check skipped if phone is unchanged                                                              |
| `is_active`  | boolean      | No       | Activate or deactivate the user                                                                                           |
| `role_id`    | UUID \| null | No       | If provided, reassigns the user to that [DashboardRole](#dashboard-roles). Pass `null` to clear. Omit to leave unchanged. |

**Response `200 OK`**

Full `AdminUserSerializer` output (same shape as the list response), including the user's current `dashboard_role` and derived `pages`.

**Error Responses**

| Status | Cause                                                       |
| ------ | ----------------------------------------------------------- |
| `400`  | Target user is not an admin or operator, or duplicate phone |
| `403`  | Caller is not an admin                                      |

---

## Activity Logs

**`GET /api/v1/auth/users/activity-logs/`**

**Permission:** Admin only

Returns a paginated list of admin dashboard actions — user creation, edits, and logins — ordered newest-first.

**Query Parameters**

| Parameter | Type    | Description |
| --------- | ------- | ----------- |
| `page`    | integer | Page number |

**Response `200 OK`**

```json
{
  "count": 10,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "actor_name": "Kwame Asante",
      "actor_email": "admin@ams1one.com",
      "action": "create_admin",
      "description": "Created admin user Kofi Mensah",
      "created_at": "2026-04-30T10:00:00Z"
    }
  ]
}
```

| Field         | Type     | Description                                    |
| ------------- | -------- | ---------------------------------------------- |
| `id`          | integer  | Log entry ID                                   |
| `actor_name`  | string   | Full name of the user who performed the action |
| `actor_email` | string   | Email of the actor                             |
| `action`      | string   | One of: `login`, `create_admin`, `edit_admin`  |
| `description` | string   | Human-readable description of the action       |
| `created_at`  | datetime | When the action occurred                       |

---

# Dashboard Pages & Roles

Page-level access control for **admin and operator users only**, organised as reusable **roles**.

**Concepts**

- **Page** — a single navigable page on the dashboard, identified by a stable `key` (e.g. `sales.today_sales`). The frontend uses this key to decide whether to render a menu item.
- **DashboardRole** — a named bundle of pages (e.g. _"Reports Manager"_, _"Sales Operator"_). An admin creates a role once, then assigns it to one or many users.
- **Assignment** — each admin/operator user has at most one `dashboard_role`. The user's visible menu is the union of pages on that role.

**Scope and boundaries**

- Applies only to users with role `admin` or `operator`. Other roles (`writer`, `supervisor`, `draw_master`, `player`) have menus driven by their role and always return `"pages": "*"`.
- **Superusers always see all pages** — the `pages` field returns `"*"` regardless of role assignment. This prevents an admin from accidentally locking themselves out.
- This system controls **menu visibility on the frontend only**. API authorization is still enforced by DRF permission classes on every endpoint, independent of dashboard role.
- No roles are seeded — the catalog starts empty. Admins create roles via the [Create Role](#create-role) endpoint and assign them to users via `role_id` on the [List / Create Admin Users](#list--create-admin-users) and [Edit Admin User](#edit-admin-user) endpoints.

## Get My Pages

**`GET /api/v1/auth/me/pages/`**

**Permission:** Any authenticated user

Returns the list of page keys the calling user is allowed to see. The frontend should call this immediately after login and use it to filter the menu.

**Response `200 OK`** — operator with explicit grants:

```json
{
  "role": "operator",
  "is_superuser": false,
  "pages": ["sales.today_sales", "writers.list", "reports.list"]
}
```

**Response `200 OK`** — admin (or any non-operator role):

```json
{
  "role": "admin",
  "is_superuser": false,
  "pages": "*"
}
```

| Field          | Type                      | Description                                                                        |
| -------------- | ------------------------- | ---------------------------------------------------------------------------------- |
| `role`         | string                    | User's role (`admin`, `operator`, `writer`, `supervisor`, `draw_master`, `player`) |
| `is_superuser` | boolean                   | Whether this user is a Django superuser                                            |
| `pages`        | array of strings \| `"*"` | List of granted page keys, or `"*"` for wildcard access                            |

## Page Catalog

**`GET /api/v1/permissions/pages/`**

**Permission:** Admin only

Returns the full catalog of dashboard pages available in the system. Used by the admin UI to render the "which pages can this user see" checkbox list when creating or editing an operator.

**Response `200 OK`**

```json
[
  {
    "id": "...",
    "key": "sales.today_sales",
    "name": "Today's Sales",
    "category": "Sales",
    "order": 40,
    "is_active": true
  }
]
```

| Field       | Type    | Description                                                                                       |
| ----------- | ------- | ------------------------------------------------------------------------------------------------- |
| `key`       | string  | Stable identifier referenced from a DashboardRole's `page_keys`. Contract with the frontend menu. |
| `name`      | string  | Human-readable label for the admin UI                                                             |
| `category`  | string  | Display group, e.g. `"Sales"`, `"Reports"`                                                        |
| `order`     | integer | Within-category sort order                                                                        |
| `is_active` | boolean | Inactive pages are filtered out of `/me/pages/` but still listed here                             |

### Master page key list

These are the keys the backend recognises. Frontend menu registry must use the exact same strings.

| Category              | Key                                     | Label                        |
| --------------------- | --------------------------------------- | ---------------------------- |
| Admin User Management | `admin.users`                           | Admin Users                  |
| Admin User Management | `admin.activity_logs`                   | Activity Logs                |
| Sales                 | `sales.writer_statistics`               | Writer Statistics            |
| Sales                 | `sales.detailed_tickets`                | Detailed Tickets             |
| Sales                 | `sales.game_types`                      | Game Types                   |
| Sales                 | `sales.today_sales`                     | Today's Sales                |
| Sales                 | `sales.today_topups`                    | Today's Top-Ups              |
| Sales                 | `sales.available_float`                 | Available Float              |
| Sales                 | `sales.today_claims`                    | Today's Claims               |
| Sales                 | `sales.today_wins`                      | Today's Wins                 |
| Sales                 | `sales.winning_events`                  | Winning Events               |
| Sales                 | `sales.winners_list`                    | Winners List                 |
| Draw                  | `draw.draws_winnings_table`             | Draws & Winnings Table       |
| Draw                  | `draw.draw_event_tickets`               | Draw Event Tickets           |
| Draw                  | `draw.draws_winnings_card`              | Draws & Winnings Card        |
| Auto-Draw             | `autodraw.drawable_today`               | Drawable Today               |
| Auto-Draw             | `autodraw.event`                        | Auto-Draw Event              |
| Analysis              | `analysis.active_writer_daily`          | Active Writer Daily Stats    |
| Analysis              | `analysis.active_writer_daily_download` | Active Writer Daily Download |
| Analysis              | `analysis.top_writers`                  | Top Writers                  |
| Analysis              | `analysis.topup_stats`                  | Top-Up Statistics            |
| Analysis              | `analysis.winning_stats`                | Winning Statistics           |
| Analysis              | `analysis.best_worst`                   | Best & Worst Performance     |
| Analysis              | `analysis.retention_rate`               | Retention Rate               |
| Analysis              | `analysis.retention_trend`              | Retention Rate Trend         |
| Analysis              | `analysis.sales_card`                   | Sales Card                   |
| Analysis              | `analysis.net_topups_card`              | Net Top-Ups Card             |
| Analysis              | `analysis.writers_at_work_card`         | Writers at Work Card         |
| Analysis              | `analysis.wins_card`                    | Wins Card                    |
| Analysis              | `analysis.liquidation_card`             | Liquidation Card             |
| Analysis              | `analysis.settlements_card`             | Settlements Card             |
| Writers               | `writers.register`                      | Register Writer              |
| Writers               | `writers.list`                          | All Writers                  |
| Writers               | `writers.profile`                       | Writer Profile               |
| Writers               | `writers.sales`                         | Writer Sales                 |
| Writers               | `writers.winnings`                      | Writer Winnings              |
| Writers               | `writers.topups`                        | Writer Top-Ups               |
| Writers               | `writers.cashouts`                      | Writer Cashouts              |
| Players — Dollar Rush | `players.dollar_rush.list`              | List Players                 |
| Players — Dollar Rush | `players.dollar_rush.stats`             | Player Stats                 |
| Players — Dollar Rush | `players.dollar_rush.detail`            | Player Detail                |
| Players — 5/90        | `players.five_ninety.list`              | List Players                 |
| Players — 5/90        | `players.five_ninety.stats`             | Player Stats                 |
| Players — 5/90        | `players.five_ninety.detail`            | Player Detail                |
| Supervisors           | `supervisors.register`                  | Register Supervisor          |
| Supervisors           | `supervisors.list`                      | List Supervisors             |
| Supervisors           | `supervisors.detail`                    | Supervisor Detail            |
| Supervisors           | `supervisors.snapshot`                  | Supervisor Snapshot          |
| Supervisors           | `supervisors.summary`                   | Supervisor Summary           |
| Supervisors           | `supervisors.writers_overview`          | Writers Overview             |
| Supervisors           | `supervisors.transactions`              | Supervisor Transactions      |
| Admin Payouts         | `admin_payouts.send`                    | Send Admin Payout            |
| Reports               | `reports.list`                          | List Reports                 |
| Reports               | `reports.execute`                       | Execute Report               |
| Reports               | `reports.download`                      | Download Report              |

## Dashboard Roles

CRUD for reusable role templates. All endpoints require **Admin** permission.

### List Roles

**`GET /api/v1/permissions/roles/`**

Returns every role with its page keys and the current user count.

**Response `200 OK`**

```json
[
  {
    "id": "5d2e8b1a-1f8c-4f3a-9e6d-7b9c1a2d3e4f",
    "name": "Reports Manager",
    "description": "Finance team — read-only access to reports.",
    "page_keys": ["reports.list", "reports.execute", "reports.download"],
    "user_count": 3,
    "created_at": "2026-05-12T09:00:00Z",
    "updated_at": "2026-05-12T09:00:00Z"
  }
]
```

### Create Role

**`POST /api/v1/permissions/roles/`**

This is the backend behind the "New Role" form.

**Request Body**

```json
{
  "name": "Reports Manager",
  "description": "Finance team — read-only access to reports.",
  "page_keys": ["reports.list", "reports.execute", "reports.download"]
}
```

| Field         | Type             | Required | Description                                                        |
| ------------- | ---------------- | -------- | ------------------------------------------------------------------ |
| `name`        | string           | Yes      | Unique across all roles (case-insensitive)                         |
| `description` | string           | No       | Free-text explanation shown in the admin UI                        |
| `page_keys`   | array of strings | No       | Page keys this role grants. Omit or `[]` for a role with no pages. |

**Response `201 Created`** — same shape as the list entry above.

**Error Responses**

| Status | Cause                                                            |
| ------ | ---------------------------------------------------------------- |
| `400`  | Duplicate role name, unknown page key, or missing required field |
| `403`  | Caller is not an admin                                           |

### Retrieve Role

**`GET /api/v1/permissions/roles/{id}/`** — same shape as the list entry.

### Update Role

**`PATCH /api/v1/permissions/roles/{id}/`**

Partial update. All fields optional. If `page_keys` is provided, it **fully replaces** the role's pages (pass `[]` to clear). If `page_keys` is omitted, the page set is untouched.

**Request Body** — same shape as create.

**Response `200 OK`** — full role payload.

Any user currently assigned this role sees the new page set immediately on their next `/me/pages/` call — no per-user update needed.

### Delete Role

**`DELETE /api/v1/permissions/roles/{id}/`**

**Response `204 No Content`** on success.

**Error Responses**

| Status | Cause                                                                                   |
| ------ | --------------------------------------------------------------------------------------- |
| `400`  | One or more users are still assigned to this role (`role_in_use`). Reassign them first. |
| `403`  | Caller is not an admin                                                                  |

---

### Rollout notes for existing users

No roles are seeded. After migration, every admin and operator user has `dashboard_role = null` — they will see no dashboard pages until a role is created and assigned. The bootstrap superuser (created via `createsuperuser`) bypasses this entirely and always sees `"pages": "*"`, so they can log in, create the first role, and assign it to others.

---

## Writer Statistics Endpoint

**`GET /api/v1/writers/statistics/`**

**Permission:** Writer or above

Returns per-writer sales, stakes, and top-up totals.

```json
{
  "totalwriterFloat": "USD 14,826.43",
  "totalwriters": "42",
  "writers": [
    {
      "sales": "USD 14,826.43",
      "total_stakes": "20",
      "topup": "USD 10,291.00",
      "writer": {
        "id": "32",
        "name": "Frank Mawuli",
        "profileImage": null,
        "online": false,
        "lastSeen": "2026-04-27 22:24:53",
        "contact": {
          "email": "frank@writer.ams1one.com",
          "phone": "+233244979958"
        }
      }
    }
  ]
}
```

---

## Detailed Tickets Endpoint

**`GET /api/v1/sales/tickets/detailed-list/`**

**Permission:** Operator or above

Paginated detailed ticket list with stake and writer information. **Returns tickets sold today only** (server-side `sold_at::date = today` in the configured timezone — currently UTC). Use the report endpoints if you need a different date range.

```json
{
  "count": 2425,
  "next": "...?page=2",
  "previous": null,
  "results": [
    {
      "ticket_no": "202604272216000084067183",
      "time": "2026-04-27 22:16:00",
      "total_stake_amount": "0.50",
      "total_stake": 1,
      "play_group": "Direct",
      "writer_name": "SANI HUSEMA",
      "stakes": [
        {
          "stake_id": "03dc36ce-c5fc-48bd-8130-0b40aa9a6e78",
          "created_at": "2026-04-27 22:16:00",
          "game": {
            "id": "0cd0be0b-...",
            "name": "Morning Dew",
            "code": "MVG"
          },
          "event_id": "e2234779-...",
          "event": "Morning Dew Tuesday",
          "play_group": "Direct",
          "play": "Direct 2 (2 Sure)",
          "numbers": "24,69",
          "stake_amount": "0.50",
          "original_numbers": "24,69",
          "player_phone": "",
          "stake_status": "ACTIVE",
          "writer": {
            "id": "84",
            "name": "SANI HUSEMA",
            "phone": "+233504300691"
          }
        }
      ]
    }
  ]
}
```

---

## Game Types Endpoint

**`GET /api/v1/games/types/`**

**Permission:** Writer or above

Returns all active game types.

---

## Today's Sales Endpoint

**`GET /api/v1/sales/tickets/today_sales/`**

**Permission:** Operator or above

Returns today's ticket sales totals, excluding cancelled tickets.

```json
{
  "date": "2026-04-27",
  "total_sales": 20322.1,
  "ticket_count": 200,
  "currency": "USD"
}
```

| Field          | Type    | Description                                   |
| -------------- | ------- | --------------------------------------------- |
| `date`         | string  | Today's date (ISO 8601)                       |
| `total_sales`  | number  | Sum of all non-cancelled ticket amounts today |
| `ticket_count` | integer | Count of non-cancelled tickets today          |
| `currency`     | string  | Always `"USD"`                                |

---

## Today's Top Ups Endpoint

**`GET /api/v1/writers/today-topup/`**

**Permission:** Writer or above

Returns total top-ups for today.

---

## Available Float Endpoint

**`GET /api/v1/writers/available-float/`**

**Permission:** Operator or above

Returns the total available float — sum of `airtime_balance` across all writer airtime wallets.

```json
{
  "available_float": "USD 124,064.43",
  "available_float_amount": 124064.43,
  "currency": "USD"
}
```

| Field                    | Type   | Description                                        |
| ------------------------ | ------ | -------------------------------------------------- |
| `available_float`        | string | Formatted total airtime balance across all writers |
| `available_float_amount` | number | Raw decimal value                                  |
| `currency`               | string | Always `"USD"`                                     |

---

## Today's Claims Endpoint

**`GET /api/v1/sales/wins/today_claims/`**

**Permission:** Operator or above

Returns today's claimed win amounts and successful withdrawals.

```json
{
  "date": "2026-04-07",
  "total_claims": 242846.4,
  "claims_withdrawn": 156942.6,
  "currency": "USD"
}
```

| Field              | Type   | Description                         |
| ------------------ | ------ | ----------------------------------- |
| `total_claims`     | number | Sum of wins claimed today           |
| `claims_withdrawn` | number | Sum of successful withdrawals today |
| `currency`         | string | Always `"USD"`                      |

---

## Today's Wins Endpoint

**`GET /api/v1/sales/wins/today_wins/`**

**Permission:** Operator or above

Returns today's total win amount and unique winning players.

```json
{
  "date": "2026-04-07",
  "total_win_amount": 287738.4,
  "unique_players": 749,
  "currency": "USD"
}
```

| Field              | Type    | Description                                     |
| ------------------ | ------- | ----------------------------------------------- |
| `total_win_amount` | number  | Sum of all wins computed today                  |
| `unique_players`   | integer | Distinct player phones on winning tickets today |
| `currency`         | string  | Always `"USD"`                                  |

---

## Winning Events Endpoint {#winning-events-endpoint}

**`GET /api/v1/sales/wins/winning-events/`**

**Permission:** Operator or above

Returns today's draw events with their winning numbers.

```json
{
  "date": "2026-04-07",
  "events": [
    {
      "event_id": 828,
      "event_name": "Morning Dew",
      "event_no": 828,
      "winning_numbers": [43, 5, 90, 56, 70]
    }
  ]
}
```

| Field             | Type    | Description                 |
| ----------------- | ------- | --------------------------- |
| `event_id`        | integer | Draw event number           |
| `event_name`      | string  | Draw event name             |
| `event_no`        | integer | Draw event number           |
| `winning_numbers` | array   | Numbers drawn for the event |

---

## Winners List Endpoint {#winners-list-endpoint}

**`GET /api/v1/sales/wins/winners-list/`**

**Permission:** Operator or above

Returns today's full winners list with staked and winning numbers.

```json
{
  "date": "2026-04-27",
  "winners": [
    {
      "numbers_staked": [[11, 19, 34, 45]],
      "winning_lines": [[11, 19, 34, 45]],
      "win_amount": 24.0,
      "player_phone": "",
      "writer_name": "Thompson Lord",
      "event_name": "Monday Special",
      "event_no": 1027
    }
  ]
}
```

| Field            | Type    | Description                                     |
| ---------------- | ------- | ----------------------------------------------- |
| `numbers_staked` | array   | All numbers on each stake of the winning ticket |
| `winning_lines`  | array   | Stakes that were marked as winners              |
| `win_amount`     | number  | Total win amount                                |
| `player_phone`   | string  | Player phone (empty for POS tickets)            |
| `writer_name`    | string  | Writer who sold the ticket                      |
| `event_name`     | string  | Draw event name                                 |
| `event_no`       | integer | Draw event number                               |

---

---

# Writers Endpoints

---

## Active Writer Daily Stats Endpoint

**`GET /api/v1/writers/active-writer-daily-stats/`**

**Permission:** Operator or above

Returns day-by-day active writer counts for the last N days (default 30), or a monthly breakdown when `?days=365`.

**Query Parameters**

| Parameter | Type    | Default | Description                                           |
| --------- | ------- | ------- | ----------------------------------------------------- |
| `days`    | integer | `30`    | `30` for daily breakdown, `365` for monthly breakdown |

**Response — `?days=30` (daily)**

```json
{
  "totals": {
    "total_writers": 84,
    "active_writers": 12
  },
  "period": {
    "start_date": "2026-03-30",
    "end_date": "2026-04-28",
    "days": 30
  },
  "download_url": "http://example.com/api/v1/writers/download-active-writer-daily-stats/?days=30",
  "days": [
    { "day": "2026-03-30", "active_writers": 0 },
    { "day": "2026-04-27", "active_writers": 3 },
    { "day": "2026-04-28", "active_writers": 5 }
  ]
}
```

**Response — `?days=365` (monthly)**

```json
{
  "totals": {
    "total_writers": 84,
    "active_writers": 12
  },
  "period": {
    "start_date": "2025-05-01",
    "end_date": "2026-04-28",
    "days": 365
  },
  "download_url": "http://example.com/api/v1/writers/download-active-writer-daily-stats/?days=365",
  "months": [
    { "month": "May '25", "active_writers": 0 },
    { "month": "Apr '26", "active_writers": 7 }
  ]
}
```

| Field                   | Type    | Description                                            |
| ----------------------- | ------- | ------------------------------------------------------ |
| `totals.total_writers`  | integer | All writers in the system                              |
| `totals.active_writers` | integer | Writers with at least one active ticket in the period  |
| `period.start_date`     | string  | First date of the period (ISO 8601)                    |
| `period.end_date`       | string  | Last date of the period (ISO 8601)                     |
| `download_url`          | string  | URL to download the same data as `.xlsx`               |
| `days`                  | array   | Present when `days=30` — one entry per calendar day    |
| `months`                | array   | Present when `days=365` — one entry per calendar month |

---

## Download Active Writer Daily Stats Endpoint

**`GET /api/v1/writers/download-active-writer-daily-stats/`**

**Permission:** Operator or above

Downloads the active writer stats as an Excel (`.xlsx`) file. Accepts the same `?days=` parameter as the JSON endpoint.

**Query Parameters**

| Parameter | Type    | Default | Description                                   |
| --------- | ------- | ------- | --------------------------------------------- |
| `days`    | integer | `30`    | `30` for daily sheet, `365` for monthly sheet |

**Response**

Binary `.xlsx` file download.

```
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename="active_writers_2026-03-30_2026-04-28.xlsx"
```

The workbook contains two sheets:

- **Active Writers** — main data (Day/Month + Active Writers columns)
- **Summary** — period metadata (start date, end date, days, total writers, active writers in period)

---

## Top Writers Endpoint

**`GET /api/v1/writers/top-writers/`**

**Permission:** Operator or above

Returns the top N writers ranked by total sales (all-time).

**Query Parameters**

| Parameter | Type    | Default | Max  | Description                 |
| --------- | ------- | ------- | ---- | --------------------------- |
| `limit`   | integer | `10`    | `50` | Number of writers to return |

**Response `200 OK`**

```json
{
  "writers": [
    {
      "rank": 1,
      "writer_id": 32,
      "writer_name": "Frank Mawuli",
      "photo_url": null,
      "total_sales": {
        "formatted": "USD 16,951.43",
        "amount": 16951.43
      },
      "net_profit": {
        "formatted": "USD 16,951.43",
        "amount": 16951.43
      }
    },
    {
      "rank": 2,
      "writer_id": 5,
      "writer_name": "Occc Appiah",
      "photo_url": null,
      "total_sales": {
        "formatted": "USD 13,267.70",
        "amount": 13267.7
      },
      "net_profit": {
        "formatted": "USD 13,267.70",
        "amount": 13267.7
      }
    }
  ]
}
```

| Field                   | Type           | Description                                            |
| ----------------------- | -------------- | ------------------------------------------------------ |
| `rank`                  | integer        | Position by total sales (1 = highest)                  |
| `writer_id`             | integer        | Writer's numeric ID                                    |
| `writer_name`           | string         | Writer's full name                                     |
| `photo_url`             | string \| null | Absolute URL to writer photo, or `null`                |
| `total_sales.formatted` | string         | Formatted total ticket sales (ACTIVE/WON/LOST/CLAIMED) |
| `total_sales.amount`    | number         | Raw total sales amount                                 |
| `net_profit.formatted`  | string         | Formatted net profit (`total_sales - wins_paid`)       |
| `net_profit.amount`     | number         | Raw net profit amount                                  |

---

---

# Writers — Admin Endpoints

All endpoints below are under **`/api/v1/writers/`** and require **Operator or above** permission.

---

## Register Writer

**`POST /api/v1/writers/register/`**

**Permission:** Operator or above

Creates a new `User` (role=`writer`), a linked `Writer` record, and auto-initialises the `AirtimeWallet` and `ClaimsWallet` in one atomic transaction.

**Request Body** (JSON or `multipart/form-data` when uploading a photo)

```json
{
  "email": "jane.smith@writer.ams1one.com",
  "first_name": "Jane",
  "last_name": "Smith",
  "phone": "+233501234567",
  "password": "securepassword123",
  "supervisor_id": "3efd7ffb-5aff-4bc9-adcd-f421c58b8065",
  "date_of_birth": "1990-05-15",
  "location_address": "Madina Market, Accra"
}
```

| Field              | Type   | Required | Description                                 |
| ------------------ | ------ | -------- | ------------------------------------------- |
| `email`            | string | Yes      | Must be unique across all users             |
| `first_name`       | string | Yes      | —                                           |
| `last_name`        | string | Yes      | —                                           |
| `phone`            | string | Yes      | E.164 format; must be unique                |
| `password`         | string | Yes      | Minimum 8 characters                        |
| `photo`            | file   | No       | Writer photo (multipart only)               |
| `supervisor_id`    | UUID   | Yes      | UUID of the supervising `Supervisor` record |
| `date_of_birth`    | date   | Yes      | `YYYY-MM-DD`                                |
| `location_address` | string | No       | Operating location or landmark              |

**Response `201 Created`**

Full `WriterSerializer` output including wallet balances.

```json
{
  "id": "...",
  "writer_id": 85,
  "full_name": "Jane Smith",
  "supervisor": { "id": "...", "code": "SUP-0001", "name": "Super Visor" },
  "user": {
    "id": "...",
    "email": "jane.smith@writer.ams1one.com",
    "full_name": "Jane Smith"
  },
  "status": "active",
  "date_of_birth": "1990-05-15",
  "location_address": "Madina Market, Accra",
  "airtime_balance": "0.00",
  "claims_balance": "0.00",
  "last_transaction_date": null,
  "days_on_platform": 0,
  "created_at": "2026-04-30T10:00:00Z",
  "updated_at": "2026-04-30T10:00:00Z"
}
```

**Error Responses**

| Status | Cause                                                                     |
| ------ | ------------------------------------------------------------------------- |
| `400`  | Duplicate email or phone, invalid `supervisor_id`, missing required field |
| `403`  | Caller is not operator or above                                           |

---

## All Writers

**`GET /api/v1/writers/all/`**

**Permission:** Operator or above

Paginated list of all writers with YTD sales, top-ups, and activity stats. Used for the admin writer table.

**Query Parameters**

| Parameter | Type    | Description                                                                   |
| --------- | ------- | ----------------------------------------------------------------------------- |
| `search`  | string  | Filter by first name, last name, or phone (case-insensitive)                  |
| `status`  | string  | Filter by writer status: `active`, `passive`, `inactive`, `recover`, `no_use` |
| `page`    | integer | Page number                                                                   |

**Response `200 OK`**

```json
{
  "count": 84,
  "next": "...?page=2",
  "previous": null,
  "results": [
    {
      "id": "...",
      "writer_id": 32,
      "name": "Frank Mawuli",
      "phone": "+233244979958",
      "status": "active",
      "supervisor_name": "Super Visor",
      "location_address": "Madina Market",
      "ytd_sales": "14826.43",
      "ytd_topups": "10291.00",
      "last_transaction": "2026-04-28T22:16:00Z",
      "days_on_task": 28,
      "created_at": "2026-01-15T08:00:00Z"
    }
  ]
}
```

| Field              | Type             | Description                                            |
| ------------------ | ---------------- | ------------------------------------------------------ |
| `id`               | UUID             | Writer UUID                                            |
| `writer_id`        | integer          | Human-readable writer ID                               |
| `name`             | string           | Writer's full name                                     |
| `phone`            | string           | Writer's phone number                                  |
| `status`           | string           | Current writer status                                  |
| `supervisor_name`  | string \| null   | Full name of the supervising user                      |
| `location_address` | string           | Operating location                                     |
| `ytd_sales`        | decimal string   | YTD ticket sales (valid statuses only)                 |
| `ytd_topups`       | decimal string   | YTD top-up total                                       |
| `last_transaction` | datetime \| null | Most recent valid ticket datetime                      |
| `days_on_task`     | integer          | Distinct days with at least one valid ticket this year |
| `created_at`       | datetime         | Registration date                                      |

---

## Writer Profile

**`GET /api/v1/writers/{pk}/profile/`**

**Permission:** Operator or above

Returns the full writer profile for the detail page — summary cards, wallet balances, YTD and month aggregates, and performance tier.

**Path Parameters**

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `pk`      | UUID | Writer UUID |

**Response `200 OK`**

```json
{
  "id": "...",
  "writer_id": 32,
  "name": "Frank Mawuli",
  "phone": "+233244979958",
  "email": "frank@writer.ams1one.com",
  "photo_url": null,
  "status": "active",
  "supervisor_name": "Super Visor",
  "location_address": "Madina Market",
  "date_of_birth": "1992-03-10",
  "airtime_balance": "583.00",
  "claims_balance": "0.00",
  "ytd_sales": "14826.43",
  "ytd_topups": "10291.00",
  "ytd_winnings": "1200.00",
  "month_sales": "2100.00",
  "month_topups": "1500.00",
  "last_transaction": "2026-04-28T22:16:00Z",
  "days_on_task": 28,
  "lifetime_avg_sale": "6.12",
  "avg_topup": "245.02",
  "tier": "Tier III",
  "created_at": "2026-01-15T08:00:00Z"
}
```

| Field               | Type             | Description                                                                                          |
| ------------------- | ---------------- | ---------------------------------------------------------------------------------------------------- |
| `airtime_balance`   | decimal string   | Current airtime wallet balance                                                                       |
| `claims_balance`    | decimal string   | Current claims wallet balance                                                                        |
| `ytd_sales`         | decimal string   | YTD ticket sales                                                                                     |
| `ytd_topups`        | decimal string   | YTD top-ups                                                                                          |
| `ytd_winnings`      | decimal string   | YTD win amounts on this writer's tickets                                                             |
| `month_sales`       | decimal string   | Current calendar month ticket sales                                                                  |
| `month_topups`      | decimal string   | Current calendar month top-ups                                                                       |
| `last_transaction`  | datetime \| null | Most recent valid ticket datetime                                                                    |
| `days_on_task`      | integer          | Distinct days with at least one valid ticket this year                                               |
| `lifetime_avg_sale` | decimal string   | Average ticket value (all time)                                                                      |
| `avg_topup`         | decimal string   | Average top-up amount (all time)                                                                     |
| `tier`              | string           | `Tier I` (≥ USD 50k) / `Tier II` (≥ 20k) / `Tier III` (≥ 5k) / `Tier IV` (< 5k) based on YTD top-ups |

---

## Writer Sales (Admin) {#writer-sales-admin}

**`GET /api/v1/writers/{pk}/writer-sales/`**

**Permission:** Operator or above

Paginated ticket sales for a specific writer, newest first.

**Path Parameters**

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `pk`      | UUID | Writer UUID |

**Response `200 OK`**

```json
{
  "count": 256,
  "next": "...?page=2",
  "previous": null,
  "results": [
    {
      "id": "...",
      "ticket_no": "202604272216000084067183",
      "sold_at": "2026-04-27T22:16:00Z",
      "total_amount": "3.00",
      "event_no": 137,
      "event_name": "Tuesday Noon Rush",
      "game": "Morning Dew",
      "stake_count": 2,
      "status": "lost",
      "plays": [
        { "play": "Direct 2 (2 Sure)", "numbers": "24,69", "amount": "1.50" }
      ]
    }
  ]
}
```

---

## Writer Winnings

**`GET /api/v1/writers/{pk}/writer-winnings/`**

**Permission:** Operator or above

Paginated winnings for a specific writer, newest first.

**Response `200 OK`**

```json
{
  "count": 12,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "...",
      "ticket_no": "202604271200000032018291",
      "event_no": 136,
      "event_name": "Monday Special",
      "game": "Morning Dew",
      "stake_amount": "5.00",
      "win_amount": "125.00",
      "status": "claimed",
      "computed_at": "2026-04-27T14:00:00Z",
      "plays": [
        { "play": "Direct 3 (3 Sure)", "numbers": "11,34,67", "amount": "5.00" }
      ]
    }
  ]
}
```

| Field          | Type           | Description                        |
| -------------- | -------------- | ---------------------------------- |
| `stake_amount` | decimal string | Total ticket amount                |
| `win_amount`   | decimal string | Amount won                         |
| `status`       | string         | `pending`, `claimed`, `liquidated` |
| `computed_at`  | datetime       | When the win was computed          |

---

## Writer Top-Ups (Admin) {#writer-top-ups-admin}

**`GET /api/v1/writers/{pk}/writer-topups/`**

**Permission:** Operator or above

Paginated top-up history for a specific writer, newest first.

**Response `200 OK`**

```json
{
  "count": 42,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "...",
      "created_at": "2026-04-28T10:00:00Z",
      "method": "bank_transfer",
      "reference": "BATCH-001",
      "amount": "500.00",
      "airtime_credited": "500.00",
      "notes": ""
    }
  ]
}
```

| Field              | Type           | Description                                                  |
| ------------------ | -------------- | ------------------------------------------------------------ |
| `method`           | string         | Top-up method e.g. `bank_transfer`, `mobile_money`, `claims` |
| `reference`        | string         | Batch or transaction reference                               |
| `amount`           | decimal string | USD amount deposited                                         |
| `airtime_credited` | decimal string | Airtime credited to wallet                                   |

---

## Writer Cashouts

**`GET /api/v1/writers/{pk}/writer-cashouts/`**

**Permission:** Operator or above

Paginated successful withdrawal history for a specific writer, newest first.

**Response `200 OK`**

```json
{
  "count": 8,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "...",
      "created_at": "2026-04-27T11:00:00Z",
      "mobile_number": "+233244979958",
      "mobile_provider": "mtn",
      "reference": "WD_abc123",
      "amount": "150.00",
      "status": "success"
    }
  ]
}
```

| Field             | Type           | Description                                                |
| ----------------- | -------------- | ---------------------------------------------------------- |
| `mobile_provider` | string         | Mobile money provider e.g. `mtn`, `vodafone`, `airteltigo` |
| `reference`       | string         | Paystack transfer reference                                |
| `amount`          | decimal string | Amount withdrawn in USD                                    |
| `status`          | string         | Always `success` (only successful cashouts are returned)   |

---

# Admin Payouts

Send real money directly to any mobile money number via Paystack. Funds come from the company's Paystack balance — there is no source wallet to debit. Use this for ad-hoc disbursements, refunds outside the writer ledger, or supplier payouts.

---

## Send Admin Payout {#send-admin-payout}

**`POST /api/v1/payments/admin-payout/`**

**Permission:** Admin only

Initiates a Paystack mobile money transfer to an arbitrary phone number. The endpoint is **strictly idempotent** — the client must supply an `Idempotency-Key` header. A retry with the same key from the same admin returns the original payout and never starts a second transfer.

**Headers**

| Header            | Required | Description                                                                          |
| ----------------- | -------- | ------------------------------------------------------------------------------------ |
| `Authorization`   | yes      | `Bearer <access_token>` (admin role)                                                 |
| `Idempotency-Key` | yes      | Client-generated key, 1–100 chars. Reuse across retries of the same logical request. |

**Request body**

```json
{
  "amount": "50.00",
  "mobile_number": "+233501234567",
  "mobile_provider": "MTN",
  "recipient_name": "Test Recipient",
  "description": "Salary advance"
}
```

| Field             | Type           | Required | Description                                                                           |
| ----------------- | -------------- | -------- | ------------------------------------------------------------------------------------- |
| `amount`          | decimal string | yes      | Amount in USD. Minimum `0.01`.                                                        |
| `mobile_number`   | string         | yes      | Recipient phone in E.164 format (e.g. `+233501234567`).                               |
| `mobile_provider` | string         | yes      | One of `MTN`, `VOD` (Vodafone Cash), `ATL` (AirtelTigo).                              |
| `recipient_name`  | string         | yes      | Display name on the Paystack transfer. ≤150 chars.                                    |
| `description`     | string         | no       | Free-text reason for the payout. ≤255 chars. Sent to Paystack as the transfer reason. |

**Response `201 Created`**

```json
{
  "id": "8e21f4c8-3a47-4b8d-9aef-ce6c1b5d7f10",
  "reference": "ADP-9F4A1C2B6E0D8512",
  "amount": "50.00",
  "mobile_number": "+233501234567",
  "mobile_provider": "MTN",
  "recipient_name": "Test Recipient",
  "description": "Salary advance",
  "status": "pending",
  "paystack_recipient_code": "RCP_xxxxxx",
  "paystack_transfer_code": "TRF_xxxxxx",
  "idempotency_key": "abc-123",
  "created_at": "2026-05-24T10:15:00Z",
  "updated_at": "2026-05-24T10:15:00Z"
}
```

| Field                     | Type   | Description                                                                                                                                                               |
| ------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `reference`               | string | Server-generated transfer reference, always prefixed `ADP-`.                                                                                                              |
| `status`                  | string | `pending` immediately after the call. Flips to `success` or `failed` when Paystack's webhook arrives. **Do not show "sent" to the user until status flips to `success`.** |
| `paystack_recipient_code` | string | Paystack recipient ID (RCP\_…). Empty if the transfer initialisation hadn't succeeded yet.                                                                                |
| `paystack_transfer_code`  | string | Paystack transfer ID (TRF\_…). Same caveat.                                                                                                                               |

**Idempotency semantics**

- The key is scoped per admin: `(idempotency_key, created_by)` must be unique. Two different admins may use the same key value without colliding.
- Retrying with the same key but a **different body** still returns the original payout — the new body is ignored. This is intentional: if the first call succeeded at Paystack, replaying with new amounts would silently send more money.
- There is no expiry: a key is reserved forever once used by that admin.

**Error responses**

| Status            | When                                                                                                                                                                                                                                                                |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `400 Bad Request` | Missing or oversized `Idempotency-Key`, invalid body (amount ≤ 0, bad phone, unknown provider), **or** Paystack rejected the transfer (`PaystackError`). On Paystack rejection the `AdminPayout` row is still recorded with `status: "failed"` for the audit trail. |
| `403 Forbidden`   | Caller is not an admin.                                                                                                                                                                                                                                             |

**Note on retrying after a failure**: if the first call returns 400 because Paystack rejected the transfer, the row is recorded as `failed` against that idempotency key. Retrying with the **same** key returns that failed row, not a fresh attempt. To actually retry the transfer, generate a new `Idempotency-Key`.

**Lifecycle**

```
POST → AdminPayout row created (status=pending) → Paystack accepts (returns codes)
                                                ↓
                                    webhook transfer.success → status=success
                                                or
                                    webhook transfer.failed/reversed → status=failed
```

The webhook is shared with writer withdrawals. References starting with `ADP-` are routed to the `AdminPayout` table; references starting with `WD-` continue to update `Withdrawal` rows.

---

# App Releases

Distributes the writer-facing Android APK. Admin uploads a new build; writer devices fetch the latest published release on launch.

---

## Get Latest Release {#get-latest-release}

**`GET /api/v1/releases/latest/`**

**Permission:** Public (no `Authorization` header required). Called by the writer app on startup before the user logs in.

Returns the most recently uploaded **published** release, or null fields when no release exists.

**Response `200 OK` — release available**

```json
{
  "version": "1.4.2",
  "apk_url": "https://s3.eu-west-1.amazonaws.com/ams1one-staging/releases/apks/app-1.4.2.apk?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=3600&X-Amz-Signature=..."
}
```

**Response `200 OK` — no release yet**

```json
{
  "version": null,
  "apk_url": null
}
```

| Field     | Type           | Description                                                                                              |
| --------- | -------------- | -------------------------------------------------------------------------------------------------------- |
| `version` | string \| null | Free-form version string set at upload time (e.g. `"1.4.2"`). Not semver-validated.                      |
| `apk_url` | string \| null | **Presigned S3 URL, valid for 1 hour.** Do not cache; call this endpoint immediately before downloading. |

**Behaviour notes**

- "Latest" means the **most recently created** published row (ordered by `created_at` DESC), not the highest version number. If you upload `1.5.0` and then upload `1.4.5` afterwards (e.g. a rollback), `1.4.5` becomes "latest". Intentional — re-uploading an older version is the rollback mechanism.
- Rows with `is_published=false` are excluded. Unpublishing is currently done via Django admin.

---

## Upload Release {#upload-release}

**`POST /api/v1/releases/upload/`**

**Permission:** Admin only

Uploads a new APK to S3 and records it as a release. Content type must be `multipart/form-data`.

**Request body (multipart/form-data)**

| Field           | Type    | Required | Description                                                                               |
| --------------- | ------- | -------- | ----------------------------------------------------------------------------------------- |
| `version`       | string  | yes      | Display version (≤20 chars), e.g. `"1.4.2"`. Not validated as semver, not unique.         |
| `apk_file`      | file    | yes      | The APK binary. Uploaded to `s3://<bucket>/releases/apks/`.                               |
| `release_notes` | string  | no       | Free-text release notes. Defaults to empty.                                               |
| `is_published`  | boolean | no       | If `false`, the release is recorded but excluded from `GET /latest/`. Defaults to `true`. |

**Response `201 Created`**

```json
{
  "version": "1.4.2",
  "apk_url": "https://s3.eu-west-1.amazonaws.com/ams1one-staging/releases/apks/app-1.4.2.apk?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=3600&X-Amz-Signature=..."
}
```

**Error responses**

| Status            | When                                                                                          |
| ----------------- | --------------------------------------------------------------------------------------------- |
| `400 Bad Request` | Missing `version` or `apk_file`; validation failure. Errors flattened per project convention. |
| `403 Forbidden`   | Caller is not an admin.                                                                       |

---

# POS Devices (Writer Self-Service)

These endpoints are called by the writer's POS app/device while authenticated as the writer user.

---

## Register POS Device

**`POST /api/v1/writers/register-device/`**

**Permission:** Writer (acting on their own profile)

Registers a new POS device under the authenticated writer. Serial numbers are unique across the platform.

**Request Body**

```json
{
  "serial_number": "POS-AB12345",
  "device_type": "POS"
}
```

| Field           | Type   | Required | Description                                    |
| --------------- | ------ | -------- | ---------------------------------------------- |
| `serial_number` | string | Yes      | Unique device serial (max 60 chars)            |
| `device_type`   | string | No       | One of `POS`, `APP`, `WEB` — defaults to `POS` |

**Response `201 Created`**

```json
{
  "id": "0c8f9f1e-...",
  "writer": "5d2e...",
  "serial_number": "POS-AB12345",
  "device_type": "pos",
  "status": "issued",
  "assigned_at": "2026-05-12T08:15:21Z",
  "returned_at": null,
  "notes": "",
  "latitude": null,
  "longitude": null,
  "location_accuracy_m": null,
  "location_reported_at": null
}
```

**Error Responses**

| Status | Cause                                                                                |
| ------ | ------------------------------------------------------------------------------------ |
| `403`  | Caller does not have a writer profile                                                |
| `409`  | A device with that `serial_number` is already registered (`duplicate_serial_number`) |

---

## Report Device Location

**`POST /api/v1/writers/report-location/`**

**Permission:** Writer (acting on their own device)

Updates the latest GPS coordinates of one of the authenticated writer's POS devices. The POS app should call this on a schedule (e.g. every 30–60s while open, or on significant location change). Only the most recent ping is stored — there is no history table.

**Request Body**

```json
{
  "serial_number": "POS-AB12345",
  "latitude": 5.614818,
  "longitude": -0.205874,
  "accuracy_m": 12.5
}
```

| Field           | Type    | Required | Description                                    |
| --------------- | ------- | -------- | ---------------------------------------------- |
| `serial_number` | string  | Yes      | Must belong to the authenticated writer        |
| `latitude`      | decimal | Yes      | Range `-90` to `90`, up to 6 decimal places    |
| `longitude`     | decimal | Yes      | Range `-180` to `180`, up to 6 decimal places  |
| `accuracy_m`    | decimal | No       | Reported GPS accuracy in metres (non-negative) |

**Response `200 OK`**

Returns the full `POSDevice` payload with the freshly stored location fields.

```json
{
  "id": "0c8f9f1e-...",
  "writer": "5d2e...",
  "serial_number": "POS-AB12345",
  "device_type": "pos",
  "status": "trading",
  "assigned_at": "2026-05-12T08:15:21Z",
  "returned_at": null,
  "notes": "",
  "latitude": "5.614818",
  "longitude": "-0.205874",
  "location_accuracy_m": "12.50",
  "location_reported_at": "2026-05-12T10:24:31.412Z"
}
```

**Error Responses**

| Status | Cause                                                        |
| ------ | ------------------------------------------------------------ |
| `400`  | Missing fields, malformed decimals, or lat/lng out of range  |
| `403`  | Caller does not have a writer profile                        |
| `404`  | No device with that `serial_number` exists under this writer |

**Notes**

- Coordinates overwrite the previous reading — there is no per-ping history.
- `location_reported_at` is set server-side from `now()` on every successful call. Use it to display "last seen X seconds ago" on dashboards.
- Decimal fields are returned as strings (per the platform-wide monetary/decimal convention).

---

## POS Device Locations (Map)

**`GET /api/v1/writers/devices/locations/`**

**Permission:** Operator or above

Returns every POS device that has reported a GPS location at least once. Use to plot device pins on the admin dashboard map. Devices that have never reported a location are excluded.

**Response `200 OK`**

```json
[
  {
    "id": "0c8f9f1e-...",
    "serial_number": "POS-AB12345",
    "device_type": "pos",
    "status": "trading",
    "latitude": "5.614818",
    "longitude": "-0.205874",
    "location_accuracy_m": "12.50",
    "location_reported_at": "2026-05-14T10:24:31.412Z",
    "writer": {
      "id": "5d2e8b1a-...",
      "writer_id": 32,
      "name": "Frank Mawuli",
      "phone": "+233244979958",
      "status": "active"
    }
  }
]
```

| Field                  | Type                   | Description                                                                   |
| ---------------------- | ---------------------- | ----------------------------------------------------------------------------- |
| `id`                   | UUID                   | POS device UUID                                                               |
| `serial_number`        | string                 | Device serial                                                                 |
| `device_type`          | string                 | `pos`, `app`, or `web`                                                        |
| `status`               | string                 | `issued`, `trading`, or `recovery`                                            |
| `latitude`             | decimal string         | Last reported latitude                                                        |
| `longitude`            | decimal string         | Last reported longitude                                                       |
| `location_accuracy_m`  | decimal string \| null | Reported GPS accuracy in metres                                               |
| `location_reported_at` | datetime               | When the device last reported. Use to flag stale pins (e.g. ">15 min ago").   |
| `writer.id`            | UUID                   | Writer UUID for drill-through to the writer profile page                      |
| `writer.writer_id`     | integer                | Human-readable writer ID                                                      |
| `writer.name`          | string                 | Writer's full name (pin label)                                                |
| `writer.phone`         | string \| null         | Writer's phone (E.164)                                                        |
| `writer.status`        | string                 | Writer's current status: `active`, `passive`, `inactive`, `recover`, `no_use` |

**Notes**

- Response is a flat array, ordered by `location_reported_at` descending (freshest first).
- No pagination — POS device fleets are small (~hundreds at most) and the map needs everything at once. If fleet size ever grows past ~5k, we'll add filters.
- Frontend can colour-code pins by `status` or `writer.status`, and grey-out pins where `location_reported_at` is older than your chosen freshness threshold.

---

# Events & QR Tickets

End-to-end ticketing for invite-only events. The admin creates an event, issues tickets (which **also sends the SMS invitations** in the same step), and gate staff scan the QRs at the entrance with single-use validation. Each player receives an SMS with a link to a personal QR ticket page.

**Why SMS, not WhatsApp**

Not every player has the WhatsApp bot — many play through writers and were only ever a phone number on file. WhatsApp Cloud API also restricts free-form messages to a 24-hour session window after the player's last bot interaction, which most event invitees will be outside of. SMS works on every phone without an opt-in or session window, so the QR-link SMS is our delivery channel for event tickets.

**Lifecycle**

`ISSUED` (created — SMS is queued immediately by [Issue Tickets](#issue-tickets)) → `DELIVERED` (Sailup confirmed the SMS) → `SCANNED` (used at the gate).

A ticket that fails Sailup delivery stays at `ISSUED` with a `delivery_error` recorded; an admin can retry it via [Send Tickets](#send-tickets-via-sms). An admin can also `REVOKE` a ticket to invalidate it at any stage.

**Scoping**

- Event and ticket management: **operator or above**.
- The scan endpoint: **writer or above** — so a writer-role gate-staff account can scan without needing operator privileges.

**Race-safety**

The scan endpoint takes a row-level lock on the ticket before flipping its status, so two simultaneous scans of the same QR can never both succeed.

---

## Create Event

**`POST /api/v1/events/`**

**Permission:** Operator or above

**Request Body**

```json
{
  "name": "AMS1One Anniversary Party",
  "venue": "La Palm Royal Beach Hotel, Accra",
  "event_date": "2026-06-15T19:00:00Z",
  "description": "Invite-only celebration for top players and partners."
}
```

| Field         | Type     | Required | Description                |
| ------------- | -------- | -------- | -------------------------- |
| `name`        | string   | Yes      | Event name (max 120 chars) |
| `event_date`  | datetime | Yes      | When the event starts      |
| `venue`       | string   | No       | Free-text venue            |
| `description` | string   | No       | Free-text description      |

**Response `201 Created`**

```json
{
  "id": "9a3f6e1c-...",
  "name": "AMS1One Anniversary Party",
  "venue": "La Palm Royal Beach Hotel, Accra",
  "event_date": "2026-06-15T19:00:00Z",
  "description": "Invite-only celebration for top players and partners.",
  "is_active": true,
  "ticket_count": 0,
  "created_at": "2026-05-14T10:00:00Z",
  "updated_at": "2026-05-14T10:00:00Z"
}
```

---

## List Events

**`GET /api/v1/events/`**

**Permission:** Operator or above

Returns all events newest-first, each with a `ticket_count`. Standard `GET /api/v1/events/{id}/` retrieves one.

---

## Issue Tickets

**`POST /api/v1/events/{id}/issue-tickets/`**

**Permission:** Operator or above

Single-step issue + send. Creates one `EventTicket` per supplied phone number **and** immediately queues the SMS invitations via Celery. Phones are normalised to E.164. **No player account lookup happens** — any well-formed phone number gets a ticket. Phones that can't be parsed (typos, garbage) are returned in `invalid_phones`. The same phone can't be issued twice for the same event (enforced at the DB) — repeats are silently skipped. For re-sends to already-issued phones, use the [Send Tickets](#send-tickets-via-sms) endpoint.

**Request Body**

```json
{
  "phone_numbers": ["+233501234567", "0244979958", "+233200000000"]
}
```

| Field           | Type             | Required | Description                                                                           |
| --------------- | ---------------- | -------- | ------------------------------------------------------------------------------------- |
| `phone_numbers` | array of strings | Yes      | 1–1000 phone numbers in any local or E.164 format. Server normalises before matching. |

**Response `201 Created`**

```json
{
  "created": 2,
  "tickets": [
    {
      "id": "0a1b...",
      "event": "9a3f6e1c-...",
      "event_name": "AMS1One Anniversary Party",
      "player_phone": "+233550000006",
      "status": "issued",
      "delivered_at": null,
      "delivered_via": null,
      "delivery_error": "",
      "scanned_at": null,
      "scanned_by": null,
      "created_at": "2026-05-14T10:01:00Z"
    }
  ],
  "invalid_phones": ["abc123"],
  "queued": 2
}
```

| Field            | Type             | Description                                                                                                                                      |
| ---------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `created`        | integer          | Count of tickets newly issued                                                                                                                    |
| `tickets`        | array            | The newly-issued tickets (phones already issued on this event are NOT in this list)                                                              |
| `invalid_phones` | array of strings | Phones the server couldn't parse — typically typos or non-phone strings. The admin UI should display this so the operator can fix and re-submit. |
| `queued`         | integer          | Number of SMS invitations queued for delivery (equals `created`). Each is a Celery job using the Sailup SMS provider.                            |

**Notes**

- SMS invitations go out asynchronously via Celery within seconds of this call. The response returns immediately while the worker processes the queue.
- Duplicate phones in the request body are de-duplicated after normalisation.
- Any well-formed phone gets a ticket — no requirement for the recipient to be a registered player on the platform.
- Re-running issue-tickets with overlapping phones silently skips the duplicates (DB-level uniqueness on `(event, player_phone)`). To re-send, use [Send Tickets](#send-tickets-via-sms).

---

## Send Tickets via SMS

**`POST /api/v1/events/{id}/send/`**

**Permission:** Operator or above

Re-send or retry SMS invitations for already-issued tickets. The primary path ([Issue Tickets](#issue-tickets)) sends invitations automatically when tickets are created — this endpoint is for:

- Retrying tickets where the initial SMS failed (still in `issued` status with a `delivery_error`)
- Re-sending the link to a player who lost their SMS
- Sending invitations for tickets that were issued before this auto-send behaviour existed

Non-blocking: queues Celery jobs and returns immediately. SMS goes via the existing Sailup integration.

**Request Body** — pass exactly one of:

```json
{ "ticket_ids": ["0a1b...", "0c2d..."] }
```

```json
{ "all_undelivered": true }
```

| Field             | Type           | Required    | Description                                                |
| ----------------- | -------------- | ----------- | ---------------------------------------------------------- |
| `ticket_ids`      | array of UUIDs | Conditional | Specific tickets in this event to send                     |
| `all_undelivered` | boolean        | Conditional | If true, send to every ticket currently in `issued` status |

**Response `202 Accepted`**

```json
{ "queued": 2 }
```

**Behaviour per ticket**

- Tries up to 3 times with exponential backoff if Sailup rejects the SMS.
- On success: `status → delivered`, `delivered_at` set, `delivered_via = "sms"`.
- On final failure: the error message is captured on `delivery_error`. The ticket stays `issued` so you can retry by calling this endpoint again.
- Tickets in `scanned` or `revoked` status are rejected.

**SMS body**

```
Your ticket for AMS1One Anniversary on Sat 15 Jun, 19:00. View & show at
the gate: https://app.ams1one.com/tickets/x7Pq8wA1z2_yVbH3kRMnL4uG
```

The link points to the **frontend** — players tap it, the FE app renders the QR client-side, and they show it at the gate. The backend URL is never exposed in player-facing messages.

**Configuration**

| Env var                | Default                 | Description                                                   |
| ---------------------- | ----------------------- | ------------------------------------------------------------- |
| `FRONTEND_BASE_URL`    | `http://localhost:5173` | Scheme + host of the FE app (no trailing slash)               |
| `FRONTEND_TICKET_PATH` | `/tickets/{token}`      | Path on the FE that renders a ticket. Must contain `{token}`. |

The final SMS link is `{FRONTEND_BASE_URL}{FRONTEND_TICKET_PATH.format(token=...)}`.

**Error Responses**

| Status | Cause                                                                                                |
| ------ | ---------------------------------------------------------------------------------------------------- |
| `400`  | Neither `ticket_ids` nor `all_undelivered` supplied; or `ticket_ids` includes IDs from another event |
| `403`  | Caller is not operator or above                                                                      |

---

## List Event Tickets

**`GET /api/v1/events/{id}/tickets/`**

**Permission:** Operator or above

Returns all tickets for an event, with player and status details. Useful for the admin's "send progress" view.

**Query Parameters**

| Parameter | Type   | Description                                         |
| --------- | ------ | --------------------------------------------------- |
| `status`  | string | Filter: `issued`, `delivered`, `scanned`, `revoked` |

**Response `200 OK`** — array of ticket objects (same shape as the [Issue Tickets](#issue-tickets) response body).

---

## Public Ticket Payload (for FE)

**`GET /api/v1/events/public/<token>/`**

**Permission:** Public (no auth)

Returns the event + ticket details the **frontend** needs to render its ticket page. The QR itself is generated client-side from the `token` — the backend doesn't serve any HTML or images for player-facing pages.

**Why this is unauthenticated**

The `token` _is_ the credential. Anyone with the SMS link can fetch this payload; gating with auth would block the player we just SMSed. The token is 32 chars of URL-safe random, so guessing is not feasible.

**Path parameters**

| Parameter | Type   | Description                        |
| --------- | ------ | ---------------------------------- |
| `token`   | string | The ticket token from the SMS link |

**Response `200 OK`**

```json
{
  "event": {
    "name": "AMS1One Anniversary Party",
    "event_date": "2026-06-15T19:00:00Z",
    "venue": "La Palm Royal Beach Hotel, Accra",
    "is_active": true
  },
  "ticket": {
    "token": "x7Pq8wA1z2_yVbH3kRMnL4uG",
    "status": "delivered",
    "scanned_at": null
  }
}
```

| Field               | Type             | Description                                       |
| ------------------- | ---------------- | ------------------------------------------------- |
| `event.name`        | string           | Event name                                        |
| `event.event_date`  | datetime         | Event start (ISO 8601)                            |
| `event.venue`       | string           | Venue, may be empty                               |
| `event.is_active`   | boolean          | False means scanning is disabled                  |
| `ticket.token`      | string           | Same token from the URL — encode this into the QR |
| `ticket.status`     | string           | `issued`, `delivered`, `scanned`, or `revoked`    |
| `ticket.scanned_at` | datetime \| null | When the ticket was used at the gate              |

**Error Responses**

| Status | Cause                            |
| ------ | -------------------------------- |
| `404`  | No ticket with that token exists |

**Frontend integration**

1. FE has a route `/tickets/:token` (this is what's in the SMS link)
2. On mount, FE calls `GET /api/v1/events/public/<token>/`
3. FE renders the QR client-side from `ticket.token` using a JS library (`qrcode`, `qrcode.react`, etc.)
4. FE shows event details + the QR. If `ticket.status === "scanned"` or `"revoked"`, show a banner explaining and don't render a usable QR.
5. Gate staff later scans the QR → FE's scanner page POSTs `token` to `/api/v1/events/scan/`.

---

## Scan Ticket at the Gate

**`POST /api/v1/events/scan/`**

**Permission:** Writer or above

Validates a scanned token at the entrance. Atomically marks the ticket as `scanned`. Subsequent scans of the same token return a conflict.

**Request Body**

```json
{ "token": "x7Pq8wA1z2_yVbH3kRMnL4uG" }
```

The frontend scan page decodes the QR image, extracts the token, and POSTs it here.

**Response `200 OK`** — entry approved:

```json
{
  "ticket_id": "0a1b...",
  "event_name": "AMS1One Anniversary Party",
  "player_phone": "+233550000006",
  "scanned_at": "2026-06-15T19:14:22Z"
}
```

**Error Responses**

| Status | Code                     | Cause                                                         |
| ------ | ------------------------ | ------------------------------------------------------------- |
| `404`  | `ticket_token_invalid`   | No ticket matches that token (counterfeit QR or typo)         |
| `409`  | `ticket_already_scanned` | Token was previously used — message includes when and by whom |
| `409`  | `ticket_revoked`         | Admin has invalidated this ticket                             |
| `409`  | `ticket_not_delivered`   | Ticket exists but was never sent to the player                |
| `409`  | `event_inactive`         | The event itself has been deactivated                         |

**Frontend integration notes**

- Show a big green tick or red X based on `200` vs error.
- For `ticket_already_scanned`, show the previous scan time so staff can spot duplicate attendees.
- The scanner page should debounce — accidentally double-scanning the same QR within a few hundred milliseconds will give the user the impression of a duplicate. (The backend handles the real race correctly, but the second response will be a 409.)

---

# Financials — Dashboard Endpoints

All dashboard endpoints are under **`/api/v1/financials/dashboard/`** and require **Operator or above** permission.

YTD figures are read from the `YTDSummary` snapshot (updated nightly at 05:00 UTC). Period-based figures (last week / last month / last 3 months) are computed live.

---

## Top-Up Statistics

**`GET /api/v1/financials/dashboard/topup-statistics/`**

Returns total writer top-ups for YTD and recent periods.

**Response `200 OK`**

```json
{
  "ytd": {
    "label": "YTD",
    "total": "USD 124,064.43",
    "total_amount": 124064.43
  },
  "last_week": {
    "label": "Last Week",
    "total": "USD 4,200.00",
    "total_amount": 4200.0
  },
  "last_month": {
    "label": "Last Month",
    "total": "USD 18,500.00",
    "total_amount": 18500.0
  },
  "last_3_months": {
    "label": "Last 3 Months",
    "total": "USD 52,000.00",
    "total_amount": 52000.0
  }
}
```

| Field                        | Type   | Description                                      |
| ---------------------------- | ------ | ------------------------------------------------ |
| `ytd.total_amount`           | number | YTD gross top-ups from the nightly snapshot      |
| `last_week.total_amount`     | number | Top-ups in the last full calendar week (Mon–Sun) |
| `last_month.total_amount`    | number | Top-ups in the last full calendar month          |
| `last_3_months.total_amount` | number | Top-ups over the last 3 calendar months          |

---

## Winning Statistics

**`GET /api/v1/financials/dashboard/winning-statistics/`**

Returns total win amounts for YTD and recent periods.

**Response `200 OK`**

```json
{
  "ytd": { "label": "YTD", "total": "USD 98,000.00", "total_amount": 98000.0 },
  "last_week": {
    "label": "Last Week",
    "total": "USD 3,100.00",
    "total_amount": 3100.0
  },
  "last_month": {
    "label": "Last Month",
    "total": "USD 14,200.00",
    "total_amount": 14200.0
  },
  "last_3_months": {
    "label": "Last 3 Months",
    "total": "USD 40,500.00",
    "total_amount": 40500.0
  }
}
```

| Field              | Description                                     |
| ------------------ | ----------------------------------------------- |
| `ytd.total_amount` | YTD total win amounts from the nightly snapshot |
| Period fields      | Live aggregation of `Win.win_amount` per period |

---

## Best & Worst Performance

**`GET /api/v1/financials/dashboard/best-worst-performance/`**

Returns the best and worst performing calendar months year-to-date, by net profit (`net_topups - total_wins_paid`).

**Response `200 OK`**

```json
{
  "best_month": {
    "month": "Jan '26",
    "performance": "+ USD 12,500.00",
    "net_profit": 12500.0,
    "topups": 30000.0,
    "wins": 17500.0
  },
  "worst_month": {
    "month": "Mar '26",
    "performance": "- USD 2,000.00",
    "net_profit": -2000.0,
    "topups": 18000.0,
    "wins": 20000.0
  }
}
```

| Field         | Type   | Description                           |
| ------------- | ------ | ------------------------------------- |
| `month`       | string | Month label e.g. `"Jan '26"`          |
| `performance` | string | Formatted net profit with sign prefix |
| `net_profit`  | number | `topups - wins` for the month         |
| `topups`      | number | Total net top-ups for the month       |
| `wins`        | number | Total wins paid for the month         |

Returns `null` for either field if no data exists yet for the current year.

---

## Retention Rate

**`GET /api/v1/financials/dashboard/retention-rate/`**

Returns the YTD gross sales, net income (wins claimed), retention amount, and retention rate percentage.

**Response `200 OK`**

```json
{
  "gross_sales": 124064.43,
  "net_income": 98000.0,
  "retention_amount": 26064.43,
  "retention_rate": "21.01%"
}
```

| Field              | Type   | Description                               |
| ------------------ | ------ | ----------------------------------------- |
| `gross_sales`      | number | YTD `total_wins` from snapshot            |
| `net_income`       | number | YTD `wins_claimed` from snapshot          |
| `retention_amount` | number | `gross_sales - net_income`                |
| `retention_rate`   | string | YTD retention rate as a percentage string |

---

## Retention Rate Trend

**`GET /api/v1/financials/dashboard/retention-rate-trend/`**

Returns retention rate over time — daily for the last 30 days, or monthly for the last 12 months.

**Query Parameters**

| Parameter | Type    | Default | Allowed values | Description                                   |
| --------- | ------- | ------- | -------------- | --------------------------------------------- |
| `days`    | integer | `30`    | `30`, `365`    | `30` = daily entries, `365` = monthly entries |

**Response — `?days=30`**

```json
{
  "ytd_retention_rate": 21.01,
  "period": {
    "start_date": "2026-03-30",
    "end_date": "2026-04-28",
    "days": 30
  },
  "days": [
    { "day": "2026-03-30", "retention_rate": 0 },
    { "day": "2026-04-27", "retention_rate": 74 }
  ]
}
```

**Response — `?days=365`**

```json
{
  "ytd_retention_rate": 21.01,
  "period": {
    "start_date": "2025-05-01",
    "end_date": "2026-04-28",
    "days": 365
  },
  "months": [
    { "month": "May '25", "retention_rate": 0 },
    { "month": "Apr '26", "retention_rate": 74 }
  ]
}
```

| Field                | Type    | Description                                     |
| -------------------- | ------- | ----------------------------------------------- |
| `ytd_retention_rate` | number  | YTD retention rate from snapshot (2 d.p.)       |
| `days`               | array   | Daily entries — present only when `?days=30`    |
| `months`             | array   | Monthly entries — present only when `?days=365` |
| `retention_rate`     | integer | Rounded retention rate percentage for the entry |

---

## Sales Card

**`GET /api/v1/financials/dashboard/sales/`**

Returns YTD total and net sales figures.

**Response `200 OK`**

```json
{
  "total_sales": "USD 200,000.00",
  "total_sales_amount": 200000.0,
  "net_sales": "USD 102,000.00",
  "net_sales_amount": 102000.0,
  "currency": "USD"
}
```

| Field                | Description                                      |
| -------------------- | ------------------------------------------------ |
| `total_sales_amount` | YTD gross ticket sales (ACTIVE/WON/LOST/CLAIMED) |
| `net_sales_amount`   | `total_sales - wins_claimed`                     |

---

## Net Top-Ups Card

**`GET /api/v1/financials/dashboard/net-topups/`**

Returns YTD gross and net top-up totals.

**Response `200 OK`**

```json
{
  "gross_topups": "USD 124,064.43",
  "gross_topups_amount": 124064.43,
  "net_topups": "USD 124,064.43",
  "net_topups_amount": 124064.43,
  "currency": "USD"
}
```

---

## Writers at Work Card

**`GET /api/v1/financials/dashboard/writers-at-work/`**

Returns active and total writer headcount for the current year.

**Response `200 OK`**

```json
{
  "active_writers": 42,
  "total_writers": 84
}
```

| Field            | Description                                      |
| ---------------- | ------------------------------------------------ |
| `active_writers` | Writers with at least one ticket sold this year  |
| `total_writers`  | All writers registered up to end of current year |

---

## Wins Card

**`GET /api/v1/financials/dashboard/wins/`**

Returns YTD total win amount and number of winning stakes.

**Response `200 OK`**

```json
{
  "total_wins": "USD 98,000.00",
  "total_wins_amount": 98000.0,
  "winning_stakes": 1204,
  "currency": "USD"
}
```

| Field               | Description                               |
| ------------------- | ----------------------------------------- |
| `total_wins_amount` | Sum of all win amounts computed this year |
| `winning_stakes`    | Count of `Win` records computed this year |

---

## Liquidation Card

**`GET /api/v1/financials/dashboard/liquidation/`**

Returns YTD total liquidation amount and unclaimed win balance.

**Response `200 OK`**

```json
{
  "total_liquidation": "USD 5,200.00",
  "total_liquidation_amount": 5200.0,
  "unclaimed_coupons": "USD 1,800.00",
  "unclaimed_coupons_amount": 1800.0,
  "currency": "USD"
}
```

| Field                      | Description                                            |
| -------------------------- | ------------------------------------------------------ |
| `total_liquidation_amount` | YTD sum of expired unclaimed wins that were liquidated |
| `unclaimed_coupons_amount` | YTD sum of wins still in PENDING status                |

---

## Settlements Card

**`GET /api/v1/financials/dashboard/settlements/`**

Returns YTD total settlements and live claims wallet balance across all writers.

**Response `200 OK`**

```json
{
  "total_settlements": "USD 30,000.00",
  "total_settlements_amount": 30000.0,
  "claim_wallet_balance": "USD 12,500.00",
  "claim_wallet_balance_amount": 12500.0,
  "currency": "USD"
}
```

| Field                         | Description                                                  |
| ----------------------------- | ------------------------------------------------------------ |
| `total_settlements_amount`    | YTD sum of `Settlement.amount_due` from snapshot             |
| `claim_wallet_balance_amount` | Live sum of `ClaimsWallet.claims_balance` across all writers |

---

## Draws & Winnings Dashboard Card

**`GET /api/v1/financials/dashboard/draws-and-winnings/`**

Returns three YTD card groups covering sales volume, winnings breakdown, and gross gaming revenue. Most figures are read from the nightly `YTDSummary` snapshot; `unique_players` is a live distinct query.

**Response `200 OK`**

```json
{
  "ytd_sales": {
    "total_sales": "USD 200,000.00",
    "total_sales_amount": 200000.0,
    "unique_players": 1204,
    "total_tickets": 3500,
    "total_stakes": 7200
  },
  "ytd_winnings": {
    "total_winnings": "USD 98,000.00",
    "total_winnings_amount": 98000.0,
    "claimed": "USD 80,000.00",
    "claimed_amount": 80000.0,
    "unclaimed": "USD 18,000.00",
    "unclaimed_amount": 18000.0
  },
  "ytd_ggr": {
    "gross_gaming_revenue": "USD 102,000.00",
    "gross_gaming_revenue_amount": 102000.0,
    "retention_rate": "51.00%",
    "retention_rate_value": 51.0,
    "retention_value": "USD 102,000.00",
    "retention_value_amount": 102000.0
  }
}
```

**`ytd_sales`**

| Field                | Type    | Description                                                            |
| -------------------- | ------- | ---------------------------------------------------------------------- |
| `total_sales_amount` | number  | YTD gross ticket sales (ACTIVE/WON/LOST/CLAIMED) from snapshot         |
| `unique_players`     | integer | Distinct non-empty `player_phone` values on valid tickets — live query |
| `total_tickets`      | integer | Count of valid tickets from snapshot                                   |
| `total_stakes`       | integer | Count of stakes across valid tickets from snapshot                     |

**`ytd_winnings`**

| Field                   | Type   | Description                               |
| ----------------------- | ------ | ----------------------------------------- |
| `total_winnings_amount` | number | Sum of all win amounts computed this year |
| `claimed_amount`        | number | Wins in CLAIMED status                    |
| `unclaimed_amount`      | number | Wins still in PENDING status              |

**`ytd_ggr`**

| Field                         | Type   | Description                               |
| ----------------------------- | ------ | ----------------------------------------- |
| `gross_gaming_revenue_amount` | number | `total_sales - total_wins`                |
| `retention_rate`              | string | YTD retention rate as a percentage string |
| `retention_rate_value`        | number | Raw retention rate (2 d.p.)               |
| `retention_value_amount`      | number | `total_sales × retention_rate / 100`      |

---

---

# Games Endpoints

---

## Draws & Winnings Table

**`GET /api/v1/games/events/draws-and-winnings/`**

**Permission:** Operator or above

Paginated table of all drawn events with their result data — draw numbers, machine numbers, pre/post-draw sales, payout ratio, and total winnings. Ordered newest-first by draw date.

**Query Parameters**

| Parameter        | Type    | Description                                                             |
| ---------------- | ------- | ----------------------------------------------------------------------- |
| `game_type`      | integer | Filter by game type ID                                                  |
| `status`         | string  | Filter by event status (always `DRAWN` for this endpoint, but accepted) |
| `draw_date`      | date    | Filter by exact draw date (`YYYY-MM-DD`)                                |
| `draw_date__gte` | date    | Draw date on or after this date                                         |
| `draw_date__lte` | date    | Draw date on or before this date                                        |
| `page`           | integer | Page number (25 results per page)                                       |

**Response `200 OK`**

```json
{
  "count": 48,
  "next": "https://example.com/api/v1/games/events/draws-and-winnings/?page=2",
  "previous": null,
  "results": [
    {
      "event_id": "a88957b3-0d7c-4014-8c93-18dc50f924bc",
      "event_no": 137,
      "draw_date": "Tue, 28 Apr 2026",
      "event_name": "Tuesday Noon Rush",
      "draw_time": "12:00",
      "pre_draw": "USD 7,268.56",
      "pre_draw_amount": 7268.56,
      "draw_numbers": [80, 45, 77, 12, 30],
      "machine_numbers": null,
      "post_draw_1": "USD 0.00",
      "post_draw_1_amount": 0.0,
      "post_draw_2": "USD 0.00",
      "post_draw_2_amount": 0.0,
      "payout_ratio": "118.21%",
      "payout_ratio_value": 118.21,
      "total_winnings": "USD 8,592.00",
      "total_winnings_amount": 8592.0
    }
  ]
}
```

| Field                   | Type           | Description                                          |
| ----------------------- | -------------- | ---------------------------------------------------- |
| `event_id`              | UUID           | Draw event UUID                                      |
| `event_no`              | integer        | Sequential event number                              |
| `draw_date`             | string         | Formatted draw date e.g. `"Tue, 28 Apr 2026"`        |
| `event_name`            | string         | Draw event name                                      |
| `draw_time`             | string \| null | Draw time as `"HH:MM"`, or `null` if not set         |
| `pre_draw`              | string         | Formatted pre-draw sales                             |
| `pre_draw_amount`       | number         | Raw pre-draw sales amount                            |
| `draw_numbers`          | array          | Numbers drawn for the event                          |
| `machine_numbers`       | array \| null  | Machine numbers (last set), or `null`                |
| `post_draw_1`           | string         | Formatted Post Draw I sales                          |
| `post_draw_1_amount`    | number         | Raw Post Draw I amount                               |
| `post_draw_2`           | string         | Formatted Post Draw II sales                         |
| `post_draw_2_amount`    | number         | Raw Post Draw II amount                              |
| `payout_ratio`          | string         | Payout ratio as a percentage string e.g. `"118.21%"` |
| `payout_ratio_value`    | number         | Raw payout ratio value                               |
| `total_winnings`        | string         | Formatted total winnings paid out                    |
| `total_winnings_amount` | number         | Raw total winnings amount                            |

---

## Draw Event Tickets

**`GET /api/v1/games/events/{id}/tickets/`**

**Permission:** Operator or above

Returns the event header and a paginated list of tickets for a specific draw event. Used for the Pre Draw Tickets modal.

**Path Parameters**

| Parameter | Type | Description     |
| --------- | ---- | --------------- |
| `id`      | UUID | Draw event UUID |

**Query Parameters**

| Parameter | Type    | Description                                                      |
| --------- | ------- | ---------------------------------------------------------------- |
| `search`  | string  | Filter by ticket number, writer first/last name, or player phone |
| `page`    | integer | Page number (25 results per page)                                |

**Response `200 OK`**

```json
{
  "event": {
    "event_no": 137,
    "event_name": "Tuesday Noon Rush",
    "draw_numbers": [80, 45, 77, 12, 30],
    "total_wins": "USD 8,592.00",
    "total_wins_amount": 8592.0,
    "payout_ratio": "118.21%",
    "payout_ratio_value": 118.21,
    "draw_date": "Tue, 28 Apr 2026",
    "draw_time": null
  },
  "tickets": {
    "count": 256,
    "next": "https://example.com/api/v1/games/events/{id}/tickets/?page=2",
    "previous": null,
    "results": [
      {
        "ticket_id": "af23b3bf-6542-40a6-91ae-931d9010ffb6",
        "ticket_no": "202604281329370090447304",
        "stake_count": 1,
        "stake_value": "USD 3.00",
        "stake_value_amount": 3.0,
        "datetime": "Tue, 28 Apr 2026",
        "staked_by": "Raindolf Borketey",
        "phone_number": "",
        "status": "lost",
        "stakes": [
          {
            "stake_id": "71a30ad8-45ab-4d19-ba51-f526122d24a7",
            "created_at": "2026-04-28 13:29:37",
            "game": {
              "id": "486e1097-cf18-4ed8-97fc-3a7721c848ce",
              "name": "Noonrush",
              "code": "590_NR"
            },
            "event_id": "a88957b3-0d7c-4014-8c93-18dc50f924bc",
            "event": "Tuesday Noon Rush",
            "play_group": "Perm",
            "play": "Perm 2",
            "numbers": "20,30,50",
            "stake_amount": "1.00",
            "original_numbers": "20,30,50",
            "player_phone": "",
            "stake_status": "LOST",
            "writer": {
              "id": "90",
              "name": "Raindolf Borketey",
              "phone": "+233595539729"
            }
          }
        ]
      }
    ]
  }
}
```

**`event` object**

| Field                | Type           | Description                                     |
| -------------------- | -------------- | ----------------------------------------------- |
| `event_no`           | integer        | Sequential event number                         |
| `event_name`         | string         | Draw event name                                 |
| `draw_numbers`       | array          | Drawn numbers, empty array if not yet drawn     |
| `total_wins`         | string         | Formatted total winnings for the event          |
| `total_wins_amount`  | number         | Raw total winnings amount                       |
| `payout_ratio`       | string         | Payout ratio as a percentage string             |
| `payout_ratio_value` | number         | Raw payout ratio value                          |
| `draw_date`          | string         | Formatted draw date e.g. `"Tue, 28 Apr 2026"`   |
| `draw_time`          | string \| null | Draw time as `"HH:MM:SS"`, or `null` if not set |

**`tickets.results[]` object**

| Field                | Type    | Description                                       |
| -------------------- | ------- | ------------------------------------------------- |
| `ticket_id`          | UUID    | Ticket UUID                                       |
| `ticket_no`          | string  | Unique ticket number                              |
| `stake_count`        | integer | Number of stakes on the ticket                    |
| `stake_value`        | string  | Formatted total ticket amount                     |
| `stake_value_amount` | number  | Raw total ticket amount                           |
| `datetime`           | string  | Formatted sale date e.g. `"Tue, 28 Apr 2026"`     |
| `staked_by`          | string  | Writer's full name                                |
| `phone_number`       | string  | Player phone (empty for POS tickets)              |
| `status`             | string  | Ticket status: `active`, `won`, `lost`, `claimed` |
| `stakes`             | array   | Individual stakes on the ticket (see below)       |

**`stakes[]` object**

| Field              | Type   | Description                                             |
| ------------------ | ------ | ------------------------------------------------------- |
| `stake_id`         | UUID   | Stake UUID                                              |
| `created_at`       | string | Stake creation datetime (`YYYY-MM-DD HH:MM:SS`)         |
| `game`             | object | `{ id, name, code }` — game type                        |
| `event_id`         | UUID   | Draw event UUID                                         |
| `event`            | string | Draw event name                                         |
| `play_group`       | string | Play group e.g. `"Direct"`, `"Perm"`, `"Banker to All"` |
| `play`             | string | Play type name e.g. `"Direct 2 (2 Sure)"`, `"Perm 2"`   |
| `numbers`          | string | Comma-separated staked numbers                          |
| `stake_amount`     | string | Amount staked on this line                              |
| `original_numbers` | string | Numbers as originally entered                           |
| `player_phone`     | string | Player phone (empty for POS tickets)                    |
| `stake_status`     | string | `ACTIVE`, `WON`, `LOST`, or `CLAIMED`                   |
| `writer`           | object | `{ id, name, phone }` — writer who sold the ticket      |

---

## Drawable Today

**`GET /api/v1/games/events/drawable-today/`**

**Permission:** Admin or Draw Master only

Returns today's events eligible for auto-draw — events with `draw_date = today` and status `OPEN` or `CLOSED`. Used to populate the "Create Draw" modal dropdown. Already-DRAWN events are excluded.

**Response `200 OK`**

```json
[
  {
    "id": "5e85fb71-7b5f-4b4a-b516-0799778a70e6",
    "event_no": 244,
    "game_type_name": "Morning Dew",
    "draw_date": "2026-04-30",
    "status": "open",
    "label": "#244 — Morning Dew (30 Apr 2026)"
  },
  {
    "id": "1774c0fe-8b10-426a-8949-012ddfddde9f",
    "event_no": 936,
    "game_type_name": "Noonrush",
    "draw_date": "2026-04-30",
    "status": "closed",
    "label": "#936 — Noonrush (30 Apr 2026)"
  }
]
```

| Field            | Type    | Description                                      |
| ---------------- | ------- | ------------------------------------------------ |
| `id`             | UUID    | Draw event UUID — pass to `/auto-draw/` endpoint |
| `event_no`       | integer | Sequential event number                          |
| `game_type_name` | string  | Display name of the game                         |
| `draw_date`      | date    | `YYYY-MM-DD`                                     |
| `status`         | string  | `open` or `closed`                               |
| `label`          | string  | Pre-formatted display label for the dropdown     |

---

## Auto-Draw Event

**`POST /api/v1/games/events/{id}/auto-draw/`**

**Permission:** Admin or Draw Master only

Computerised draw — runs a greedy algorithm against all active tickets to pick winning numbers that minimise total payout. Commits the draw and triggers asynchronous win computation. If the event is `OPEN`, it is auto-closed first.

**Path Parameters**

| Parameter | Type | Description     |
| --------- | ---- | --------------- |
| `id`      | UUID | Draw event UUID |

**Request Body** (optional)

```json
{ "draw_size": 5 }
```

| Field       | Type    | Required | Default | Description                       |
| ----------- | ------- | -------- | ------- | --------------------------------- |
| `draw_size` | integer | No       | `5`     | Number of winning numbers to draw |

**Response `201 Created`**

```json
{
  "draw_result": {
    "id": "e765a268-561c-4418-9360-42185365f813",
    "draw_event": "5e85fb71-7b5f-4b4a-b516-0799778a70e6",
    "game_type": {
      "id": "...",
      "name": "5/90 Original",
      "code": "590_OG",
      "number_pool": 90,
      "numbers_drawn": 5
    },
    "numbers": [32, 22, 56, 57, 36],
    "machine_numbers": null,
    "pre_draw_sales": "1009.50",
    "post_draw_sales_1": "0.00",
    "post_draw_sales_2": "0.00",
    "total_winnings": "0.00",
    "payout_ratio": "0.00",
    "drawn_at": "2026-05-01T09:29:11Z",
    "processed_at": null
  },
  "projected_payout": 0.0,
  "total_sales": 1009.5,
  "house_margin": 1009.5,
  "ticket_count": 200
}
```

| Field                        | Type             | Description                                       |
| ---------------------------- | ---------------- | ------------------------------------------------- |
| `draw_result.numbers`        | array            | The 5 winning numbers committed to the draw       |
| `draw_result.pre_draw_sales` | decimal string   | Total ticket sales captured at draw time          |
| `draw_result.processed_at`   | datetime \| null | Set after Celery `compute_wins` finishes          |
| `projected_payout`           | number           | Greedy's predicted total payout for these numbers |
| `total_sales`                | number           | Total ticket sales for the event                  |
| `house_margin`               | number           | `total_sales - projected_payout`                  |
| `ticket_count`               | integer          | Number of active tickets evaluated                |

**Behaviour**

- Event status `OPEN` → automatically transitioned to `CLOSED`, then drawn
- Event status `CLOSED` → drawn immediately
- Event status `DRAWN` → returns `400` with `DrawAlreadyProcessedError`

After this endpoint returns, the `DrawResult` post-save signal fires the Celery `compute_wins` task asynchronously. Win records and writer ClaimsWallet credits land within seconds.

**Error Responses**

| Status | Cause                                             |
| ------ | ------------------------------------------------- |
| `400`  | Event already drawn (`DrawAlreadyProcessedError`) |
| `403`  | Caller is not Admin or Draw Master                |
| `404`  | Draw event UUID not found                         |

For a deeper explanation of the greedy algorithm, see [docs/AUTO_DRAW_ALGORITHM.md](docs/AUTO_DRAW_ALGORITHM.md).

---

---

# Reports Endpoints

All reports endpoints are under **`/api/v1/financials/reports/`** and require **Operator or above** permission.

Reports are stateless — every `execute` or `download` call runs the query fresh. Filters are passed as a JSON body on `execute`, or as query parameters on `download`.

---

## List Reports

**`GET /api/v1/financials/reports/`**

**Permission:** Operator or above

Returns the full report registry — all available report IDs, names, categories, column schemas, and filter definitions.

**Response `200 OK`**

```json
{
  "status": true,
  "message": "Reports retrieved successfully",
  "data": [
    {
      "reportId": 1,
      "name": "30 Days Sales Tracker",
      "schema": {
        "category": "Operations",
        "columns": [...],
        "filters": [...]
      }
    }
  ]
}
```

---

## Get Report Schema

**`GET /api/v1/financials/reports/{reportId}/`**

**Permission:** Operator or above

Returns the schema for a single report — columns and filter definitions.

**Path Parameters**

| Parameter  | Type    | Description |
| ---------- | ------- | ----------- |
| `reportId` | integer | Report ID   |

**Response `200 OK`**

```json
{
  "reportId": 1,
  "name": "30 Days Sales Tracker",
  "schema": {
    "category": "Operations",
    "columns": [
      { "key": "Writer ID", "label": "Writer ID", "required": true },
      { "key": "Writer Name", "label": "Writer Name", "required": true }
    ],
    "filters": [
      {
        "key": "entity_name",
        "label": "Writer Name",
        "type": "text",
        "required": false
      }
    ]
  }
}
```

**`schema.columns[]`**

| Field      | Type    | Description                                               |
| ---------- | ------- | --------------------------------------------------------- |
| `key`      | string  | Data key used in each result row                          |
| `label`    | string  | Display label                                             |
| `required` | boolean | Whether the column is considered a primary/required field |

**`schema.filters[]`**

| Field      | Type    | Description                                           |
| ---------- | ------- | ----------------------------------------------------- |
| `key`      | string  | Filter key to pass in the request body                |
| `label`    | string  | Display label for the filter input                    |
| `type`     | string  | Input type: `"text"`, `"date"`                        |
| `required` | boolean | Whether the filter must be supplied to run the report |

---

## Execute Report

**`POST /api/v1/financials/reports/{reportId}/execute/`**

**Permission:** Operator or above

Runs the report with the supplied filters and returns all matching rows as JSON, plus a `download_url` for the Excel file.

**Path Parameters**

| Parameter  | Type    | Description |
| ---------- | ------- | ----------- |
| `reportId` | integer | Report ID   |

**Request Body**

Pass any filters defined in the report's `schema.filters` as a flat JSON object. Omit optional filters to use their defaults (usually no restriction).

```json
{
  "start_date": "2026-01-01",
  "end_date": "2026-04-29"
}
```

**Response `200 OK`**

```json
{
  "status": true,
  "message": "Report executed successfully",
  "report_name": "Daily Sales & Winnings",
  "count": 120,
  "download_url": "https://example.com/api/v1/financials/reports/8/download/",
  "data": [{ "Date": "2026-01-01", "Sales": "1200.00", "Winning": "800.00" }]
}
```

| Field          | Type    | Description                                       |
| -------------- | ------- | ------------------------------------------------- |
| `status`       | boolean | Always `true` on success                          |
| `message`      | string  | Human-readable status message                     |
| `report_name`  | string  | Name of the report                                |
| `count`        | integer | Number of rows returned                           |
| `download_url` | string  | Absolute URL to download the same data as `.xlsx` |
| `data`         | array   | Report rows — keys match `schema.columns[].key`   |

**Error Responses**

| Status | Description                                          |
| ------ | ---------------------------------------------------- |
| `400`  | `reportId` is not a valid integer                    |
| `404`  | Report ID does not exist or executor not implemented |

---

## Download Report (Excel)

**`GET /api/v1/financials/reports/{reportId}/download/`**

**Permission:** Operator or above

Re-runs the report with optional query-string filters and streams the result as an Excel (`.xlsx`) file.

**Path Parameters**

| Parameter  | Type    | Description |
| ---------- | ------- | ----------- |
| `reportId` | integer | Report ID   |

**Query Parameters**

Pass any filters defined in `schema.filters` as query-string parameters. e.g. `?start_date=2026-01-01&end_date=2026-04-29`

**Response**

Binary `.xlsx` file download.

```
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename="Daily_Sales_&_Winnings.xlsx"
```

The workbook contains a single sheet named after the report. The header row is styled with a dark-blue background and bold white text. Column widths are auto-fitted (capped at 40 characters).

---

---

# Report Catalogue

Full column and filter reference for all 21 available reports.

---

## Report 1: 30 Days Sales Tracker

**Category:** Operations

A per-writer breakdown of sales over the last 30 days, including lifetime stats, device info, and a daily column for each of the past 30 days (Day-1 = today).

**Filters**

| Key           | Label       | Type | Required |
| ------------- | ----------- | ---- | -------- |
| `entity_name` | Writer Name | text | No       |

**Columns**

`Writer ID`, `Writer Name`, `Writer Phone`, `Supervisor`, `Device`, `Serial`, `State`, `Days on Platform`, `Days-to-Start`, `Operation Days`, `Lifetime Sales`, `Avg Lifetime Sales`, `30 Days Total`, `30 Day Average`, `Date Onboarded`, `First Transaction`, `Last Transaction`, `Day-1` … `Day-30`

---

## Report 2: Bank Transfer - Batch Details

**Category:** Finance

Detailed breakdown of top-up transactions within a specific batch.

**Filters**

| Key            | Label        | Type | Required |
| -------------- | ------------ | ---- | -------- |
| `batch_number` | Batch Number | text | No       |
| `reference`    | Reference    | text | No       |

**Columns**

`Writer Name`, `Writer Phone`, `Supervisor Name`, `Supervisor Phone`, `Phone Number`, `Network`, `Client Reference`, `Amount`, `Description`, `Datetime`, `Updated At`, `Batch Number`, `UUID`

---

## Report 3: Bank Transfers

**Category:** Finance

All bank transfer records, optionally filtered by date range and account number.

**Filters**

| Key       | Label          | Type | Required |
| --------- | -------------- | ---- | -------- |
| `from`    | From Date      | date | No       |
| `to`      | To Date        | date | No       |
| `account` | Account Number | text | No       |

**Columns**

`Datetime`, `Account Number`, `Reference`, `Amount`, `Success`, `Reason`, `Batch Number`, `Batch Date`

---

## Report 5: Commission Payments

**Category:** Finance

Commission amounts per writer for a given reference date.

**Filters**

| Key              | Label          | Type | Required |
| ---------------- | -------------- | ---- | -------- |
| `reference_date` | Reference Date | date | **Yes**  |

**Columns**

`Writer`, `Phone Number`, `Supervisor`, `Supervisor Phone Number`, `Sales`, `Commission`

---

## Report 6: Ticket Query

**Category:** Finance

All stake lines on a specific ticket.

**Filters**

| Key      | Label  | Type | Required |
| -------- | ------ | ---- | -------- |
| `ticket` | Ticket | text | **Yes**  |

**Columns**

`Datetime`, `Ticket No.`, `Play`, `Original Stake`, `Stake`, `Amount`

---

## Report 7: Daily Sales

**Category:** Finance

All tickets sold on a given date (defaults to today).

**Filters**

| Key    | Label | Type | Required |
| ------ | ----- | ---- | -------- |
| `date` | Date  | date | No       |

**Columns**

`Ticket Number`, `Game`, `Writer Name`, `Writer Number`, `Supervisor Name`, `Datetime of Ticket`, `Ticket Amount`

---

## Report 8: Daily Sales & Winnings

**Category:** Finance

Day-by-day summary of sales, winnings, and retention over a date range.

**Filters**

| Key          | Label      | Type | Required |
| ------------ | ---------- | ---- | -------- |
| `start_date` | Start Date | date | **Yes**  |
| `end_date`   | End Date   | date | **Yes**  |

**Columns**

`Date`, `Total Writers`, `Sales`, `Gross Income`, `Winning`, `Net Income`, `Retention Rate`

---

## Report 9: Finance - Payout

**Category:** Finance

Writer withdrawal (payout) transactions, optionally filtered by date range.

**Filters**

| Key          | Label      | Type | Required |
| ------------ | ---------- | ---- | -------- |
| `start_date` | Start Date | date | No       |
| `end_date`   | End Date   | date | No       |

**Columns**

`Writer ID`, `Writer Name`, `Writer Phone #`, `Transaction Date`, `Withdrawal`, `Bank Reference`

---

## Report 14: Revenue Per Play

**Category:** Finance

Total ticket count and amount grouped by game and play variety over a date range.

**Filters**

| Key          | Label      | Type | Required |
| ------------ | ---------- | ---- | -------- |
| `start_date` | Start Date | date | **Yes**  |
| `end_date`   | End Date   | date | **Yes**  |

**Columns**

`Date`, `Game`, `Play Variety`, `Total Tickets`, `Total Amount`

---

## Report 17: Ticket Status

**Category:** General

Full stake-level status history for a single ticket number.

**Filters**

| Key      | Label  | Type | Required |
| -------- | ------ | ---- | -------- |
| `ticket` | Ticket | text | **Yes**  |

**Columns**

`Ticket`, `Event ID`, `Event Name`, `Event Display`, `Occurrence Date`, `Writer Phone`, `Player Phone`, `Stake No.`, `Stake Amount`, `Payout`, `Status`, `Reason`, `Created At`, `Payout Time`

---

## Report 18: Active Writers

**Category:** General

All currently active writers — ID, name, phone, terminal number, location, and join date.

**Filters**

None

**Columns**

`ID`, `Name`, `Phone Number`, `Terminal Number`, `Location`, `Joined Date`

---

## Report 19: Terminal History

**Category:** General

Device/terminal usage history, optionally filtered by terminal number or MAC address.

**Filters**

| Key               | Label           | Type | Required |
| ----------------- | --------------- | ---- | -------- |
| `terminal_number` | Terminal Number | text | No       |
| `mac_address`     | MAC Address     | text | No       |

**Columns**

`Terminal`, `MAC Address`, `Writer Name`, `Phone Number`, `First Use`

---

## Report 20: Winning Stakes Report

**Category:** General

Winning stake details optionally filtered by date range or ticket number.

**Filters**

| Key          | Label      | Type | Required |
| ------------ | ---------- | ---- | -------- |
| `start_date` | Start Date | date | No       |
| `end_date`   | End Date   | date | No       |
| `ticket`     | Ticket     | text | No       |

**Columns**

`Writer`, `Supervisor`, `Ticket`, `Purchase Amount`, `Stake`, `Draw`, `Event`, `Play`, `Variety`, `Payout`, `Date of Stake`, `Date of Winning`

---

## Report 21: All Stakes Report

**Category:** Operations

Every stake across all tickets within a date range. Can be large — use the download endpoint for bulk exports.

**Filters**

| Key          | Label      | Type | Required |
| ------------ | ---------- | ---- | -------- |
| `start_date` | Start Date | date | **Yes**  |
| `end_date`   | End Date   | date | **Yes**  |

**Columns**

`Ticket`, `Ticket Number`, `Writer Name`, `Writer Phone`, `Supervisor Name`, `Supervisor Phone`, `Game`, `Event`, `Round`, `Variety`, `Status`, `Numbers`, `Amount`, `Payout`, `Date`

---

## Report 23: Topup - Claims as Credit

**Category:** Finance

Top-up transactions funded from a writer's claims wallet, optionally filtered by date range.

**Filters**

| Key    | Label     | Type | Required |
| ------ | --------- | ---- | -------- |
| `from` | Date From | date | No       |
| `to`   | Date To   | date | No       |

**Columns**

`Writer Name`, `Writer Phone`, `Supervisor Name`, `Supervisor Phone`, `Phone Number`, `Network`, `Client Reference`, `Amount`, `Description`, `Datetime`, `Updated At`, `Batch Number`, `UUID`

---

## Report 24: Topup - Supervisor Transfers

**Category:** Finance

Top-up transactions processed via supervisor transfers, optionally filtered by date range.

**Filters**

| Key    | Label     | Type | Required |
| ------ | --------- | ---- | -------- |
| `from` | Date From | date | No       |
| `to`   | Date To   | date | No       |

**Columns**

`Writer Name`, `Writer Phone`, `Supervisor Name`, `Supervisor Phone`, `Phone Number`, `Network`, `Client Reference`, `Amount`, `Description`, `Datetime`, `Updated At`, `Batch Number`, `UUID`

---

## Report 25: Topup - Mobile Money

**Category:** Finance

Top-up transactions processed via mobile money, optionally filtered by date range.

**Filters**

| Key    | Label     | Type | Required |
| ------ | --------- | ---- | -------- |
| `from` | Date From | date | No       |
| `to`   | Date To   | date | No       |

**Columns**

`Writer Name`, `Writer Phone`, `Supervisor Name`, `Supervisor Phone`, `Phone Number`, `Network`, `Client Reference`, `Amount`, `Net Value`, `Description`, `Batch Number`, `UUID`, `Datetime`, `Updated At`

---

## Report 26: Writers - Active Writers

**Category:** General

Active writer count and writer details grouped by period over a date range.

**Filters**

| Key          | Label      | Type | Required |
| ------------ | ---------- | ---- | -------- |
| `start_date` | Start Date | date | **Yes**  |
| `end_date`   | End Date   | date | **Yes**  |

**Columns**

`Period`, `Active Writers`, `Writer Name`, `Phone Number`

---

## Report 27: Export Top-Ups

**Category:** Finance

All top-up transactions within a date range — suitable for bulk export.

**Filters**

| Key         | Label     | Type | Required |
| ----------- | --------- | ---- | -------- |
| `from_date` | From Date | date | **Yes**  |
| `to_date`   | To Date   | date | **Yes**  |

**Columns**

`Date`, `Writer ID`, `Writer Name`, `Writer Phone`, `Supervisor`, `Amount (USD)`, `Airtime Credited`, `Method`, `Reference`, `Created By`

---

## Report 28: Export Sales

**Category:** Finance

All ticket sales within a date range — suitable for bulk export.

**Filters**

| Key         | Label     | Type | Required |
| ----------- | --------- | ---- | -------- |
| `from_date` | From Date | date | **Yes**  |
| `to_date`   | To Date   | date | **Yes**  |

**Columns**

`Date`, `Ticket No`, `Writer ID`, `Writer Name`, `Writer Phone`, `Supervisor`, `Game`, `Draw Event`, `Stakes`, `Amount (USD)`, `Status`, `Channel`, `Player Phone`

---

## Report 29: Export Wins

**Category:** Finance

All winning tickets within a date range — suitable for bulk export.

**Filters**

| Key         | Label     | Type | Required |
| ----------- | --------- | ---- | -------- |
| `from_date` | From Date | date | **Yes**  |
| `to_date`   | To Date   | date | **Yes**  |

**Columns**

`Date Won`, `Ticket No`, `Writer ID`, `Writer Name`, `Writer Phone`, `Supervisor`, `Game`, `Draw Event`, `Ticket Amount (USD)`, `Win Amount (USD)`, `Status`, `Claimed At`, `Expires At`

---

---

# Players — Dashboard Endpoints

Player endpoints are split per game family. Each endpoint exists under two parallel URL trees:

| Game family                            | Base URL                             | Game type codes covered   |
| -------------------------------------- | ------------------------------------ | ------------------------- |
| Dollar Rush                            | `/api/v1/sales/players/dollar-rush/` | `DR`                      |
| 5/90 (Original, Noonrush, Morning Dew) | `/api/v1/sales/players/five-ninety/` | `590_OG`, `590_NR`, `MVG` |

**Permission:** Operator or above on every endpoint.

**Scoping rules**

- `list` and `stats` only include players who have placed at least one ticket in that game family. A player who plays both will appear under both routes.
- `{id}/detail`, `{id}/tickets`, `{id}/wins` are scoped to the game family — a Dollar Rush player UUID requested under the 5/90 route returns `404`, and vice versa. `ticket_counts` in the detail response only reflect tickets in that family.
- `{id}/transactions` returns the player's full wallet ledger. A PlayerWallet is shared across games — there is no per-game wallet — so both routes return identical data for the same player. The dual URL exists so the frontend can call it from either dashboard without branching.

In the endpoint specs below, `{game}` represents either `dollar-rush` or `five-ninety`.

---

## List Players

**`GET /api/v1/sales/players/{game}/list/`**

**Permission:** Operator or above

Paginated list of players who have placed at least one ticket in the `{game}` family, each with a wallet snapshot.

**Query Parameters**

| Parameter | Type    | Description                                                         |
| --------- | ------- | ------------------------------------------------------------------- |
| `search`  | string  | Filter by first name, last name, phone, or email (case-insensitive) |
| `page`    | integer | Page number                                                         |

**Response `200 OK`**

```json
{
  "count": 20,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "141abed7-da9e-4270-8999-ebdd0ec6f0dd",
      "full_name": "Akosua Boateng",
      "phone": "+233550000006",
      "email": "player6@ams1one.com",
      "joined": "2026-05-02T19:50:01.128926+00:00",
      "wallet": {
        "balance": "452.00",
        "total_deposited": "508.00",
        "total_won": "93.00",
        "total_withdrawn": "18.00"
      }
    }
  ]
}
```

| Field                    | Type           | Description                                      |
| ------------------------ | -------------- | ------------------------------------------------ |
| `id`                     | UUID           | Player user UUID                                 |
| `full_name`              | string         | Player's full name                               |
| `phone`                  | string         | Player's phone number                            |
| `email`                  | string         | Player's email address                           |
| `joined`                 | datetime       | Account creation timestamp                       |
| `wallet`                 | object \| null | Wallet snapshot — `null` if no wallet exists yet |
| `wallet.balance`         | decimal string | Current spendable balance                        |
| `wallet.total_deposited` | decimal string | Lifetime deposits                                |
| `wallet.total_won`       | decimal string | Lifetime wins credited                           |
| `wallet.total_withdrawn` | decimal string | Lifetime withdrawals                             |

---

## Player Stats

**`GET /api/v1/sales/players/{game}/stats/`**

**Permission:** Operator or above

Aggregate dashboard statistics for players in the `{game}` family. Counts, active-today, and wallet totals are restricted to players who have a ticket in this family.

**Response `200 OK`**

```json
{
  "game_family": ["DR"],
  "total_players": 20,
  "active_today": 5,
  "tickets_today": 12,
  "wallet_totals": {
    "total_balance": "4820.00",
    "total_deposited": "7340.00",
    "total_won": "1120.00",
    "total_withdrawn": "640.00"
  }
}
```

| Field                           | Type             | Description                                                                        |
| ------------------------------- | ---------------- | ---------------------------------------------------------------------------------- |
| `game_family`                   | array of strings | GameType codes covered by this route, e.g. `["DR"]` or `["590_OG","590_NR","MVG"]` |
| `total_players`                 | integer          | Players who have placed at least one ticket in this game family                    |
| `active_today`                  | integer          | Players who placed at least one ticket in this family today                        |
| `tickets_today`                 | integer          | Tickets in this family placed today                                                |
| `wallet_totals.total_balance`   | decimal string   | Sum of wallet balances across players in this family                               |
| `wallet_totals.total_deposited` | decimal string   | Sum of lifetime deposits across players in this family                             |
| `wallet_totals.total_won`       | decimal string   | Sum of lifetime wins credited across players in this family                        |
| `wallet_totals.total_withdrawn` | decimal string   | Sum of lifetime withdrawals across players in this family                          |

---

## Player Detail

**`GET /api/v1/sales/players/{game}/{id}/detail/`**

**Permission:** Operator or above

Returns a single player's full profile, wallet summary, and ticket status counts **scoped to the `{game}` family**. Returns `404` if the player has never placed a ticket in this family.

**Path Parameters**

| Parameter | Type | Description      |
| --------- | ---- | ---------------- |
| `id`      | UUID | Player user UUID |

**Response `200 OK`**

```json
{
  "id": "141abed7-da9e-4270-8999-ebdd0ec6f0dd",
  "full_name": "Akosua Boateng",
  "phone": "+233550000006",
  "email": "player6@ams1one.com",
  "joined": "2026-05-02T19:50:01.128926+00:00",
  "wallet": {
    "id": "118fff21-863c-43df-86cf-930dbdfeeed8",
    "full_name": "Akosua Boateng",
    "phone": "+233550000006",
    "email": "player6@ams1one.com",
    "balance": "452.00",
    "total_deposited": "508.00",
    "total_won": "93.00",
    "total_withdrawn": "18.00",
    "transactions": []
  },
  "ticket_counts": {
    "active": 2,
    "won": 1,
    "lost": 3,
    "claimed": 0,
    "cancelled": 0,
    "expired": 0
  }
}
```

| Field           | Type           | Description                                                            |
| --------------- | -------------- | ---------------------------------------------------------------------- |
| `wallet`        | object \| null | Full wallet object including transaction history — `null` if no wallet |
| `ticket_counts` | object         | Count of tickets in each status **for this game family only**          |

**Error Responses**

| Status | Cause                                                                                     |
| ------ | ----------------------------------------------------------------------------------------- |
| `404`  | Player UUID not found, user is not a player, or player has no tickets in this game family |

---

## Player Tickets

**`GET /api/v1/sales/players/{game}/{id}/tickets/`**

**Permission:** Operator or above

Paginated ticket history for a specific player, **filtered to the `{game}` family**, newest first.

**Path Parameters**

| Parameter | Type | Description      |
| --------- | ---- | ---------------- |
| `id`      | UUID | Player user UUID |

**Query Parameters**

| Parameter | Type    | Description                                                                         |
| --------- | ------- | ----------------------------------------------------------------------------------- |
| `status`  | string  | Filter by ticket status: `active`, `won`, `lost`, `claimed`, `cancelled`, `expired` |
| `page`    | integer | Page number                                                                         |

**Response `200 OK`**

```json
{
  "count": 4,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "af23b3bf-...",
      "ticket_no": "PL12345678901234567890",
      "game_type": { "id": "...", "name": "NoonRush", "code": "590_NR" },
      "draw_event": {
        "id": "...",
        "name": "Tuesday Noon Rush",
        "event_no": 137
      },
      "channel": "whatsapp",
      "player_phone": "+233550000006",
      "status": "lost",
      "stake_count": 1,
      "total_amount": "5.00",
      "win_amount": null,
      "win_status": null,
      "win_expires_at": null,
      "stakes": [
        {
          "id": "...",
          "sequence_no": 1,
          "play_type": {
            "id": "...",
            "name": "Direct 2 (2 Sure)",
            "code": "D2"
          },
          "numbers": [14, 67],
          "stake_amount": "5.00",
          "total_amount": "5.00",
          "is_winner": false
        }
      ],
      "sold_at": "2026-05-02T18:00:00Z"
    }
  ]
}
```

| Field            | Type                   | Description                                                             |
| ---------------- | ---------------------- | ----------------------------------------------------------------------- |
| `win_amount`     | decimal string \| null | Win amount if the ticket won, otherwise `null`                          |
| `win_status`     | string \| null         | Win claim status: `pending`, `claimed`, `expired`, `voided` — or `null` |
| `win_expires_at` | datetime \| null       | Deadline for claiming the win, or `null`                                |

**Error Responses**

| Status | Cause                                                                                     |
| ------ | ----------------------------------------------------------------------------------------- |
| `404`  | Player UUID not found, user is not a player, or player has no tickets in this game family |

---

## Player Wins

**`GET /api/v1/sales/players/{game}/{id}/wins/`**

**Permission:** Operator or above

Paginated win records for a specific player, **filtered to the `{game}` family**, newest first.

**Path Parameters**

| Parameter | Type | Description      |
| --------- | ---- | ---------------- |
| `id`      | UUID | Player user UUID |

**Query Parameters**

| Parameter | Type    | Description                                                     |
| --------- | ------- | --------------------------------------------------------------- |
| `status`  | string  | Filter by win status: `pending`, `claimed`, `expired`, `voided` |
| `page`    | integer | Page number                                                     |

**Response `200 OK`**

```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "...",
      "ticket": "af23b3bf-...",
      "draw_result": "e765a268-...",
      "win_amount": "1200.00",
      "status": "pending",
      "computed_at": "2026-05-02T14:00:00Z",
      "claimed_at": null,
      "expires_at": "2026-05-09T14:00:00Z"
    }
  ]
}
```

| Field         | Type             | Description                                    |
| ------------- | ---------------- | ---------------------------------------------- |
| `win_amount`  | decimal string   | Amount won                                     |
| `status`      | string           | `pending`, `claimed`, `expired`, or `voided`   |
| `computed_at` | datetime         | When the win was computed after draw           |
| `claimed_at`  | datetime \| null | When the win was claimed — `null` if unclaimed |
| `expires_at`  | datetime \| null | Claim deadline before liquidation              |

**Error Responses**

| Status | Cause                                                                                     |
| ------ | ----------------------------------------------------------------------------------------- |
| `404`  | Player UUID not found, user is not a player, or player has no tickets in this game family |

---

## Player Transactions

**`GET /api/v1/sales/players/{game}/{id}/transactions/`**

**Permission:** Operator or above

Paginated wallet transaction ledger for a specific player, newest first.

> ⚠️ Wallets are **not** game-scoped — there is one `PlayerWallet` per player covering all games. Both the `dollar-rush` and `five-ninety` routes return identical data for the same player. The dual URL exists so the frontend can call from either dashboard without branching. However, the player must still have played the `{game}` family for the route to resolve — otherwise `404`.

**Path Parameters**

| Parameter | Type | Description      |
| --------- | ---- | ---------------- |
| `id`      | UUID | Player user UUID |

**Query Parameters**

| Parameter | Type    | Description                                                                                    |
| --------- | ------- | ---------------------------------------------------------------------------------------------- |
| `tx_type` | string  | Filter by transaction type: `deposit`, `ticket_purchase`, `win_credit`, `withdrawal`, `refund` |
| `page`    | integer | Page number                                                                                    |

**Response `200 OK`**

```json
{
  "count": 4,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "73d7c1d9-...",
      "tx_type": "ticket_purchase",
      "amount": "42.00",
      "balance_after": "452.00",
      "description": "Ticket PL12345678901234567890",
      "reference_id": "af23b3bf-...",
      "created_at": "2026-05-02T19:50:01.131188Z"
    }
  ]
}
```

| Field           | Type           | Description                                                                                                                                                  |
| --------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `tx_type`       | string         | `deposit` — mobile money deposit; `ticket_purchase` — ticket staked; `win_credit` — win credited; `withdrawal` — wallet withdrawal; `refund` — ticket refund |
| `amount`        | decimal string | Transaction amount in USD                                                                                                                                    |
| `balance_after` | decimal string | Wallet balance immediately after this transaction                                                                                                            |
| `description`   | string         | Human-readable description                                                                                                                                   |
| `reference_id`  | UUID \| null   | Reference to the related ticket, win, or payment object                                                                                                      |

**Error Responses**

| Status | Cause                                                   |
| ------ | ------------------------------------------------------- |
| `404`  | Player UUID not found, not a player, or no wallet found |

---

# Supervisor Endpoints

All supervisor endpoints are under **`/api/v1/supervisors/`** and require `Authorization: Bearer <token>`.

---

## Standard CRUD

| Method   | URL                         | Permission          | Description                                                            |
| -------- | --------------------------- | ------------------- | ---------------------------------------------------------------------- |
| `GET`    | `/api/v1/supervisors/`      | Supervisor or above | List all supervisors. Supervisor role sees own record only.            |
| `GET`    | `/api/v1/supervisors/{pk}/` | Supervisor or above | Retrieve a single supervisor.                                          |
| `POST`   | `/api/v1/supervisors/`      | Operator or above   | Create supervisor (requires existing user UUID via `owner` field).     |
| `PATCH`  | `/api/v1/supervisors/{pk}/` | Supervisor or above | Partial update via write serializer (`address`, `owner`, `is_active`). |
| `DELETE` | `/api/v1/supervisors/{pk}/` | Operator or above   | Soft-delete a supervisor.                                              |

---

## Register Supervisor

**`POST /api/v1/supervisors/register/`**

**Permission:** Supervisor or above

Creates a new `User` (role=`supervisor`) and a linked `Supervisor` record in one atomic transaction. Auto-generates the supervisor code (e.g. `SUP-0002`).

**Request Body**

```json
{
  "email": "john.doe@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+233501234567",
  "password": "securepass123",
  "address": "45 Ring Road Central, Accra"
}
```

| Field        | Type   | Required | Description                     |
| ------------ | ------ | -------- | ------------------------------- |
| `email`      | string | Yes      | Must be unique across all users |
| `first_name` | string | Yes      | —                               |
| `last_name`  | string | Yes      | —                               |
| `phone`      | string | Yes      | E.164 format, must be unique    |
| `password`   | string | Yes      | Minimum 8 characters            |
| `address`    | string | No       | Operating address               |

**Response `201 Created`**

```json
{
  "id": "3efd7ffb-5aff-4bc9-adcd-f421c58b8065",
  "code": "SUP-0002",
  "name": "John Doe",
  "phone": "+233501234567",
  "address": "45 Ring Road Central, Accra",
  "owner": {
    "id": "...",
    "email": "john.doe@example.com",
    "full_name": "John Doe"
  },
  "is_active": true,
  "created_at": "2026-04-29T10:00:00Z",
  "updated_at": "2026-04-29T10:00:00Z"
}
```

---

## Edit Supervisor

**`PATCH /api/v1/supervisors/{pk}/edit/`**

**Permission:** Supervisor or above

Updates a supervisor's personal details and/or active status. All fields are optional — send only the fields to change.

**Path Parameters**

| Parameter | Type | Description     |
| --------- | ---- | --------------- |
| `pk`      | UUID | Supervisor UUID |

**Request Body**

```json
{
  "first_name": "John",
  "last_name": "Smith",
  "phone": "+233501234568",
  "address": "12 Liberation Road, Accra",
  "is_active": true
}
```

| Field        | Type    | Required | Description                                                   |
| ------------ | ------- | -------- | ------------------------------------------------------------- |
| `first_name` | string  | No       | Updates the owner user's first name                           |
| `last_name`  | string  | No       | Updates the owner user's last name                            |
| `phone`      | string  | No       | E.164 format; validated for uniqueness (skipped if unchanged) |
| `address`    | string  | No       | Supervisor's operating address                                |
| `is_active`  | boolean | No       | Activate or deactivate the supervisor                         |

**Response `200 OK`**

Full `SupervisorSerializer` output (same shape as Register response).

---

## List Supervisors with Owner Details

**`GET /api/v1/supervisors/owners/`**

**Permission:** Supervisor or above

Returns all supervisors ordered by name, each with their full owner object.

**Response `200 OK`**

```json
[
  {
    "id": "3efd7ffb-5aff-4bc9-adcd-f421c58b8065",
    "code": "SUP-0001",
    "name": "Super Visor",
    "phone": "+233200000003",
    "address": "123 Test Street, Accra",
    "owner": {
      "id": "...",
      "email": "sup@example.com",
      "full_name": "Super Visor"
    },
    "is_active": true,
    "created_at": "2026-01-01T00:00:00Z",
    "updated_at": "2026-04-29T10:00:00Z"
  }
]
```

---

## Detail Cards

**`GET /api/v1/supervisors/detail-cards/`**

**Permission:** Supervisor or above

Returns all supervisors with their latest operational snapshot and current-month financial aggregates. Supervisor role sees their own card only; operator and above sees all.

**Response `200 OK`**

```json
[
  {
    "id": "3efd7ffb-5aff-4bc9-adcd-f421c58b8065",
    "code": "SUP-0001",
    "name": "Super Visor",
    "phone": "+233200000003",
    "address": "123 Test Street, Accra",
    "photo_url": null,
    "is_active": true,
    "operational": {
      "snapshot_date": "2026-04-28",
      "active": 3,
      "passive": 0,
      "inactive": 0,
      "recover": 0,
      "no_use": 0,
      "writers_total": 3,
      "pos_issued": 0,
      "pos_trading": 2,
      "pos_recovery": 0
    },
    "financial": {
      "wallet_balance": 500.0,
      "monthly_topups": 1200.0,
      "monthly_sales": 3400.0,
      "monthly_commissions": 0.0
    }
  }
]
```

**`operational` object**

| Field                                                    | Type           | Description                                              |
| -------------------------------------------------------- | -------------- | -------------------------------------------------------- |
| `snapshot_date`                                          | string \| null | Date of the latest daily snapshot, or `null` if none yet |
| `active` / `passive` / `inactive` / `recover` / `no_use` | integer        | Live writer counts by status                             |
| `writers_total`                                          | integer        | Total writers under this supervisor                      |
| `pos_issued` / `pos_trading` / `pos_recovery`            | integer        | POS device counts from the latest snapshot               |

**`financial` object**

| Field                 | Type   | Description                                                          |
| --------------------- | ------ | -------------------------------------------------------------------- |
| `wallet_balance`      | number | Sum of current `airtime_balance` across all writers' airtime wallets |
| `monthly_topups`      | number | Total top-up amount for the current calendar month                   |
| `monthly_sales`       | number | Total ticket sales for the current calendar month                    |
| `monthly_commissions` | number | Always `0.0` (supervisors have no commission model)                  |

---

## Supervisor Snapshot

**`GET /api/v1/supervisors/{pk}/snapshot/`**

**Permission:** Supervisor or above

Returns the most recent daily operational snapshot for a supervisor.

**Response `200 OK`**

```json
{
  "id": "...",
  "supervisor": "3efd7ffb-5aff-4bc9-adcd-f421c58b8065",
  "snapshot_date": "2026-04-28",
  "active": 3,
  "passive": 0,
  "inactive": 0,
  "recover": 0,
  "no_use": 0,
  "writers_total": 3,
  "total_writers": 3,
  "pos_issued": 0,
  "pos_trading": 2,
  "pos_recovery": 0,
  "created_at": "2026-04-28T23:00:00Z"
}
```

Returns `404` if no snapshot has been computed yet.

---

## Summary

**`GET /api/v1/supervisors/{pk}/summary/`**

**Permission:** Supervisor or above

Returns supervisor info and YTD performance cards for a single supervisor, including contribution ratios against global totals.

**Response `200 OK`**

```json
{
  "supervisor_info": {
    "name": "Super Visor",
    "address": "123 Test Street, Accra",
    "phone": "+233200000003",
    "pos_issued": 0,
    "pos_trading": 2,
    "writers_total": 3
  },
  "summary": {
    "ytd_sales": "3400.00",
    "ytd_topups": "1200.00",
    "ytd_winnings": "200.00",
    "writers_count": 3,
    "ytd_sales_ratio": 12,
    "ytd_topups_ratio": 8,
    "ytd_winnings_ratio": 5,
    "writers_ratio": 4
  }
}
```

**`supervisor_info` fields**

| Field           | Type    | Description                                |
| --------------- | ------- | ------------------------------------------ |
| `name`          | string  | Supervisor's full name                     |
| `address`       | string  | Operating address                          |
| `phone`         | string  | Phone number                               |
| `pos_issued`    | integer | POS devices issued (from latest snapshot)  |
| `pos_trading`   | integer | POS devices trading (from latest snapshot) |
| `writers_total` | integer | Total writers from latest snapshot         |

**`summary` fields**

| Field                | Type           | Description                                               |
| -------------------- | -------------- | --------------------------------------------------------- |
| `ytd_sales`          | decimal string | YTD ticket sales across this supervisor's writers         |
| `ytd_topups`         | decimal string | YTD top-ups across this supervisor's writers              |
| `ytd_winnings`       | decimal string | YTD win amounts on this supervisor's writers' tickets     |
| `writers_count`      | integer        | Current live writer count                                 |
| `ytd_sales_ratio`    | integer        | This supervisor's sales as % of global YTD sales          |
| `ytd_topups_ratio`   | integer        | This supervisor's top-ups as % of global YTD top-ups      |
| `ytd_winnings_ratio` | integer        | This supervisor's winnings as % of global YTD winnings    |
| `writers_ratio`      | integer        | This supervisor's writers as % of all writers system-wide |

---

## Writers Overview

**`GET /api/v1/supervisors/{pk}/writers-overview/`**

**Permission:** Supervisor or above

Paginated, filterable writer table for a single supervisor. Each writer is annotated with YTD sales, YTD top-ups, and days-on-task (distinct days with a valid ticket).

**Query Parameters**

| Parameter | Type    | Description                                                                   |
| --------- | ------- | ----------------------------------------------------------------------------- |
| `status`  | string  | Filter by writer status: `active`, `passive`, `inactive`, `recover`, `no_use` |
| `search`  | string  | Filter by writer first or last name (case-insensitive)                        |
| `page`    | integer | Page number                                                                   |

**Response `200 OK`**

```json
{
  "count": 3,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "...",
      "writer_id": 32,
      "name": "Frank Mawuli",
      "phone": "+233244979958",
      "status": "active",
      "location_address": "Madina Market",
      "ytd_sales": "14826.43",
      "ytd_topups": "10291.00",
      "dot": 28,
      "created_at": "2026-01-15T08:00:00Z"
    }
  ]
}
```

| Field              | Type           | Description                                                           |
| ------------------ | -------------- | --------------------------------------------------------------------- |
| `id`               | UUID           | Writer UUID                                                           |
| `writer_id`        | integer        | Human-readable writer ID                                              |
| `name`             | string         | Writer's full name                                                    |
| `phone`            | string         | Writer's phone number                                                 |
| `status`           | string         | Current writer status                                                 |
| `location_address` | string         | Writer's operating location                                           |
| `ytd_sales`        | decimal string | YTD ticket sales (ACTIVE/WON/LOST/CLAIMED)                            |
| `ytd_topups`       | decimal string | YTD total top-up amount                                               |
| `dot`              | integer        | Days-on-task — distinct days with at least one valid ticket this year |
| `created_at`       | datetime       | Date the writer was registered                                        |

---

## Transactions

**`GET /api/v1/supervisors/{pk}/transactions/`**

**Permission:** Supervisor or above

Paginated, unified transaction ledger for a single supervisor — merges writer top-ups (money in) and successful withdrawals (money out) across all writers, sorted newest-first.

**Query Parameters**

| Parameter   | Type    | Description                                       |
| ----------- | ------- | ------------------------------------------------- |
| `type`      | string  | Filter by type: `topup` or `withdrawal`           |
| `date_from` | date    | Filter from this date (`YYYY-MM-DD`) inclusive    |
| `date_to`   | date    | Filter to this date (`YYYY-MM-DD`) inclusive      |
| `search`    | string  | Filter by writer name or phone (case-insensitive) |
| `page`      | integer | Page number                                       |

**Response `200 OK`**

```json
{
  "count": 42,
  "next": "...?page=2",
  "previous": null,
  "results": [
    {
      "created_at": "2026-04-28T14:30:00Z",
      "type": "topup",
      "writer_name": "Frank Mawuli",
      "writer_phone": "+233244979958",
      "reference": "TXN-00123",
      "amount": "200.00",
      "is_credit": true
    },
    {
      "created_at": "2026-04-27T11:00:00Z",
      "type": "withdrawal",
      "writer_name": "Occc Appiah",
      "writer_phone": "+233501234567",
      "reference": "WD_abc123",
      "amount": "150.00",
      "is_credit": false
    }
  ]
}
```

| Field          | Type           | Description                                                        |
| -------------- | -------------- | ------------------------------------------------------------------ |
| `created_at`   | datetime       | Transaction timestamp                                              |
| `type`         | string         | `topup` — airtime top-up; `withdrawal` — claims wallet withdrawal  |
| `writer_name`  | string         | Writer's full name                                                 |
| `writer_phone` | string \| null | Writer's phone number                                              |
| `reference`    | string \| null | Transaction reference, or `null` if none                           |
| `amount`       | decimal string | Transaction amount in USD                                          |
| `is_credit`    | boolean        | `true` for top-ups (money in), `false` for withdrawals (money out) |

---
