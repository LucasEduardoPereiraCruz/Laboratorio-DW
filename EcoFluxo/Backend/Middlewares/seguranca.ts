import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export interface UsuarioPayload {
    id: number;
    nome: string;
    email: string;
    perfil: "MORADOR" | "GESTOR";
}

export interface AuthRequest extends Request {
    user?: UsuarioPayload;
}

// Autenticação
export const autenticacaoToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({ message: "Acesso Negado" }); // Correção de status HTTP (401 Unauthorized é o padrão)
    }

    // Garante que o TypeScript sabe que o secret existe e impede erros de compilação
    if (!JWT_SECRET) {
        return res.status(500).json({ message: "Erro interno: JWT_SECRET não configurado" });
    }

    try {
        // Solução para o erro do TypeScript: passar por `unknown` primeiro
        const decode = jwt.verify(token, JWT_SECRET) as unknown as UsuarioPayload;
        
        req.user = decode;
        next();
    } catch (error) {
        // Limpar dados do cookie
        res.clearCookie("jwt");
        return res.status(403).json({ message: "Acesso Negado", error });
    }
};

// Verificar perfil do usuário
export const autorizacaoPerfil = (perfilPermitido: "MORADOR" | "GESTOR") => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        // Verificar se os dados do usuário estão ok
        if (!req.user) {
            return res.status(401).json({ message: "Não está autenticado" }); // 401 para não autenticado
        }
        if (req.user.perfil !== perfilPermitido) {
            return res.status(403).json({ message: "Acesso Negado" }); // 403 Forbidden é o mais adequado para permissão negada
        }
        next();
    };
};