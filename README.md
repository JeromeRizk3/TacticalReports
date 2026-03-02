# Tactical Reports Demo

This repository contains a **NestJS** application that simulates the backend for a tactical reports website. It’s designed as a demo with in-memory data for authentication and MongoDB (via Mongoose) for storing various user interactions.

---

## Core Features

- **User authentication** with fake tokens (`/authentication/login`).
- **Feed generation** (`/feed`) based on user behavior and interactions.
  - Weighted scoring from purchases, view history, and campaign interactions
  - Pagination, search, and category filtering
  - Automatically returns explanations for why a report is recommended
- **Interaction tracking** modules:
  - **Purchases** (`/purchases`) – record when a user buys a report
  - **View history** (`/view-history`) – log views with dwell time
  - **Campaign interactions** (`/campaign-interactions`) – capture user actions on marketing campaigns
- **Modular design** following NestJS conventions: each feature has its own module, controller, service, schema, and DTOs.

## Code Highlights & Structure

```
src/
 ├─ modules/
 │   ├─ authentication/      # simple in-memory user store and login logic
 │   ├─ feed/                # main recommendation logic
 │   │   ├─ schemas/         # Mongoose schema for `Record`
 │   │   ├─ feed.service.ts  # scoring and pagination
 │   │   ├─ feed.controller.ts
 │   ├─ purchases/           # purchase schema, service, controller
 │   ├─ viewHistory/         # similar structure with dwell time metadata
 │   └─ campaignInteractions/
 ├─ init/database/           # bootstrap mongoose connection
 └─ main.ts                  # NestJS bootstrap
```

- **DTOs** are used for request validation; create endpoints now accept typed objects. Example: `CreatePurchaseDto`.
- **ConfigService** powers adjustable weights (e.g. `PURCHASE_WEIGHT`) for scoring logic.
- **Pagination & Filtering** are implemented in `FeedService.getFeed()` with query parameters.

## Database

The app uses MongoDB with Mongoose. Schemas include:

- `Record` – represents a tactical report with `title`, `category`, `published_at`, `image_url`, etc.
- `Purchase`, `ViewHistory`, and `CampaignInteraction` documents track user activity.

Sample JSON data is included earlier in the conversation for manual insertion via MongoDB Compass.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the app (ensure MongoDB is running locally):
   ```bash
   npm run start:dev
   ```
3. Use tools like Postman or curl to hit the endpoints:
   - `POST /authentication/login` with email/password.
   - Include returned token in subsequent requests (demo app does not enforce auth).

## Testing

Basic controller and service spec files are provided for each module. Run:

```bash
npm run test
```

## Notes

- This is a demo and not production‑hardened. Credentials are stored in memory.
- The feed logic is intentionally simple but showcases how multiple interaction sources can be combined for ranking.

---

Feel free to expand on modules, add validation, or connect a real auth provider! Happy hacking.
