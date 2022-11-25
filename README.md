[contributing]: ./CONTRIBUTING.md

## What?

What is this? Well, I ask that question to myself every time I start a new project. However, for a thing. I have an answer. **A Thing** is a platform that __*provides a safe, secure and an anonymous*__ environment for everyone who want's to **journal, rant, vent or help other's** in their lives.

## Why?

To put simply, **A Thing** goal is to give people a voice in an anonymous, open source way. Me and My Friend Devesh came up with the idea on a phone call on a late night where we both felt the need for a platform. Over the coming days a quick friend-survey rooted for such a place to exist where they could rant about their day or just vent in a anonymous way without being tied to their identities. We often struggle with mental health and all of us in our lives go through stuff we barely talk about because we'd be bombarded with the great human quality called, "Judgement" or special qualities where we feel the listener "Does Not Give A F^!#$" about our thoughts that keep us occupied. A Thing is for everything that 

## Ok, Cool but how?

How? Well, I'm glad you asked. A Thing is built on top of the T3 Stack. What is t3 stack? Here's a quick overview:
- T3 ensures e2e type safety. [Extremely Important (& Cool)]
- What is 'T3'?
  - T3 generally means, Typesafety, Tailwind and tRPC, however there is also NextJS, Next-Auth and Prisma which are all remarkable tools on their own. Combine them, you get t3.
- What is 'Typesafe'?
  - Google.

## I want to contribute

Thank You! <3 I'm glad you want to contribute. Please read the [Contribution Guidelines][contributing] for more information.


## I want to run this locally

### Prerequisites

- NodeJS
- Yarn
- Github CLI

### Steps

Once you have the prerequisites, open up your favorite terminal and run the following commands:

```bash
git clone <repo_link>
yarn install
yarn run dev
```

There are a few Custom Commands in the `package.json` file. Here's a quick overview:

- `yarn run dev` - Runs the development server
- `yarn run build` - Builds the project. I've added `prisma migrate deploy` to deploy the database migrations before the build starts just to be sure in the prod/dev that my migrations are deployed. You can remove it if you don't want to use Prisma.
- `yarn run postinstall` - Runs the `prisma generate` command after the `yarn install` command. This is to ensure that the Prisma Client is generated after the install command is run. You can also remove this if you don't want to use Prisma or run `npx prisma generate` after the `yarn install` command which is the same thing.
- `yarn run lint` - Runs ESLint on the project.
- `yarn run start` - Runs the production server. This is the command that is run on the server. It runs the `yarn run build` command before starting the server.
- `yarn run dev:migrate:postgres` - Runs the `prisma migrate dev` command. This is to ensure that the migrations are deployed in the development environment (NOT PRODUCTION; REFER TO `prisma migrate deploy`).
- `yarn run dev:studio` - Runs the Prisma Studio (with the development database from `.env.devlopment`).