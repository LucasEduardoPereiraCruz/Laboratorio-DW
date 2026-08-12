import Tarefa from "../Models/Tarefa.js";
import {Types} from "mongoose"; 
export default class TarefaController{
    static async Create(req, res){
        const{titulo, descricao, dataLimite, situacao} = req.body
        if(!titulo || !descricao || !dataLimite || !situacao) // Validação para ver se foram preenchidos oq é requerido
        {
            return res.status(422).json({message: "Todos os dados são obrigatórios"});
        }

        try
        {
            const tarefa = new Tarefa({
                titulo, 
                descricao, 
                dataLimite, 
                situacao
            });
            const novaTarefa = await tarefa.save();
            res.status(200).json({message: "Tarefa criada com sucesso", novaTarefa}); 
            return;
        } 
        catch (error)
        {
            return res.status(500).json({message: "Problema ao inserir tarefa", error});
        }

    } // fim create

    static async getAll(req, res){
        try
        {
            const tarefas = await Tarefa.find(); 
            return res.status(200).json({message: "Buscar tarefas com sucesso", tarefas});

        } 
        catch (error)
        {
            return res.status(500).json({message: "Erro ao buscar tarefas", error}); 
        }

    } // fim do getAll 

} // fim do export