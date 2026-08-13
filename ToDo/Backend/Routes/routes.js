import {Router} from "express"; 
import TarefaController from "../Controllers/TarefaController.js"

const routes = new Router()

routes.post("/create", TarefaController.Create); // Após o ponto temos que usar o verbo/requisição HTTP
routes.get("/getAll", TarefaController.getAll); 


export default routes; 

/*

=== VERBOS HTTP ===
- GET 
- POST
- DELETE
- PUT = ALTERAR TUDO 
- PATCH = ALTERAR PARTE

*/
