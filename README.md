# **athing.**

[Live Demo](https://athing.vercel.app)

![image](https://user-images.githubusercontent.com/36449128/204675000-bcb5643a-8dff-433f-901b-7a532a62301d.png)

**athing.** is a platform that **_provides a safe, secure and an anonymous_** environment for everyone who want's to **journal, rant, vent or help other's** in their lives.

### goals.

- to give people a voice in an anonymous, open source way.
- write notes, make them public or private.
- create public or private journals and journal entrie.
- customize your experience by selecting from a bunch of theme's both for the app and for the journals.

### contributing.

- be nice.
- a pull request does not mean it will be merged.
- this is a hobby project, so don't expect a quick response but i'll try my best!
- discuss the changes you want to make in the issue before making a pull request.
  don't make a pull request without an issue.
- any contributions fall under MIT License.

### locally running this.

1. run `git clone https://github.com/is-it-ayush/athing && cd athing`.
2. copy [`.env.example`](./.env-example) to a new file called `.env` and fill in the values.
3. run `pnpm install` to install the dependencies.
4. run `pnpm dev` to start the development server.

### database setup.

1. run `docker run --name athing-postgres -e POSTGRES_PASSWORD=athing -e POSTGRES_USER=athing -e POSTGRES_DB=athing -p 5432:5432 -d postgres:latest`.
2. put `postgresql://athing:athing@localhost:5432/athing` in the `DATABASE_URL` field in the `.env` file.
3. run `pnpm db:push` to push the migrations to the database.

### command reference.

| command           | description                                     |
| ----------------- | ----------------------------------------------- |
| `pnpm build`      | builds the next.js app.                         |
| `pnpm clean`      | removes all the node_modules and .next folders. |
| `pnpm db:gen`     | generates the prisma client.                    |
| `pnpm db:migrate` | runs the prisma migrations.                     |
| `pnpm db:push`    | pushes the prisma schema to the database.       |
| `pnpm db:reset`   | resets the prisma migrations.                   |
| `pnpm dev`        | starts the development server.                  |
| `pnpm format`     | checks the code for formatting issues.          |
| `pnpm format:fix` | fixes the formatting issues.                    |
| `pnpm lint`       | checks the code for linting issues.             |
| `pnpm lint:fix`   | fixes the linting issues.                       |
| `pnpm start`      | starts the production server.                   |
| `pnpm typecheck`  | checks the code for type errors.                |
| `pnpm test`       | runs the tests.                                 |
