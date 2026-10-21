// GERENCIA OS ENDPOINTS RELACIONADOS À MENSAGENS

// Importa o Router do Express, o ChatController e o UserMiddleware 
// (para proteger a rota e garantir que só usuários logados leiam o chat).
import {Router} from "express";
import ChatController from "../Controllers/ChatController.js";
import UserMiddleware from "../Middleware/UserMiddleware.js";
const routesChat = new Router();

// É uma rota do tipo GET para buscar o histórico.
// O :tarefaId na URL é um parâmetro dinâmico (o ID da tarefa específica).
// O UserMiddleware roda primeiro para validar a sessão via cookie. Se aprovado, chama ChatController.getHistory para devolver as mensagens do banco.
routesChat.get("/getHistory/:tarefaId", UserMiddleware, ChatController.getHistory);

export default routesChat;