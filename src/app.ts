import env from "#config/env/env.js";
import express from 'express';
import { ErrorsHandlerMiddleware } from "#middlewares/errorHandler.middleware.js";
import knex, { migrate, seed } from "#postgres/knex.js";
import { sheduleCrone } from "#utils/cron.js";
await migrate.latest();
await seed.run();

console.log("All migrations and seeds have been run");

const app = express();
app.use(ErrorsHandlerMiddleware)
sheduleCrone();

const PORT = env.APP_PORT;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

