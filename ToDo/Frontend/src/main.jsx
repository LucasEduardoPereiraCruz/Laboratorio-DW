// IMPORTAÇÕES DE BIBLIOTECAS E ARQUIVOS 

// strictMode: Uma ferramenta de desenvolvimento do React que ajuda a identificar potenciais problemas ou 
// códigos obsoletos no aplicativo (roda verificações extras apenas em ambiente de desenvolvimento).
import { StrictMode } from 'react' // A nova forma do React (a partir da versão 18) para inicializar e renderizar a aplicação na árvore de elementos do DOM.
import { createRoot } from 'react-dom/client'
import './index.css' // Importa a folha de estilos global do projeto (onde geralmente o Tailwind CSS é injetado).
import App from './App.jsx' // Importa o componente principal da aplicação, que agrupa todas as telas, rotas e componentes filhos.
import { BrowserRouter } from 'react-router-dom'; // Componente do React Router que habilita o sistema de rotas no navegador (permite navegar entre páginas/URLs sem recarregar a página inteira).

// RENDERIZAÇÃO DA APLICAÇÃO NO DOM 
createRoot(document.getElementById('root')).render( // Procura no seu arquivo index.html a tag que possui o ID root (geralmente uma div). É ali dentro que todo o seu site React vai viver.
  <StrictMode> 
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
