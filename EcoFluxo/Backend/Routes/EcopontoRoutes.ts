import { Router } from 'express';
import EcopontoController from '../Controllers/EcopontoController.js';

const routerEcoponto = Router();
routerEcoponto.post("/createEcoponto", EcopontoController.Create);
routerEcoponto.get("/getEcopontos", EcopontoController.getEcopontos);

export default routerEcoponto; 