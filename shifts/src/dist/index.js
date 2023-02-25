"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
// MongoDB
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_flow_1 = __importDefault(require("dotenv-flow"));
let env = process.env.APPLICATION_ENV || process.env.NODE_ENV || "development";
dotenv_flow_1.default.config({
    node_env: env,
});
const shiftsC_1 = __importDefault(require("./controllers/shiftsC"));
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.text());
app.use((0, cors_1.default)({ origin: "*" }));
(0, shiftsC_1.default)(app);
// Create a connection with the mongo db
try {
    // , { useNewUrlParser: true, useUnifiedTopology: true, }
    mongoose_1.default.connect(process.env.DB_MONGO || "");
    // mongoose.set("useFindAndModify", false);
    console.log("Connected to mongoDb");
}
catch (error) {
    console.log("MONGODB CONNECTION ERROR:", error);
}
// In case of error (node.js) that restart the pod, we close the connection
process.on("SIGINT", () => mongoose_1.default.connection.close());
process.on("SIGTERM", () => mongoose_1.default.connection.close());
app.listen(port, () => {
    console.log(`⚡️[server]: is running at https://localhost:${port}`);
});
