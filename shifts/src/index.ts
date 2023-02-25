import express, { Express } from "express";
import cors from "cors";
import bodyParser from "body-parser";
// MongoDB
import mongoose from "mongoose";
import dotenv from "dotenv-flow";
let env = process.env.APPLICATION_ENV || process.env.NODE_ENV || "development";
dotenv.config({
  node_env: env,
});
import shiftsC from "./controllers/shiftsC";

const app: Express = express();
const port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.text());

app.use(cors({ origin: "*" }));
shiftsC(app);

// Create a connection with the mongo db
try {
  // , { useNewUrlParser: true, useUnifiedTopology: true, }
  mongoose.connect(process.env.DB_MONGO || "");
  // mongoose.set("useFindAndModify", false);
  console.log("Connected to mongoDb");
} catch (error) {
  console.log("MONGODB CONNECTION ERROR:", error);
}

// In case of error (node.js) that restart the pod, we close the connection
process.on("SIGINT", () => mongoose.connection.close());
process.on("SIGTERM", () => mongoose.connection.close());

app.listen(port, () => {
  console.log(`⚡️[server]: is running at https://localhost:${port}`);
});
