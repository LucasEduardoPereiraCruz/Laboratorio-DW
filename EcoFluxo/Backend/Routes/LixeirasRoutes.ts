import { Router } from 'express';

import LixeiraController from '../Controllers/LixeiraController.js';

const routerLixeira = Router();

// Rota para cadastrar lixeira 
routerLixeira.post("/createLixeira", LixeiraController.Create);

// Rota para listar todas as lixeiras 
routerLixeira.get("/getLixeiras", LixeiraController.getLixeiras);

export default routerLixeira;