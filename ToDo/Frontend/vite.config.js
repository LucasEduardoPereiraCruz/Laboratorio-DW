import { defineConfig } from 'vite' // Importa uma função utilitária do Vite que ajuda o seu editor de código (como o VS Code) a dar sugestões automáticas (autocomplete) enquanto você escreve as configurações.
import react from '@vitejs/plugin-react' // Importa o plugin oficial do REACT, que ensina o Vite a entender os arquivos JSX e compilar o react na tela 
import tailwindcss from "@tailwindcss/vite"; // Importa o plugin do Tailwind CSS, permitindo que você use classes utilitárias de estilização direto no seu projeto de forma otimizada.
// https://vite.dev/config/

// Ele exporta a configuração dizendo: "Vite, quando for rodar o projeto, ative o suporte ao React e ao Tailwind CSS para mim".
export default defineConfig({
  plugins: [react(),tailwindcss()],
})
