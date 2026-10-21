import "dotenv/config"; //tem que ser a primeira linha no index.js
import express from "express";
//websocket
import {Server} from "socket.io";
//juntar o express e websocket
import {createServer} from "http";
import registerChatSocket from "./Socket/registerChatSocket.js";
import cors from "cors";
import routesTarefa from "./Routes/routesTarefa.js";
import routesUsuario from "./Routes/routesUsuario.js";
import routesChat from "./Routes/routesChat.js";
import swaggerUi from "swagger-ui-express";
import { createRequire } from "module"; // Ferramenta do Node.js usada aqui para permitir importar arquivos .json
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 5000; // Definição da porta 
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
//suporte para importar arquivos json usando ESModules
const require = createRequire(import.meta.url);
const swaggerDocument = require("./swagger-output.json");
const app = new express();
//comunicação entre front e back usar json
app.use(express.json());

app.use(cors({
    credentials: true, // Permite o envio de cookies entre domínios/portas diferentes
    origin: FRONTEND_URL // Libera apenas o endereço do frontend React
}));
app.use(cookieParser()); // Habilita o Express a ler cookies HTTP (como o token JWT)


//criar um servidor Http
const httpServer = createServer(app);
//iniciar o websocket
const io = new Server(httpServer,{
    cors:{
        origin: FRONTEND_URL,
        credentials: true,
    }
}); 
io.on("connect", (socket)=>{
    console.log(`Usuário Conectado: ${socket.id}`);
    registerChatSocket(io, socket); // Delega os eventos do chat para o arquivo de rotas/eventos do socket
    socket.on("disconnect", ()=>{
        console.log(`Usuário desconectou: ${socket.id}`);

    });
});

//obrigatoriamente o swagger deve vir antes das rotas
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Todas as rotas de tarefas, usuários e chat começam com o prefixo /ToDo
app.use("/ToDo", routesTarefa);
app.use("/ToDo", routesUsuario);
app.use("/ToDo", routesChat);

// Inicialização do Servidor 
httpServer.listen(PORT, ()=>{ // Põe o servidor para escutar requisições na porta definida (5000), oficializando que a aplicação está no ar.
    `Servidor rodando na porta ${PORT}`;
});