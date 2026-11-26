import { Perfil } from "@prisma/client";
import { hash } from "@node-rs/argon2";
import prisma from "../lib/prisma.js";

async function main() {
  console.log("Iniciando o seed...");

  const emailGestor = "lucascruzjau@gmail.com";//substituir por um e-mail que você tenha acesso
  const senhaPura = "Gestor@123";//se achar necessário, troque por uma senha que queira.

  const usuarioExistente = await prisma.usuario.findUnique({
    where: { email: emailGestor },
  });

  if (usuarioExistente) {
    console.log("O usuário gestor já existe no banco de dados.");
    return;
  }

  const senhaHash = await hash(senhaPura);

  const gestor = await prisma.usuario.create({
    data: {
      nome: "Gestor EcoFluxo",
      email: emailGestor,
      senha: senhaHash,
      perfil: Perfil.GESTOR,
    },
  });

  console.log(`Gestor criado com sucesso! E-mail: ${gestor.email}`);
}

// Usuário Morador para testar o fluxo completo do enunciado
const emailMorador = "llucaseduardopereiradacruz@gmail.com";
const senhaMorador = "Morador@123";

const moradorExistente = await prisma.usuario.findUnique({
  where: { email: emailMorador },
});

if (!moradorExistente) {
  const senhaHashMorador = await hash(senhaMorador);
  const morador = await prisma.usuario.create({
    data: {
      nome: "Morador EcoFluxo",
      email: emailMorador,
      senha: senhaHashMorador,
      perfil: Perfil.MORADOR,
    },
  });
  console.log(`Morador criado com sucesso! E-mail: ${morador.email}`);
} else {
  console.log("O usuário morador já existe no banco de dados.");
}


main()
  .catch((e) => {
    console.error("Erro ao executar o seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });