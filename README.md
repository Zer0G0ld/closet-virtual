# 👗 Closet Virtual

O **Closet Virtual** é um aplicativo mobile desenvolvido em React Native (com Expo) que funciona como um armário digital. A proposta é permitir que o usuário tire fotos de suas peças de roupa, cadastre informações detalhadas (cor, marca, tamanho, etc.) e tenha um catálogo visual do que possui. 

Com o armário digitalizado, o app é capaz de gerar combinações de looks (de forma aleatória ou manual), ajudando o usuário a usar 100% do seu guarda-roupa, além de gerenciar o descarte consciente de peças que não são mais utilizadas.

## ✨ Funcionalidades Principais

* **Armário Digital:** Cadastro de roupas com foto (via câmera ou galeria), nome, categoria (parte superior, inferior, calçado, acessório), cor, marca, modelo, material, tamanho e preço.
* **Filtros e Busca:** Encontre peças rapidamente filtrando por categoria ou buscando pelo nome.
* **Montagem de Looks:**
  * **Modo Aleatório:** O app escolhe uma peça de cada categoria essencial e tenta combinar as cores.
  * **Modo Manual:** O usuário seleciona as peças na tela inicial (long press) e monta o próprio look.
* **Cutscene de Criação:** Uma animação amigável enquanto o app "pensa" e monta o look.
* **Perfil e Histórico:** O usuário pode personalizar seu perfil (avatar e nome) e salvar os looks que gostou para repetir no futuro.
* **Descarte Consciente:** Exclusão de peças com a opção de registrar o motivo (doação, venda, desgaste, etc.), gerando um histórico útil para futuras compras.
* **Armazenamento Local:** Todos os dados (roupas, looks, perfil) são salvos no próprio dispositivo usando `AsyncStorage`.

## 🏗️ Arquitetura do Projeto

O projeto foi estruturado pensando na separação de responsabilidades e facilidade de manutenção.

```text
closet-virtual/
├── assets/                 # Ícones, splash screen e imagens estáticas
├── src/
│   ├── components/         # Componentes reutilizáveis
│   │   └── ModalMotivo.tsx # Modal de seleção de motivo de descarte
│   ├── screens/            # Telas do aplicativo
│   │   ├── AdicionarRoupa.tsx  # Formulário de cadastro/edição de peça
│   │   ├── DetalhesRoupa.tsx   # Visualização dos detalhes da peça
│   │   ├── ExcluirRoupa.tsx    # Tela de confirmação de exclusão
│   │   ├── MeusLooks.tsx       # Histórico de looks salvos
│   │   ├── MontandoLook.tsx    # Tela de carregamento (cutscene)
│   │   ├── Perfil.tsx          # Edição de perfil do usuário
│   │   └── ResultadoLook.tsx   # Exibição do look gerado
│   └── types/              # Tipagens TypeScript
│       ├── Perfil.ts       # Interface do Perfil do usuário
│       └── Roupa.ts        # Interface da Peça de Roupa
├── App.tsx                 # Componente raiz, roteamento de estado e lógica de negócios
├── app.json                # Configurações do Expo
├── eas.json                # Configurações de build (EAS)
└── package.json            # Dependências do projeto
```

### 🧠 Decisões Técnicas
* **Gerenciamento de Estado Centralizado:** O `App.tsx` atua como o "cérebro" do app. Em vez de usar uma biblioteca de navegação complexa (como React Navigation) para um app deste tamanho, foi utilizada uma máquina de estados simples (`type Tela`) para alternar entre as telas.
* **Persistência de Dados:** Uso do `@react-native-async-storage/async-storage` para garantir que os dados não sejam perdidos ao fechar o app.
* **Estilização:** `StyleSheet` nativo do React Native para garantir performance e compatibilidade.
* **Ícones:** Uso do pacote `@react-native-vector-icons/ionicons` para uma interface limpa e profissional.

## 🚀 Como Rodar o Projeto

### Pré-requisitos
* [Node.js](https://nodejs.org/) instalado.
* Aplicativo [Expo Go](https://expo.dev/client) instalado no seu celular (para testes rápidos).
* Git (opcional, mas recomendado).

### Passo a Passo (Ambiente Windows / PowerShell)

1. **Clone o repositório:**
   ```powershell
   git clone https://github.com/Zer0G0ld/closet-virtual.git
   cd closet-virtual
   ```

2. **Instale as dependências:**
   ```powershell
   npm install
   ```

3. **Inicie o servidor do Expo:**
   ```powershell
   npx expo start
   ```

4. **Abra no celular:**
   * Escaneie o QR Code que aparecerá no terminal usando o app **Expo Go** (Android) ou a câmera (iOS).
   * *Nota: Certifique-se de que o celular e o computador estão na mesma rede Wi-Fi.*

## 📱 Como gerar o APK (Build)

Para gerar um arquivo `.apk` instalável e compartilhar com outras pessoas, o projeto usa o **EAS Build**.

1. Instale a CLI do EAS globalmente:
   ```powershell
   npm install -g eas-cli
   ```
2. Faça login na sua conta Expo:
   ```powershell
   eas login
   ```
3. Rode o build para a plataforma Android usando o perfil de preview (configurado no `eas.json` para gerar APK):
   ```powershell
   eas build -p android --profile preview
   ```
4. Ao finalizar, o terminal fornecerá um link para baixar o `.apk` diretamente no celular.

## 🔮 Próximos Passos (Roadmap)

* [ ] Implementar autenticação (Login com Google) para sincronização em nuvem.
* [ ] Adicionar sugestões de looks baseadas no clima do dia.
* [ ] Criar uma aba de "Estatísticas" (ex: quanto foi gasto no guarda-roupa, peças mais usadas).
* [ ] Implementar IA para reconhecimento automático de peças (cor, tipo) ao tirar a foto.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---
Desenvolvido com 💙 e React Native.
