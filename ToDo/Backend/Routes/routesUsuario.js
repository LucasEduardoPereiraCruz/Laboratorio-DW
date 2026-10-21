// GERENCIA O CADASTRO, LOGIN, LOGOUT E FLUXO DE SENHAS 
import {Router} from "express";
import UsuarioController from "../Controllers/UsuarioController.js";
import UserMiddleware from "../Middleware/UserMiddleware.js";
const routesUsuario = new Router();

routesUsuario.post("/createUsuario", UsuarioController.Create); // Cadastra um novo usuário 
routesUsuario.post("/login", UsuarioController.Login); // Valida credenciais e gera o cookie JWT de sessão.
routesUsuario.post("/logout", UsuarioController.Logout); // Limpa o cookie de sessão.
routesUsuario.post("/resetPassword", UsuarioController.ResetPassword); // Gerenciam o fluxo de recuperação e troca de senha por e-mail.
routesUsuario.post("/forgotPassword", UsuarioController.ForgotPassword); // Gerenciam o fluxo de recuperação e troca de senha por e-mail.
// Rotas Protegidas (Com UserMiddleware):
routesUsuario.get("/me", UserMiddleware, UsuarioController.Profile); // Retorna os dados do perfil do usuário logado atualmente.
routesUsuario.get("/getAllUsers", UserMiddleware, UsuarioController.getAllExceptLogged); // Retorna a lista de todos os usuários do sistema (exceto o próprio usuário logado), usada para selecionar participantes nas tarefas.

export default routesUsuario;