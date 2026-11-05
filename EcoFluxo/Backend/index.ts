import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { createRequire } from "module";


import routerEcoponto from "./Routes/EcopontoRoutes.js";
import routerLixeira from "./Routes/LixeirasRoutes.js";

const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";


const require = createRequire(import.meta.url);
const swaggerDocument = require("./swagger-output.json");

const app = express();


app.use(express.json());
app.use(cors({
    credentials: true,
    origin: FRONTEND_URL
}));
app.use(cookieParser());


app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use("/ecoponto", routerEcoponto);
app.use("/lixeira", routerLixeira);


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Swagger disponível em http://localhost:${PORT}/docs`);
});