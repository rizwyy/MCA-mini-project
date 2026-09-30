# ResolveAI Hospitality — validation prototype

This is a local, frontend-only prototype for testing a narrow hospitality workflow:

1. A guest scans a QR code and submits an issue, service request, or feedback.
2. The guest receives a private prototype tracking link.
3. A manager advances the request through a simple queue.

## What this intentionally is not

- No live database, authentication, image storage, AI analysis, notifications, or staff accounts.
- No claim of production security, real-time delivery, measured impact, or customer adoption.
- All visible requests and venue data are fictional.

The point is to test whether guests use a QR form and whether a hotel team can respond faster—not to simulate a finished SaaS business.

## Run locally

```bash
cp .env.example .env
npm install
npm run dev
```

Open the guest prototype at `/feedback/harbor-house/RM204`, the restaurant variant at `/feedback/cove-kitchen/T12`, and the manager console at `/ops`.

## Pilot evidence to collect

- Number of scans and completed submissions by service point.
- Median time to staff acknowledgement.
- Median time to resolution.
- Whether staff act from the queue without repeated chasing.
- A paid continuation decision from the owner or general manager.

Only build a database, authentication, AI, and operational controls after this workflow has evidence of repeat use and a paying pilot.
