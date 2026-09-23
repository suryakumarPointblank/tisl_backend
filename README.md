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

## Mail

Email is sent via `MailModule` (`src/infrastructure/mail`), which uses `nodemailer` against the SendGrid SMTP relay. Configure `SMTP_*`/`MAIL_FROM` in `.env` (see `.env.example`).

- **Contact Inquiries** (`src/domain/contact-inquiry`): every new "Request More Info" submission emails `CONTACT_INQUIRY_NOTIFICATION_EMAIL`. While in testing, this is set to a test inbox (`surya@pointblank.co.in`) instead of the production recipient **medinfo_india@terumo.co.jp** — update the env var when ready to go live.
- **Training Program Registration** (`src/domain/training-program-registration`): a confirmation email is sent to the registrant on `register()`, and can be resent via `POST :id/resend-confirmation`.

## TODO

- Mail: `MAIL_FROM` must be a verified sender identity (or authenticated domain) in SendGrid's Sender Authentication settings, or sends will fail with a 403. Pick a generic sending address (e.g. `noreply@terumo.co.jp`), verify it in SendGrid, then set `MAIL_FROM` in `.env` accordingly.
- Mail: once testing is complete, switch `CONTACT_INQUIRY_NOTIFICATION_EMAIL` in `.env` from the test inbox to the production recipient **medinfo_india@terumo.co.jp**.

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
