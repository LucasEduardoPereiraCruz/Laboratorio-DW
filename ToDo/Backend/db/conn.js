// ARQUIVO RESPONSÁVEL POR ESTABELECER A CONEXÃO DA APLICAÇÃO COM O BANCO DE DADOS MONGODB USANDO A BIBLIOTECA MONGOOSE
import mongoose from "mongoose";
async function main(){
    //await mongoose.connect('mongodb://localhost:27017/ToDo');
    // Define databaseUrl buscando a variável de ambiente process.env.DATABASE_URL. 
    // Se não existir (ambiente local), usa o fallback 'mongodb://127.0.0.1:27017/ToDo'.
    const databaseUrl = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/ToDo';
    await mongoose.connect(databaseUrl); // Executa await mongoose.connect(databaseUrl) para abrir o túnel com o banco.
    console.log("Conectou MongoDb");
}

// Chama a função main(). 
// Se houver algum erro de conexão (ex: servidor MongoDB desligado), o .catch((err) => ...) captura e exibe no console.
main().catch((err)=>{
    console.log(err);
});

// Exporta o objeto mongoose pronto e conectado para ser utilizado pelos Schemas/Models da aplicação.
export default mongoose;