import { Router } from 'express';
import { autenticacaoToken, autorizacaoPerfil } from "../Middlewares/seguranca.js";
import LixeiraController from '../Controllers/LixeiraController.js';

const routerLixeira = Router();

// Rota para cadastrar lixeira (Protegida para GESTOR)
routerLixeira.post("/createLixeira", autenticacaoToken, 
    autorizacaoPerfil("GESTOR"), LixeiraController.Create);

// Rota para listar todas as lixeiras 
routerLixeira.get("/getLixeiras", LixeiraController.getLixeiras);

export default routerLixeira;