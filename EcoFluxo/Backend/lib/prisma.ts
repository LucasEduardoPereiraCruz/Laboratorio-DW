import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// Configura a conexão com o MySQL do XAMPP
const adapter = new PrismaMariaDb({
  host: "localhost",
  port: 3306,
  user: "root",       // Usuário padrão do XAMPP
  password: "",       // Senha padrão do XAMPP (geralmente vazia)
  database: "ecofluxo" // Coloque o nome exato do banco de dados que você criou no phpMyAdmin
});

const prisma = new PrismaClient({ adapter });

export default prisma;