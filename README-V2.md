# FinCore Enterprise Banking V2

This is a consolidated portfolio-grade upgrade of FinCore. It is not connected to HDFC, SBI, RBI, NPCI, card networks, or real payment rails. NEFT/RTGS/IMPS-style concepts are represented as application-level simulations only.

## Data ownership
- MySQL: source of truth for users, accounts, balances, transactions, beneficiaries, service requests.
- Redis: OTP/cache/security counters; never the source of truth for money.
- MongoDB: audit/activity events.

## Implemented in V2
- customer registration/login/profile/nominee/KYC status fields
- SAVINGS/CURRENT/SALARY accounts, one active account per type
- ACTIVE/FROZEN/CLOSURE_REQUESTED/CLOSED lifecycle
- deposit/withdraw/transfer with locking and transaction history
- live dashboard API
- beneficiaries and service requests
- OTP-ready Redis flow and MongoDB audit activity
- environment-driven admin password and CORS origins
- Prometheus metrics/Grafana provisioning
- Jenkinsfile, Docker, Kubernetes and Helm starter assets

## Start infrastructure
```powershell
docker compose up -d mysql redis mongo prometheus grafana
```

## Start backend
```powershell
$env:SPRING_PROFILES_ACTIVE="mysql"
$env:DB_USERNAME="bankuser"
$env:DB_PASSWORD="bankpass"
$env:FINCORE_ADMIN_PASSWORD="Use-A-Strong-Local-Password"
$env:FINCORE_CORS_ORIGINS="http://localhost:5173"
mvn clean test
mvn spring-boot:run
```

## Start frontend
```powershell
cd frontend
npm install
npm run dev
```

## Main APIs
- `GET /api/accounts/dashboard`
- `POST /api/accounts`
- `POST /api/accounts/{number}/deposit`
- `POST /api/accounts/{number}/withdraw`
- `POST /api/accounts/transfer`
- `POST /api/accounts/{number}/closure-request`
- `PUT /api/auth/profile`
- `GET/POST /api/beneficiaries`
- `GET/POST /api/service-requests`
- `POST /api/security/otp` (demo returns OTP; production must deliver out-of-band)
- `GET /api/security/activity`

## Production hardening still required
A real bank would also require regulated KYC integrations, HSM-backed keys, MFA out-of-band delivery, WAF/API gateway, secrets manager/Vault, database encryption and backups, fraud/AML systems, maker-checker controls, disaster recovery, SIEM, penetration tests, legal/regulatory approvals, PCI-DSS where applicable, and real payment-network certification.
