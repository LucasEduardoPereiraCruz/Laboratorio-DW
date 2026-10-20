// ESTE ARQUIVO UTILIZADA A BIBLIOTECA SWAGGER-AUTOGEN PARA LER AUTOMATICAMENTE AS ROTAS
// E OS ARQUIVOS DO SEU BACKEND E GERAR UM ARQUIVO JSON COM A DOCUMENTAÇÃO INTERATIVA DA API (GERALMENTE USADA EM TESTES NO SWAGGER UI)

import swaggerAutogen from "swagger-autogen";
const doc = {
    info:{
        title: 'API ToDo List', // Nome do projeto exibido no topo da página do swagger
        description: 'Documentação para a geração automática dos testes' // Um breve resumo do propósito da doc. 
    },
    host: 'localhost:5000', // O endereço e a porta onde o servidor backend roda
    basePath: '/ToDo', // O prefixo padrão de todas as rotas da API
}

//nome do arquivo que será gerado automaticamente
const outputFile = './swagger-output.json'; // O destino onde o Swagger vai salvar o arquivo .json estruturado com todas as rotas mapeadas.

//caminho para as rotas
// A lista de arquivos de rotas que o gerador deve varrer. Ele lê esses arquivos para descobrir 
// quais endpoints existem (como /login, /getAll, etc.).
const endpointsFiles = [
  './Routes/routesUsuario.js',
  './Routes/routesTarefa.js'
];

// Ela pega as regras do seu projeto (objeto doc), lê os arquivos de rotas que você indicou (endpointsFiles) 
// e cria/atualiza o arquivo de saída (outputFile) com a documentação pronta em JSON.
swaggerAutogen()(outputFile, endpointsFiles, doc);