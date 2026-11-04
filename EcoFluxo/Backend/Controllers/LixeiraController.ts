import prisma from "../lib/prisma.js";
import type { Request, Response } from "express";

export default class LixeiraController {

    // Método Create 
    static async Create(req: Request, res: Response) {
        try {
            const { uuid_sensor, tipo, volume_max, nivel_cheio, ecoponto_id } = req.body;

            // Verificação dos dados obrigatórios
            if (!uuid_sensor || !tipo || !volume_max === undefined || !nivel_cheio === undefined || !ecoponto_id) {
                return res.status(400).json({
                    error: "Os campos 'uuid_sensor', 'tipo', 'volume_max', 'nivel_cheio' e 'ecoponto_id' são obrigatórios."
                });
            }

            // Verifica se o ecoponto informado realmente existe
            const ecopontoExiste = await prisma.ecoponto.findUnique({
                where: { id: Number(ecoponto_id) }
            });

            if (!ecopontoExiste) {
                return res.status(404).json({
                    error: "O Ecoponto informado não foi encontrado."
                });
            }

            // Inserir no banco de dados
            const novaLixeira = await prisma.lixeira.create({
                data: {
                    uuid_sensor, 
                    tipo, 
                    volume_max: Number(volume_max),
                    nivel_cheio: Number(nivel_cheio),
                    ecoponto_id: Number(ecoponto_id)
                }
            });

            return res.status(201).json({
                message: "Lixeira criada com sucesso!", 
                lixeira: novaLixeira
            }); 
        }

        catch (error) {
            console.error("Erro ao criar lixeira", error); 
            return res.status(500).json({
                error: "Erro interno ao tentar cadastrar a lixeira"
            }); 
        }
    }


    static async getLixeiras(req: Request, res: Response){
        try 
        {
            const lixeiras = await prisma.lixeira.findMany({
                orderBy: {
                    criadoEm: 'desc'
                }, 
                include: {
                    ecoponto: true
                }
            }); 

            return res.status(200).json(lixeiras); 
        }
        catch (error) 
        {
            console.error("Erro ao buscar lixeiras", error); 
            return res.status(500).json({
                error: "Erro interno ao tentar buscar as lixeiras"
            }); 
        }
    }
}