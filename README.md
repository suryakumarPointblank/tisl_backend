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

- **Contact Inquiries** (`src/domain/contact-inquiry`): every new submission is emailed based on `source`. "Request More Info" (no `source`) goes to `CONTACT_INQUIRY_NOTIFICATION_EMAIL` (production: **medinfo_india@terumo.co.jp**); any other CTA (e.g. `account_deletion_request`) goes to `GENERAL_INQUIRY_NOTIFICATION_EMAIL` (production: **tisl@terumo.co.jp**). While in testing, both are set to a test inbox (`surya@pointblank.co.in`) — update the env vars when ready to go live.
- **Other CTAs** (slide deck requests, case submissions, webinar interest, webinar registrations): each new submission also emails `GENERAL_INQUIRY_NOTIFICATION_EMAIL` via `MailService.notifyGeneral()`. A mail failure is logged but never fails the submission.
- **Training Program Registration** (`src/domain/training-program-registration`): a confirmation email is sent to the registrant on `register()`, and can be resent via `POST :id/resend-confirmation`.

## TODO

- Mail: `MAIL_FROM` must be a verified sender identity (or authenticated domain) in SendGrid's Sender Authentication settings, or sends will fail with a 403. Pick a generic sending address (e.g. `noreply@terumo.co.jp`), verify it in SendGrid, then set `MAIL_FROM` in `.env` accordingly.
- Mail: once testing is complete, switch `CONTACT_INQUIRY_NOTIFICATION_EMAIL` in `.env` from the test inbox to **medinfo_india@terumo.co.jp**, and `GENERAL_INQUIRY_NOTIFICATION_EMAIL` to **tisl@terumo.co.jp**.

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
