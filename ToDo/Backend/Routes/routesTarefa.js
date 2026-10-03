import {Router} from "express";
import TarefaController from "../Controllers/TarefaController.js";
import UserMiddleware from "../Middleware/UserMiddleware.js";
const routesTarefa = new Router();

// Criar uma tarefa
routesTarefa.post("/create", UserMiddleware, TarefaController.Create);
// Buscar todas as tarefas
routesTarefa.get("/getAll", UserMiddleware, TarefaController.getAll);

// TAREFA VÂNIA
// Altera a situação da tarefa
routesTarefa.put("/updateSituacao/:id", UserMiddleware, TarefaController.UpdateSituacao); 


export default routesTarefa;