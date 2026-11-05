import prisma from "../lib/prisma.js";
import type { Request, Response } from "express";

export default class EcopontoController {
    static async Create(req: Request, res: Response) {
        try {
            const { nome, latitude, longitude, descricao, cep, logradouro, numero, bairro, cidade, uf, nota } = req.body;

            // Verificação dos dados obrigatórios
            if (!nome || !latitude || !longitude) {
                return res.status(400).json({
                    error: "Os campos 'nome', 'latitude' e 'longitude' são obrigatórios."
                });
            }

            // Inserir no banco de dados
            const novoEcoponto = await prisma.ecoponto.create({
                data: {
                    nome,
                    latitude: String(latitude),
                    longitude: String(longitude),
                    descricao: descricao ?? null,
                    cep: cep ?? null,
                    logradouro: logradouro ?? null,
                    numero: numero ?? null,
                    bairro: bairro ?? null,
                    cidade: cidade ?? null,
                    uf: uf ?? null,
                    nota: nota !== undefined && nota !== null ? Number(nota) : null
                }
            });

            return res.status(201).json({
                message: "EcoPonto criado com sucesso!", ecoponto: novoEcoponto
            });

        } catch (error) {
            console.error("Erro ao criar ecoponto", error);
            return res.status(500).json({
                error: "Erro interno ao tentar cadastrar o ecoponto"
            });
        }

    }

    static async getEcopontos(req: Request, res: Response) {
        try {
            // Busca todos os ecopontos cadastrados no banco
            const ecopontos = await prisma.ecoponto.findMany({
                orderBy: {
                    criadoEm: 'desc' // ordena dos mais recentes para os mais antigos
                },
                include: {
                    lixeiras: true // lixeiras vinculadas a cada ecoponto
                }
            });

            return res.status(200).json(ecopontos);
        }
        catch (error) {
            console.error("Erro ao buscar EcoPontos", error);
            return res.status(500).json({ error: "Erro interno ao tentar buscar os ecopontos" });
        }
    }
}