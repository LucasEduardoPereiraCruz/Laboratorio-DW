import express from "express"; 
import cors from "cors"; 
// Incluir as rotas 
import routes from "./Routes/routes.js"; 
import swaggerUI from "swagger-ui-express"; 
import { createRequire } from "module";

// Suporte para importar arquivos json usando ESModules
const require = createRequire(import.meta.url); 
const swaggerDocument = require("./swagger-output.json"); 
const app = new express();

// comunicação entre front e back usar json 
app.use(express.json());
app.use(cors({
    credentials: true, 
    origin: "http://localhost:3000"
})); 

// Obrigatoriamente o swagger deve vir antes das rotas 
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
// Ligar express com as rotas
app.use("/ToDo", routes)
app.listen(5000); // Em qual porta o back vai rodar 
