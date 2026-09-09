# tisl_backend

## Description



## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
npm run start:prod
```

## TODO

- Contact Inquiries (`src/domain/contact-inquiry`): by default, every new "Request More Info" submission should send an email notification to **medinfo_india@terumo.co.jp**. Not yet wired up — no SMTP/Azure Communication Email credentials are configured. `nodemailer` and `@azure/communication-email` are already in `package.json`; add the credentials to `.env` and implement the send in `ContactInquiryService.create()` (see TODO comment there).

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
