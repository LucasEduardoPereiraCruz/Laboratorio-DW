import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "sua_chave_secreta_super_segura";

export interface UsuarioPayload {
    id: number;
    nome: string;
    email: string;
    role: "MORADOR" | "GESTOR";
}

export interface AuthRequest extends Request {
    user?: UsuarioPayload;
}

export const autenticacaoToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    // Aceita o token pelo header Authorization (Bearer) ou pelo cookie "token"
    const authHeader = req.headers.authorization;
    const tokenHeader = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : undefined;
    const token = tokenHeader || req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: "Não autenticado: token não enviado" });
    }

    try {
        const decode = jwt.verify(token, JWT_SECRET) as unknown as UsuarioPayload;
        req.user = decode;
        next();
    } catch (error) {
        res.clearCookie("token");
        return res.status(401).json({ message: "Token inválido ou expirado" });
    }
};

export const autorizacaoPerfil = (perfilPermitido: "MORADOR" | "GESTOR") => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ message: "Não está autenticado" });
        }
        if (req.user.role !== perfilPermitido) {
            return res.status(403).json({ message: "Acesso negado: perfil sem permissão" });
        }
        next();
    };
};