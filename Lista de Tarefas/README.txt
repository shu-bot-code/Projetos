# Lista de Tarefas - Kanban com Integrações

Uma aplicação web avançada para gerenciar tarefas, com suporte a **Kanban**, **arrastar e soltar**, e integrações com **Google Calendar** e **Trello**.  
Permite gerenciar tarefas de forma colaborativa, sincronizar eventos no Google Calendar e criar cartões no Trello.

## Funcionalidades

- **Adicionar Tarefas:** Crie novas tarefas com título, descrição, data de vencimento e responsável.
- **Editar Tarefas:** Altere os detalhes de uma tarefa existente.
- **Excluir Tarefas:** Remova tarefas que não são mais necessárias.
- **Marcar como Concluída:** Mova tarefas entre os estados *Pendentes*, *Em Progresso* e *Concluídas*.
- **Arrastar e Soltar (Drag and Drop):** Reorganize as tarefas entre colunas no estilo Kanban.
- **Filtragem Avançada:** Filtre tarefas por status (*Pendentes*, *Em Progresso*, *Concluídas*) ou busque por texto.
- **Histórico de Alterações:** Registre todas as ações realizadas (criação, edição, exclusão, etc.).
- **Notificações:** Receba alertas sobre tarefas próximas do prazo.
- **Modo Offline (PWA):** Acesse a aplicação mesmo sem conexão à internet.
- **Integração com Google Calendar:** Sincronize suas tarefas como eventos no Google Calendar.
- **Integração com Trello:** Crie cartões no Trello a partir das suas tarefas.

## Tecnologias Utilizadas

- **HTML5** para a estrutura da página.
- **CSS3** para o design responsivo e refinado.
- **JavaScript (ES6+)** para manipulação do DOM, lógica da aplicação e integrações com APIs externas.
- **Google Calendar API** para sincronizar eventos no calendário principal do usuário.
- **Trello API** para criar cartões em quadros específicos.

## Como Configurar e Executar

### 1. Configuração do Google Calendar
1. Acesse o [Google Cloud Console](https://console.cloud.google.com/).
2. Crie um novo projeto (ex.: "Lista de Tarefas").
3. Ative a API do Google Calendar:
   - Vá em "APIs e Serviços" > "Biblioteca".
   - Pesquise por "Google Calendar API" e ative-a.
4. Crie credenciais:
   - Vá em "APIs e Serviços" > "Credenciais".
   - Clique em "Criar Credenciais" > "ID do Cliente OAuth".
   - Configure uma tela de consentimento (preencha os campos obrigatórios).
   - Adicione `http://localhost` como origem autorizada.
   - Copie o `Client ID` e o `Client Secret`.
5. Crie uma chave de API:
   - Vá em "Criar Credenciais" > "Chave de API".
   - Copie a chave gerada.

### 2. Configuração do Trello
1. Acesse [https://trello.com/app-key](https://trello.com/app-key).
2. Copie sua chave da API (**API Key**) exibida na página.
3. Clique no link abaixo da chave para gerar um token (**Token**).
4. Autorize o acesso e copie o token gerado.

### 3. Configuração do Código
1. Substitua as variáveis no arquivo `script.js`:
const GOOGLE_API_KEY = 'SUA_GOOGLE_API_KEY';
const GOOGLE_CLIENT_ID = 'SEU_GOOGLE_CLIENT_ID';
const TRELLO_API_KEY = 'SUA_TRELLO_API_KEY';
const TRELLO_TOKEN = 'SEU_TRELLO_TOKEN';
const TRELLO_BOARD_ID = 'SEU_BOARD_ID'; // ID da lista onde deseja criar cartões
2. Salve as alterações.

### 4. Executando Localmente
1. Coloque todos os arquivos (`index.html`, `styles.css`, `script.js`) na mesma pasta.
2. Rode um servidor local (ex.: [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) no VSCode).
3. Abra o navegador em `http://localhost`.

---

## Como Usar

### Sincronizar com Google Calendar
1. Clique no botão "Sincronizar com Google Calendar".
2. Faça login na sua conta do Google (se solicitado).
3. Todas as tarefas pendentes serão adicionadas ao seu calendário principal como eventos.

### Sincronizar com Trello
1. Clique no botão "Sincronizar com Trello".
2. Certifique-se de que o ID do quadro foi configurado corretamente (`TRELLO_BOARD_ID`).
3. Todas as tarefas pendentes serão criadas como cartões na lista especificada.

---

## Estrutura de Arquivos

📂 Lista-de-Tarefas
├── index.html # Estrutura principal da página
├── styles.css # Estilos visuais (design refinado)
├── script.js # Lógica da aplicação e integrações com APIs
└── README.md # Documentação do projeto

---

## Possíveis Melhorias Futuras

1. Sincronização bidirecional com Google Calendar e Trello (atualizações automáticas).
2. Integração com outras ferramentas de produtividade, como Notion ou Slack.
3. Suporte a múltiplos usuários para colaboração em tempo real.
4. Adicionar notificações push mais avançadas usando [Push API](https://developer.mozilla.org/pt-BR/docs/Web/API/Push_API).

---

Desenvolvido para demonstrar boas práticas de integração com APIs externas, gerenciamento de estado local (*LocalStorage*) e design responsivo.

Contribuições são bem-vindas! 😊
