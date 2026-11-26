import prisma from "../lib/prisma.js";
import { hash, verify } from "@node-rs/argon2";
import type { Request, Response } from "express";
import { send2FACodeEmail } from "../Services/emailServices.js";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "sua_chave_secreta_super_segura";

export default class UsuarioController {
    static async Create(req: Request, res: Response) {
        try {
            const { } = req.body;
            //verificação dos dados obrigatórios

            //inserir no banco de dados
        } catch (error) {

        }
    };

    static async Login(req: Request, res: Response) {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(404).json({ message: "E-mail e senha são obrigatórios" });
        }

        try {
            const usuario = await prisma.usuario.findUnique({
                where: { email }
            });
            if (!usuario) {
                return res.status(404).json({ message: "Verifique as credenciais" });
            }

            const senhaCorreta = await verify(usuario.senha, senha);
            if (!senhaCorreta) {
                return res.status(404).json({ message: "Verifique as credenciais" });
            }

            const codigoFA = Math.floor(100000 + Math.random() * 900000).toString();
            const expiracao = new Date(Date.now() + 10 * 60 * 1000);

            await prisma.usuario.update({
                where: { id: usuario.id },
                data: {
                    loginCode: codigoFA,
                    loginCodeExpires: expiracao
                }
            });

            console.log("==================================================");
            console.log(`CÓDIGO 2FA PARA O USUÁRIO ${usuario.email}: ${codigoFA}`);
            console.log("==================================================");

            // await send2FACodeEmail(usuario.email, codigoFA);
            return res.status(200).json({
                require2FA: true,
                message: "Código de verificação enviado para o seu e-mail",
                email: usuario.email
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Problema interno - login" });
        }
    };

    static async Logout(req: Request, res: Response) {
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: 'lax'
        });
        return res.status(200).json({ message: "Logout com sucesso" });
    };

    static async Verify2FA(req: Request, res: Response) {
        const { email, codigo } = req.body;

        if (!email || !codigo) {
            return res.status(400).json({ message: "E-mail e código são obrigatórios." });
        }

        try {
            const usuario = await prisma.usuario.findUnique({ where: { email } });

            if (!usuario || !usuario.loginCode || !usuario.loginCodeExpires) {
                return res.status(400).json({ message: "Código inválido ou não solicitado." });
            }

            if (new Date() > usuario.loginCodeExpires) {
                return res.status(400).json({ message: "O código de verificação expirou. Solicite um novo." });
            }

            if (usuario.loginCode !== codigo) {
                return res.status(400).json({ message: "Código de verificação incorreto." });
            }

            await prisma.usuario.update({
                where: { id: usuario.id },
                data: {
                    loginCode: null,
                    loginCodeExpires: null
                }
            });

            const tokenPayload = {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                role: usuario.perfil
            };

            const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "1h" });

            res.cookie("token", token, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: 3600000 // 1 hora
            });

            return res.status(200).json({
                message: 'Autenticação concluída com sucesso.',
                usuario: {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email,
                    role: usuario.perfil,
                },
                token: token
            });
        } catch (error) {
            console.log("Erro na verificação do 2FA", error);
            return res.status(500).json({ message: "Erro interno. Tente mais tarde." });
        }
    };

    static async Reset(req: Request, res: Response) {
        try {
            const { } = req.body;
        } catch (error) {

        }
    };

    static async forgotPassword(req: Request, res: Response) {
        try {
            const { } = req.body;
        } catch (error) {

        }
    };
}