import prisma from "../lib/prisma.js";
import type {Request, Response} from "express"; 

export default class EcopontoController{
    static async Create(req:Request, res:Response){
        try {
            const {} = req.body;
            // Verificação dos dados obrigatórios

            // Inserir no banco de dados


        } catch (error) {
            
        }
        

    }
    static async getEcopontos(req:Request, res:Response){

    }
}