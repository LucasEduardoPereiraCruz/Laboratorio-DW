import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
        title: 'API EcoFluxo',
        description: 'Documentação para testes das rotas de Ecopontos e Lixeiras'
    },
    host: 'localhost:5000',
    schemes: ['http']
};

const outputFile = './swagger-output.json';

const endpointsFiles = [
    './Routes/EcopontoRoutes.ts',
    './Routes/LixeirasRoutes.ts'
];

swaggerAutogen()(outputFile, endpointsFiles, doc);