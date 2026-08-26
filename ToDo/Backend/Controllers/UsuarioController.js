import Usuario from "../Models/Usuario.js";
//import argon2 from "argon2"; 
import {Types} from "mongoose"; 
export default class UsuarioController{
    static async Create(req, res){
        const{nome, email, senha} = req.body
        if(!nome || !email || !senha) // Validação para ver se foram preenchidos oq é requerido (Só pode por os requeridos)
        {
            return res.status(422).json({message: "Todos os dados são obrigatórios"});
        }

        try
        {
            //const hashPassword = await argon2.hash(senha); 
            const usuario = new Usuario({
                nome, 
                email, 
                senha,
                //senha: hashPassword,
            });
            const novoUsuario = await usuario.save();
            res.status(200).json({message: "Usuário inserido com sucesso", novoUsuario}); 
            return;
        } 
        catch (error)
        {
            return res.status(500).json({message: "Problema ao inserir um Usuario", error});
        }

    } // fim create
}    