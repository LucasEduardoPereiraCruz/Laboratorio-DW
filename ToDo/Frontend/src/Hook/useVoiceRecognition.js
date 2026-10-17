import {useState, useEffect, useRef} from "react"; 
// Função tratar conversões data falada 
function interpretarDataVoz(texto){
    const fala = texto.toLowerCase().trim(); 
    const hoje = new Date()
    // Se falar "hoje", pega a data de hoje
    if(fala.includes("hoje")){
        return hoje.toISOString().split("T")[0] //Pega só indice 0, que é somente a data
    }

    // Se falar "amanhã", soma 1 dia à data atual
    if(fala.includes("amanhã") || fala.includes("amanha")){
        const amanha = new Date(); 
        amanha.setDate(hoje.getDate()+1); 
        return amanha.toISOString().split("T")[0]; 
    }

    // Se falar "depois de amanhã", soma 2 dias
    if(fala.includes("depois de amanhã") || fala.includes("depois de amanhã")){
        const depoisAmanha = new Date(); 
        depoisAmanha.setDate(hoje.getDate()+2); 
        return depoisAmanha.toISOString().split("T")[0]; 
    }

    // Usa Regex para capturar frases como "daqui a 5 dias"
    const matchDias = fala.match(/daqui a (\d+) dias/); 
    if(matchDias){
        const dias = parseInt(matchDias[1], 10); 
        const dataFutura = new Date();
        dataFutura.setDate(hoje.getDate() + dias)
        return depoisAmanha.toISOString().split("T")[0]; 
    }
    return ""; 
} // Fim da função 

export function useVoiceRecognition(){
    const [textoOuvido, setTextoOuvido] = useState(""); 
    const [ouvindo, setOuvindo] = useState("false"); // Indica se o microfone está ativo
    const [suportado, setSuportado] = useState("true");  // Indica se o navegador suporta reconhecimento de voz
    const recognitionRef = useRef(null) // Guarda a instância do reconhecedor de voz sem causar re-renderizações
    useEffect(()=>{
        // Verifica se a API está disponível no navegador 
        if(typeof window !== "undefined"){
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        }
        if(SpeechRecognition){
            const recognition = new SpeechRecognition(); 
            //microfone ficar contínuo 
            recognition.continuous = true; // Mantém a escuta contínua
            recognition.interimResults = true; // Retorna resultados parciais enquanto a pessoa fala
            recognition.lang = "pt-BR" // Define o idioma 
            // Converte em texto após o áudio 
            recognition.onresult = (event) => {
                let transcricaoFinal = ""; 
                // Acumula todos os trechos da fala confirmados durante a sessão ativa 
                for(let i = event.resultIndex; i < event.result.length; i++){
                    if(event.results[i].isFinal){
                        transcricaoFinal += event.results[i][0].transcript + ""; 
                    }
                }
                if(transcricaoFinal){
                    setTextoOuvido(transcricaoFinal.trim()); 
                }
            };
            // evento erro 
            recognition.onerror = (event) => {
                console.error("Erro no conhecimento de voz", event.error); 
                setOuvindo(false); 
            };
            // fim da fala
            recognition.onend = () =>{
                setOuvindo(false); // Reseta o estado quando a fala encerra
            };
            recognition.current = recognition; // Salva na ref
        }
        else
        {
            setSuportado(false); // Se o navegador não tiver a API
        }
    }, []); 
    // Inicia ou interrompe a gravação (liga/desliga)
    const iniciarEscuta = ()=>{
        if(!recognitionRef.current) return; 
        if(ouvindo){
            // se já estiver ouvindo o click manual encerra a gravação 
            recognitionRef.current.stop(); // Se já estiver ouvindo, para
            setOuvindo(false); 
        }
        else 
        {
            // limpa textos e inicia a escuta 
            setTextoOuvido(""); 
            setOuvindo(true)
            recognitionRef.current.start(); // Inicia a gravação
        }
    }; 
    // Função para parar gravação manualmente 
    const pararEscuta = ()=>{
        if(recognitionRef.current && ouvindo){
            recognitionRef.current.stop(); 
            setOuvindo(false); 
        }
    }; 
    // Processar a frase capturada e atualiza o estado correspondente baseado na palavra-chave
    const processarComandoVoz = (
        fala, 
        setTitulo,
        setDescricao, 
        setDataLimite, 
        usuarios = [], 
        handleCheckBoxChange)=>{
            // expressões 
            const regexTitulo = /(?:título|titulo)\s+(.+)/i;
            const regexDescricao = /(?:descrição|descricao)\s+(.+)/i;
            const regexData = /(?:data|data limite|prazo)\s+(.+)/i;
            const regexParticipante = /(?:participante|participantes|adicionar|incluir)\s+(.+)/i;
            // comando do participante 
            const matchParticipante = fala.match(regexParticipante);
            if(matchParticipante && matchParticipante[1] && handleCheckChange){
                const nomeFalado = matchParticipante[1].trim.toLowerCase(); 
                // Buscar na lista de usuários um nome equivalente ao que foi falado 
                const usuarioEncontrado = usuarios.find(u =>u.nome.toLowerCase().includes(nomeFalado))
                if(usuarioEncontrado){
                    const id = usuarioEncontrado._id || usuarioEncontrado.id;
                    handleCheckBoxChange(id); // Marca o usuário na lista
                } else {
                    console.warn("Usuário não encontrado na lista", nomeFalado);
                }
                return;
            }
            // Comando de TÍTULO
            const matchTitulo = fala.match(regexTitulo); 
            if(matchTitulo && matchTitulo[1]){
                setTitulo(matchTitulo[1].trim()); 
                return; 
            }
            // Comando de DESCRIÇÃO
            const matchDescricao = fala.match(regexDescricao); 
            if(matchDescricao && matchDescricao[1]){
                setDescricao(matchDescricao[1].trim()); 
                return; 
            }
            // Comando de DATA
            const matchData = fala.match(regexData); 
            if(matchData && matchData[1]){
                const dataFormatada = interpretarDataVoz(matchData[1]);
                if(dataFormatada){
                    setDataLimite(dataFormatada); 
                    
                }
                return; 
            }
            // Não deu nenhum match 
        };

        //Expõe todas essas variáveis e funções para que qualquer página ou componente do React possa chamar o microfone e 
        // interpretar os comandos de voz facilmente.
        return{
            textoOuvido, 
            setTextoOuvido, 
            ouvindo, 
            iniciarEscuta, 
            pararEscuta, 
            processarComandoVoz, 
            suportado
        } 
}