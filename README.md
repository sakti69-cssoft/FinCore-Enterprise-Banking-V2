# FinCore — Enterprise Banking Management System

A portfolio-grade Enterprise Java REST API built with Java 21, Spring Boot, Spring Security, Spring Data JPA, Maven, H2 and MySQL.

## Features

- Customer registration with BCrypt password hashing
- HTTP Basic authentication for the first enterprise version
- CUSTOMER and ADMIN roles
- Savings/current bank account creation
- Deposit and withdrawal operations
- Account-to-account money transfer
- Transaction history and references
- Balance validation and account ownership checks
- Pessimistic database locks for money-moving operations
- Optimistic entity versioning on accounts
- Bean Validation and centralized exception responses
- Spring Boot Actuator health/metrics endpoints
- H2 demo profile and MySQL production-like profile
- Dockerfile, MySQL Compose file and GitHub Actions starter workflow

## Architecture

```text
Client
  |
  v
Controller / REST API
  |
  v
Service / Business Logic
  |
  v
Repository / Spring Data JPA
  |
  v
MySQL or H2
```

## Requirements

- JDK 21
- Maven 3.9+
- MySQL 8+ only if using the mysql profile

## Run instantly with H2

```bash
mvn spring-boot:run
```

Health check:

```text
GET http://localhost:8080/actuator/health
```

## Run with MySQL

Start MySQL:

```bash
docker compose up -d mysql
```

Windows PowerShell:

```powershell
$env:SPRING_PROFILES_ACTIVE="mysql"
$env:DB_USERNAME="bankuser"
$env:DB_PASSWORD="bankpass"
mvn spring-boot:run
```

Git Bash/Linux:

```bash
export SPRING_PROFILES_ACTIVE=mysql
export DB_USERNAME=bankuser
export DB_PASSWORD=bankpass
mvn spring-boot:run
```

## Demo administrator

For local learning only:

- Username: `admin@bank.local`
- Password: `Admin@12345`

Change/remove this seeded credential before any real deployment.

## API walkthrough

### 1. Register customer

`POST /api/auth/register`

```json
{
  "fullName": "Demo Customer",
  "email": "customer@example.com",
  "password": "Password@123"
}
```

### 2. Create an account

Use Basic Auth with the registered email/password.

`POST /api/accounts`

```json
{
  "accountType": "SAVINGS"
}
```

### 3. List my accounts

`GET /api/accounts`

### 4. Deposit

`POST /api/accounts/{accountNumber}/deposit`

```json
{
  "amount": 5000.00,
  "description": "Opening deposit"
}
```

### 5. Withdraw

`POST /api/accounts/{accountNumber}/withdraw`

```json
{
  "amount": 500.00,
  "description": "ATM withdrawal"
}
```

### 6. Transfer

`POST /api/accounts/transfer`

```json
{
  "fromAccount": "SOURCE_ACCOUNT_NUMBER",
  "toAccount": "DESTINATION_ACCOUNT_NUMBER",
  "amount": 1000.00,
  "description": "Rent payment"
}
```

### 7. Transaction history

`GET /api/accounts/{accountNumber}/transactions`

### 8. Admin user list

Using the admin credentials:

`GET /api/admin/users`

## Recommended Postman order

1. Register Customer A
2. Create account for Customer A
3. Deposit money into A
4. Register Customer B
5. Create account for Customer B
6. Transfer A -> B
7. Check transaction history for both accounts
8. Try an over-balance withdrawal to verify error handling
9. Call `/api/admin/users` as a customer and confirm HTTP 403
10. Call `/api/admin/users` as admin

## Next evolution

This is Project 1: Enterprise Java. After it is working locally, the Cloud-Native project can add a deeper Jenkins/SonarQube/Trivy/Docker/Kubernetes/Helm/Prometheus/Grafana lifecycle. The later FinTech Payment System will use true microservices and distributed infrastructure.
