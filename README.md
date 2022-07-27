# Authentication App

<a href="https://authentication-app.deploy.cnoside.dev">
  <img src="https://user-images.githubusercontent.com/82776299/181178080-5e68c7ac-d639-4117-872a-73f1c0ccb3a5.png" /> 
</a>

This is a login app based on the [devchallenges.io](https://devchallenges.io) authentication app wireframe

The app is hosted on https://authentication-app.deploy.cnoside.dev

## Features
- **OAuth** login with [Google](https://developers.google.com/identity/protocols/oauth2) and [Github](https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps)
- **Image uploads** with **S3 Buckets**
- View and edit profile
- **Persistent login** with [Passport.js](https://passportjs.com)
- **Context API**
- Server and client-side **validation**
- Popular react hook libraries (includes [React Hook Form](https://react-hook-form.com) and [React Query](https://tanstack.com/query/v4/?from=reactQueryV3&original=https://react-query-v3.tanstack.com/))
- Built using **Turborepo**, a monorepo build tool
- Implemented CI/CD with **Github Actions**

## What's inside?

### Tech Stack

**Frontend**

- [Next.js](https://nextjs.org/), a react-based framework
- [Chakra UI](https://chakra-ui.com/), a component library

**Backend**

- [Nestjs](https://nestjs.com), a backend web framework powered by Express.js
- [MongoDB](https://www.mysql.com/), a document-oriented database

### Folder Structure

- `apps/api`: API powered by nest.js
- `apps/web`: web app powered by next.js
- `packages/prettier-config`: `prettier` configurations
- `packages/scripts`: scripts used throughout the monorepo (includes `custom-commit` for formatting git commits)

### Utilities

- [Turborepo](https://turborepo.org/) for building monorepos
- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

## How to Setup?

### Prerequisites

- [pnpm](https://www.npmjs.com/): ^6.0.0
- [node](https://nodejs.org/): ^16.0.0
- [MongoDB Server](https://mongodb.com/)
- [S3 Bucket](https://www.digitalocean.com/products/spaces)

### Configuration

Refer to `.env.example` in both `apps/api` and `apps/web` directories and create a `.env` file in each.
  - `apps/api` uses `.env`
  - `apps/web` uses `.env.local`

Alternatively, you can use setup environmental variables in your system
- [Linux](#)
- [Windows](#)
- [Mac](#)

### Start the App

#### For Development

To develop all apps and packages, run the following command:

```bash
# Ensure that NODE_ENV=development
cd authentication-app

pnpm dev
```

#### For Production

To start the app for production, run the following commands:

```bash
# Ensure that NODE_ENV=production
cd authentication-app

pnpm prod
```
