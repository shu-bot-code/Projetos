// ======================
// VARIÁVEIS GLOBAIS
// ======================
const taskForm = document.getElementById('task-form');
const taskTitle = document.getElementById('task-title');
const taskDesc = document.getElementById('task-desc');
const taskDate = document.getElementById('task-date');
const taskResp = document.getElementById('task-responsible');

const filterStatus = document.getElementById('filter-status');
const searchInput = document.getElementById('search-input');

const pendingTasks = document.getElementById('pending-tasks');
const doingTasks = document.getElementById('doing-tasks');
const doneTasks = document.getElementById('done-tasks');

const modalOverlay = document.getElementById('modal-overlay');
const editModal = document.getElementById('edit-modal');
const editForm = document.getElementById('edit-form');
const editTitle = document.getElementById('edit-title');
const editDesc = document.getElementById('edit-desc');
const editDate = document.getElementById('edit-date');
const editResp = document.getElementById('edit-responsible');
const cancelEdit = document.getElementById('cancel-edit');

const logOverlay = document.getElementById('log-overlay');
const logModal = document.getElementById('log-modal');
const logList = document.getElementById('log-list');
const showLogBtn = document.getElementById('show-log');
const closeLogBtn = document.getElementById('close-log');

const enableNotBtn = document.getElementById('enable-notifications');

// Em edição
let editTaskId = null;

// ======================
// EVENTOS INICIAIS
// ======================
document.addEventListener('DOMContentLoaded', () => {
  loadTasksFromStorage();
  loadLogFromStorage();
  setupDragAndDrop();
  checkDeadlinesPeriodically();
});

taskForm.addEventListener('submit', addTask);
filterStatus.addEventListener('change', applyFilterAndSearch);
searchInput.addEventListener('input', applyFilterAndSearch);

editForm.addEventListener('submit', saveEdit);
cancelEdit.addEventListener('click', closeEditModal);

showLogBtn.addEventListener('click', () => {
  logOverlay.classList.add('show');
});
closeLogBtn.addEventListener('click', () => {
  logOverlay.classList.remove('show');
});

enableNotBtn.addEventListener('click', requestNotificationPermission);


// ======================
// ESTRUTURA DE DADOS
// ======================
/**
 * Cada tarefa: {
 *   id: string,
 *   title: string,
 *   desc: string,
 *   date: string (YYYY-MM-DD),
 *   responsible: string,
 *   status: 'pending' | 'doing' | 'done',
 *   createdAt: number (timestamp)
 * }
 */

// ======================
// FUNÇÕES PRINCIPAIS
// ======================

function addTask(e) {
  e.preventDefault();
  const title = taskTitle.value.trim();
  if (!title) return;

  const desc = taskDesc.value.trim();
  const date = taskDate.value;
  const responsible = taskResp.value.trim();

  const newTask = {
    id: Date.now().toString(),
    title,
    desc,
    date,
    responsible,
    status: 'pending',
    createdAt: Date.now()
  };

  // Salva no localStorage
  const tasks = getTasksFromStorage();
  tasks.push(newTask);
  localStorage.setItem('tasks', JSON.stringify(tasks));

  // Cria no DOM
  createTaskElement(newTask);

  // Log
  addToLog(`Tarefa criada: "${title}"`);

  // Limpa form
  taskTitle.value = '';
  taskDesc.value = '';
  taskDate.value = '';
  taskResp.value = '';

  applyFilterAndSearch(); // Atualiza a exibição
}

/**
 * Carrega as tarefas do storage e exibe no DOM.
 */
function loadTasksFromStorage() {
  const tasks = getTasksFromStorage();
  tasks.forEach(t => createTaskElement(t));
}

/**
 * Cria o elemento visual da tarefa na coluna correspondente.
 */
function createTaskElement(task) {
  const li = document.createElement('li');
  li.draggable = true;
  li.id = task.id;

  const headerDiv = document.createElement('div');
  headerDiv.classList.add('task-header');
  headerDiv.textContent = task.title;

  const bodyDiv = document.createElement('div');
  bodyDiv.textContent = task.desc || '';

  const footerDiv = document.createElement('div');
  footerDiv.classList.add('task-footer');

  const dateDisplay = task.date ? formatDate(task.date) : 'Sem data';
  footerDiv.innerHTML = `
    <span>${dateDisplay}</span>
    <span>${task.responsible || 'Ninguém'}</span>
  `;

  // Ações
  const actionsDiv = document.createElement('div');
  actionsDiv.classList.add('task-actions');

  const editBtn = document.createElement('button');
  editBtn.classList.add('action-btn', 'edit-btn');
  editBtn.textContent = 'Editar';
  editBtn.addEventListener('click', () => openEditModal(task.id));

  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('action-btn', 'delete-btn');
  deleteBtn.textContent = 'Excluir';
  deleteBtn.addEventListener('click', () => deleteTask(task.id));

  actionsDiv.appendChild(editBtn);
  actionsDiv.appendChild(deleteBtn);

  li.appendChild(headerDiv);
  li.appendChild(bodyDiv);
  li.appendChild(footerDiv);
  li.appendChild(actionsDiv);

  // Adiciona na coluna certa
  if (task.status === 'pending') {
    pendingTasks.appendChild(li);
  } else if (task.status === 'doing') {
    doingTasks.appendChild(li);
  } else {
    doneTasks.appendChild(li);
  }

  // Drag e Drop
  li.addEventListener('dragstart', handleDragStart);
  li.addEventListener('dragend', handleDragEnd);
}

/**
 * Abre modal de edição e carrega valores.
 */
function openEditModal(taskId) {
  editTaskId = taskId;
  const tasks = getTasksFromStorage();
  const t = tasks.find(tsk => tsk.id === taskId);
  if (!t) return;

  editTitle.value = t.title;
  editDesc.value = t.desc;
  editDate.value = t.date || '';
  editResp.value = t.responsible || '';

  modalOverlay.classList.add('show');
}

/**
 * Fecha modal de edição.
 */
function closeEditModal() {
  editTaskId = null;
  modalOverlay.classList.remove('show');
}

/**
 * Salva as edições no localStorage e no DOM.
 */
function saveEdit(e) {
  e.preventDefault();
  if (!editTaskId) return;

  const tasks = getTasksFromStorage();
  const index = tasks.findIndex(t => t.id === editTaskId);
  if (index === -1) return;

  tasks[index].title = editTitle.value.trim();
  tasks[index].desc = editDesc.value.trim();
  tasks[index].date = editDate.value;
  tasks[index].responsible = editResp.value.trim();

  localStorage.setItem('tasks', JSON.stringify(tasks));

  addToLog(`Tarefa editada: "${tasks[index].title}"`);
  refreshTasks();
  closeEditModal();
}

/**
 * Exclui uma tarefa.
 */
function deleteTask(taskId) {
  const tasks = getTasksFromStorage();
  const index = tasks.findIndex(t => t.id === taskId);
  if (index === -1) return;

  addToLog(`Tarefa excluída: "${tasks[index].title}"`);
  tasks.splice(index, 1);
  localStorage.setItem('tasks', JSON.stringify(tasks));

  refreshTasks();
}

/**
 * Atualiza o DOM inteiro (remove tudo e recria), aplicando filtro e busca.
 */
function refreshTasks() {
  pendingTasks.innerHTML = '';
  doingTasks.innerHTML = '';
  doneTasks.innerHTML = '';
  loadTasksFromStorage();
  applyFilterAndSearch();
  setupDragAndDrop();
}

/**
 * Aplica filtros (status) e busca (texto).
 */
function applyFilterAndSearch() {
  const fStatus = filterStatus.value;
  const text = searchInput.value.toLowerCase();

  const allTasksLi = document.querySelectorAll('.task-list li');
  allTasksLi.forEach(li => {
    const tasks = getTasksFromStorage();
    const t = tasks.find(tt => tt.id === li.id);
    if (!t) return;

    // Filtro por status
    let displayByFilter = true;
    if (fStatus !== 'all' && t.status !== fStatus) {
      displayByFilter = false;
    }

    // Filtro por texto
    let displayBySearch = true;
    const combinedText = (t.title + ' ' + t.desc + ' ' + (t.responsible||'')).toLowerCase();
    if (!combinedText.includes(text)) {
      displayBySearch = false;
    }

    if (displayByFilter && displayBySearch) {
      li.style.display = 'flex';
    } else {
      li.style.display = 'none';
    }
  });
}

/**
 * Requisita permissão de notificações ao usuário.
 */
function requestNotificationPermission() {
  if (!('Notification' in window)) {
    alert('Notificações não suportadas neste navegador.');
    return;
  }
  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      alert('Notificações ativadas!');
    } else {
      alert('Você negou ou não concedeu permissão de notificações.');
    }
  });
}

/**
 * Checa periodicamente as tarefas quanto ao prazo.
 */
function checkDeadlinesPeriodically() {
  setInterval(() => {
    const tasks = getTasksFromStorage();
    const now = new Date().getTime();
    tasks.forEach(t => {
      if (t.date) {
        const taskTime = new Date(t.date).getTime();
        // Exemplo simples: se faltar menos de 24h e a tarefa não estiver done, notifica
        if (taskTime - now < 24 * 60 * 60 * 1000 && t.status !== 'done') {
          showDeadlineNotification(t);
        }
      }
    });
  }, 60 * 60 * 1000); // Checa a cada 1 hora (exemplo)
}

/**
 * Exibe uma notificação sobre a tarefa.
 */
function showDeadlineNotification(task) {
  if (Notification.permission === 'granted') {
    new Notification('Tarefa Próxima do Vencimento', {
      body: `"${task.title}" vence em breve!`,
      icon: ''
    });
  }
}


/**
 * Log de alterações: armazena no localStorage e exibe em "Ver Log".
 */
function addToLog(message) {
  const logData = getLogFromStorage();
  const timestamp = new Date().toLocaleString('pt-BR');
  logData.push(`[${timestamp}] ${message}`);
  localStorage.setItem('taskLog', JSON.stringify(logData));

  // Se o modal do log estiver aberto, atualiza a lista
  if (logOverlay.classList.contains('show')) {
    renderLogList();
  }
}

/**
 * Carrega e exibe o log.
 */
function loadLogFromStorage() {
  renderLogList();
}

function renderLogList() {
  logList.innerHTML = '';
  const logData = getLogFromStorage();
  logData.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    logList.appendChild(li);
  });
}

/**
 * Pega o log atual do localStorage.
 */
function getLogFromStorage() {
  return JSON.parse(localStorage.getItem('taskLog')) || [];
}


// ======================
// DRAG AND DROP
// ======================
function setupDragAndDrop() {
  const columns = document.querySelectorAll('.kanban-column');
  columns.forEach(col => {
    col.addEventListener('dragover', handleDragOver);
    col.addEventListener('drop', handleDrop);
  });
}

function handleDragStart(e) {
  e.dataTransfer.setData('text/plain', e.target.id);
}

function handleDragEnd() {
  // Nada especial aqui
}

function handleDragOver(e) {
  e.preventDefault();
}

function handleDrop(e) {
  e.preventDefault();
  const id = e.dataTransfer.getData('text/plain');
  const li = document.getElementById(id);
  const newStatus = this.getAttribute('data-status');

  this.querySelector('.task-list').appendChild(li);
  
  // Atualiza no storage
  const tasks = getTasksFromStorage();
  const index = tasks.findIndex(t => t.id === id);
  if (index !== -1) {
    tasks[index].status = newStatus;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    addToLog(`Mudou status de "${tasks[index].title}" para "${newStatus}"`);
  }

  applyFilterAndSearch();
}


// ======================
// FUNÇÕES DE APOIO
// ======================

/**
 * Retorna array de tarefas do LocalStorage.
 */
function getTasksFromStorage() {
  return JSON.parse(localStorage.getItem('tasks')) || [];
}

/**
 * Formata data de (YYYY-MM-DD) para (DD/MM/YYYY).
 */
function formatDate(yyyyMMdd) {
  if (!yyyyMMdd) return '';
  const [y,m,d] = yyyyMMdd.split('-');
  return `${d}/${m}/${y}`;
}
if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('sw.js')
      .then(() => console.log('Service Worker registrado!'))
      .catch(err => console.log('SW fail:', err));
  }
  
// ================================
// CONFIGURAÇÕES DA API
// ================================

// GOOGLE CALENDAR CONFIGURAÇÃO
const GOOGLE_API_KEY = 'SUA_GOOGLE_API_KEY'; // Substitua pela sua chave de API do Google
const GOOGLE_CLIENT_ID = 'SEU_GOOGLE_CLIENT_ID'; // Substitua pelo seu Client ID do Google
const GOOGLE_DISCOVERY_DOCS = [
  'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'
];
const GOOGLE_SCOPES = 'https://www.googleapis.com/auth/calendar.events';

// TRELLO CONFIGURAÇÃO
const TRELLO_API_KEY = 'SUA_TRELLO_API_KEY'; // Substitua pela sua chave de API do Trello
const TRELLO_TOKEN = 'SEU_TRELLO_TOKEN'; // Substitua pelo seu token do Trello
const TRELLO_BOARD_ID = 'SEU_BOARD_ID'; // Substitua pelo ID do quadro onde deseja criar os cartões

// ================================
// FUNÇÕES DE SINCRONIZAÇÃO
// ================================

// Carregar a biblioteca do Google Client
function loadGoogleClient() {
  gapi.load('client:auth2', () => {
    gapi.client.init({
      apiKey: GOOGLE_API_KEY,
      clientId: GOOGLE_CLIENT_ID,
      discoveryDocs: GOOGLE_DISCOVERY_DOCS,
      scope: GOOGLE_SCOPES,
    }).then(() => {
      console.log('Google Client carregado');
    });
  });
}

// Autenticar usuário no Google
function authenticateGoogleUser() {
  return gapi.auth2.getAuthInstance().signIn();
}

// Adicionar evento no Google Calendar
function addEventToGoogleCalendar(task) {
  const event = {
    summary: task.title,
    description: task.desc || '',
    start: {
      dateTime: task.date + 'T09:00:00-03:00',
      timeZone: 'America/Sao_Paulo',
    },
    end: {
      dateTime: task.date + 'T10:00:00-03:00',
      timeZone: 'America/Sao_Paulo',
    },
  };

  gapi.client.calendar.events.insert({
    calendarId: 'primary',
    resource: event,
  }).then(response => {
    console.log(`Evento criado no Google Calendar! ID do evento: ${response.result.id}`);
    alert(`Evento "${task.title}" sincronizado com o Google Calendar!`);
  }).catch(error => {
    console.error('Erro ao criar evento:', error);
    alert('Erro ao sincronizar com o Google Calendar.');
  });
}

// Atualizar evento no Google Calendar
function updateEventInGoogleCalendar(eventId, updatedTask) {
  const updatedEvent = {
    summary: updatedTask.title,
    description: updatedTask.desc || '',
    start: {
      dateTime: updatedTask.date + 'T09:00:00-03:00',
      timeZone: 'America/Sao_Paulo',
    },
    end: {
      dateTime: updatedTask.date + 'T10:00:00-03:00',
      timeZone: 'America/Sao_Paulo',
    },
  };

  gapi.client.calendar.events.update({
    calendarId: 'primary',
    eventId,
    resource: updatedEvent,
  }).then(response => {
    console.log(`Evento atualizado no Google Calendar! ID do evento: ${response.result.id}`);
  }).catch(error => {
    console.error('Erro ao atualizar evento:', error);
  });
}

// Criar cartão no Trello
function addCardToTrello(task) {
  const url = `https://api.trello.com/1/cards?key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`;
  
  const data = {
    idList: TRELLO_BOARD_ID,
    name: task.title,
    desc: `Descrição:\n${task.desc || ''}\n\nResponsável:\n${task.responsible || 'N/A'}`,
    due: task.date || null,
  };

  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
    .then(response => response.json())
    .then(result => {
      console.log(`Cartão criado no Trello! ID do cartão: ${result.id}`);
      alert(`Cartão "${task.title}" sincronizado com o Trello!`);
    })
    .catch(error => {
      console.error('Erro ao criar cartão:', error);
      alert('Erro ao sincronizar com o Trello.');
    });
}

// Atualizar cartão no Trello
function updateCardInTrello(cardId, updatedTask) {
  const url = `https://api.trello.com/1/cards/${cardId}?key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`;

  const data = {
    name: updatedTask.title,
    desc: `Descrição:\n${updatedTask.desc || ''}\n\nResponsável:\n${updatedTask.responsible || 'N/A'}`,
    due: updatedTask.date || null,
  };

  fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
    .then(response => response.json())
    .then(result => {
      console.log(`Cartão atualizado no Trello! ID do cartão atualizado.`);
      alert(`Cartão "${updatedTask.title}" foi atualizado.`);
    })
    .catch(error => {
      console.error('Erro ao atualizar cartão:', error);
      alert('Erro ao atualizar cartão no Trello.');
    });
}

// ================================
// SINCRONIZAÇÃO BIDIRECIONAL
// ================================

// Sincronizar todas as tarefas pendentes com o Google Calendar e Trello
document.getElementById('sync-google-calendar').addEventListener('click', () => {
  const tasks = getTasksFromStorage().filter(task => task.status === 'pending');
  
  authenticateGoogleUser().then(() => {
    tasks.forEach(task => addEventToGoogleCalendar(task));
  }).catch(error => {
    console.error('Erro na autenticação do Google:', error);
  });
});

document.getElementById('sync-trello').addEventListener('click', () => {
  const tasks = getTasksFromStorage().filter(task => task.status === 'pending');
  
  tasks.forEach(task => addCardToTrello(task));
});
