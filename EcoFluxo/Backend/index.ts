import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fs from "fs";
import path from "path";
import swaggerUi from "swagger-ui-express";

// Importar as rotas
import routerUsuario from "./Routes/UsuarioRoutes.js";
import routerEcoponto from "./Routes/EcopontoRoutes.js";
import routerLixeira from "./Routes/LixeirasRoutes.js";


const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Configuração do CORS igual ao seu padrão
app.use(cors({
    credentials: true,
    origin: FRONTEND_URL
}));

app.use(express.json());
app.use(cookieParser());

// Registrar as suas rotas
app.use("/api", routerUsuario);
app.use("/api/ecoponto", routerEcoponto);
app.use("/api/lixeira", routerLixeira);

// Configuração segura do Swagger (padrão da prof: não quebra se o JSON não existir)
try {
    const swaggerPath = path.resolve("./swagger-output.json");
    if (fs.existsSync(swaggerPath)) {
        const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, "utf-8"));
        app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    } else {
        console.warn(" Arquivo swagger-output.json não encontrado. Execute o comando do swagger primeiro.");
    }
} catch (error) {
    console.warn(" Erro ao carregar o documento do Swagger:", error);
}

app.listen(PORT, () => {
    console.log(` Servidor rodando na porta ${PORT}`);
    console.log(` Swagger disponível em http://localhost:${PORT}/docs`);
});