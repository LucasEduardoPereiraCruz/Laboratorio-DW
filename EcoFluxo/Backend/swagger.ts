import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'API EcoFluxo',
    version: '1.0.0',
    description: 'Documentação gerada automaticamente com swagger-autogen',
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Servidor Local',
    },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'token',
      },
    },
  },
};

// Caminho onde o arquivo JSON de saída será gerado
const outputFile = './swagger_output.json';

// Arquivos principais de rotas que o autogen deve ler para mapear os endpoints
const endpointsFiles = ['./index.ts'];

// Gera o arquivo de documentação automaticamente
swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc).then(() => {
  console.log('Documentação do Swagger gerada com sucesso!');
});