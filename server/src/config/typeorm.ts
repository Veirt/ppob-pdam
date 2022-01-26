import { createConnection } from "typeorm";

export default async () => {
  try {
    return await createConnection();
  } catch (err) {
    console.error(`Something went wrong when connecting to database: ${err}`);
    throw err;
  }
};
