# FinCore Premium Banking UI

## Architecture
- Backend: Java 21 + Spring Boot, port 8080
- Frontend: React + Vite, port 5173
- Authentication: HTTP Basic (demo/learning architecture)
- Database: H2 by default; MySQL profile included

## New backend additions
- `GET /api/auth/me` for the authenticated customer profile
- CORS enabled for `http://localhost:5173`

## Run backend
From the project root:

```powershell
mvn spring-boot:run
```

Verify:

```powershell
Invoke-RestMethod http://localhost:8080/actuator/health
```

## Run frontend
Open a second PowerShell:

```powershell
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite (normally `http://localhost:5173`).

## Existing demo customer
If you restart the H2 backend, in-memory data is cleared. Register again through the browser.

## UI capabilities
- Marketing/landing page
- Customer registration
- Secure sign-in
- Live dashboard total balance
- Savings/Current account cards
- Open additional account
- Deposit
- Withdraw
- Account-to-account transfer
- Transaction history
- Transaction search
- Responsive desktop/mobile layout
- Sign out

## Production note
HTTP Basic is intentionally retained because it matches the existing backend you already tested. For a production-grade next iteration, replace it with JWT/OAuth2 and serve the frontend behind HTTPS.
