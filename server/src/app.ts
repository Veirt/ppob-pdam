import express from "express";
import connectDatabase from "./config/typeorm";

connectDatabase().then(async () => {
  const app = express();
  import("./routes").then((router) => app.use(router.default));

  app.listen(8080, () => console.log("Listening on http://localhost:8080"));
});
