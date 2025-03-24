// Simulação de dados
let historias = [
    { id: 1, titulo: "Implementar Login", descricao: "Criar tela de login e fluxo de autenticação.", pontos: 5, prioridade: "alta", status: "doing" },
    { id: 2, titulo: "Criar Kanban", descricao: "Desenvolver a interface do Kanban com drag and drop.", pontos: 8, prioridade: "alta", status: "todo" },
    { id: 3, titulo: "Integração com API", descricao: "Integrar o frontend com a API do backend.", pontos: 13, prioridade: "media", status: "backlog" },
    { id: 4, titulo: "Testes unitários", descricao: "Escrever testes unitários para os componentes.", pontos: 3, prioridade: "baixa", status: "done" }
];

let sprints = [
    { id: 1, nome: "Sprint 1", meta: "Finalizar tela de login e Kanban.", inicio: "2024-10-26", fim: "2024-11-09", status: "Planejado" }
];

let tarefas = [
    { id: 1, descricao: "Criar componente de login", historiaId: 1, status: "doing" },
    { id: 2, descricao: "Implementar drag and drop no Kanban", historiaId: 2, status: "todo" },
    { id: 3, descricao: "Conectar API de autenticação", historiaId: 1, status: "doing" },
    { id: 4, descricao: "Escrever testes para o componente de login", historiaId: 1, status: "testing" },
    { id: 5, descricao: "Projetar layout do Kanban", historiaId: 2, status: "todo" },
    { id: 6, descricao: "Implementar lógica de drag and drop", historiaId: 2, status: "todo" },
    { id: 7, descricao: "Testar a integração da API", historiaId: 3, status: "backlog" },
    { id: 8, descricao: "Escrever testes unitários para a API", historiaId: 3, status: "backlog" },
    { id: 9, descricao: "Finalizar testes unitários do componente de login", historiaId: 4, status: "done" }
];

let dailyScrum = [];
let membrosTime = [];

let sprintAtual = sprints[0];

// Funções utilitárias
function atualizarElemento(id, conteudo) {
    const elemento = document.getElementById(id);
    if (elemento) {
        elemento.textContent = conteudo;
    }
}

function criarElemento(tag, texto) {
    const elemento = document.createElement(tag);
    if (texto) {
        elemento.textContent = texto;
    }
    return elemento;
}

function atualizarListaHistorias() {
    const listaHistorias = document.getElementById("lista-historias");
    listaHistorias.innerHTML = "";

    historias.forEach(historia => {
        const itemHistoria = criarElemento("li");
        itemHistoria.id = `historia-${historia.id}`;

        itemHistoria.appendChild(criarElemento("h4", historia.titulo));
        itemHistoria.appendChild(criarElemento("p", historia.descricao));
        itemHistoria.appendChild(criarElemento("p", `Pontos: ${historia.pontos}`));
        itemHistoria.appendChild(criarElemento("p", `Prioridade: ${historia.prioridade}`));
        itemHistoria.appendChild(criarElemento("p", `Status: ${historia.status}`));

        listaHistorias.appendChild(itemHistoria);
    });
}

function atualizarKanban() {
    const colunas = document.querySelectorAll("#kanban .column");
    colunas.forEach(coluna => {
        coluna.innerHTML = `<h3>${coluna.dataset.status}</h3>`;
        const tarefasFiltradas = tarefas.filter(tarefa => tarefa.status === coluna.id && tarefa.historiaId === sprintAtual.id);

        tarefasFiltradas.forEach(tarefa => {
            const elementoTarefa = document.createElement("div");
            elementoTarefa.textContent = tarefa.descricao;
            elementoTarefa.draggable = true;
            elementoTarefa.id = `tarefa-${tarefa.id}`;

            elementoTarefa.addEventListener("dragstart", (event) => {
                event.dataTransfer.setData("text/plain", tarefa.id);
            });

            coluna.appendChild(elementoTarefa);
        });

        coluna.addEventListener("dragover", (event) => {
            event.preventDefault();
        });

        coluna.addEventListener("drop", (event) => {
            event.preventDefault();
            const tarefaId = parseInt(event.dataTransfer.getData("text/plain"), 10);
            const tarefa = tarefas.find(t => t.id === tarefaId);

            if (tarefa) {
                tarefa.status = coluna.id;
                atualizarKanban();
            }
        });
    });
}

function adicionarDaily(){
    const membro = document.getElementById("membro").value;
    const ontem = document.getElementById("ontem").value;
    const hoje = document.getElementById("hoje").value;
    const impedimentos = document.getElementById("impedimentos").value;

    const novoDaily = {membro,ontem,hoje,impedimentos};

    dailyScrum.push(novoDaily);

    atualizarDailyScrum();
    document.getElementById("daily-form").reset();
}

function atualizarDailyScrum(){
    const dailyList = document.getElementById("daily-list");
    dailyList.innerHTML = "";

    dailyScrum.forEach(daily => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<strong>${daily.membro}:</strong><br>Ontem: ${daily.ontem}<br>Hoje: ${daily.hoje}<br>Impedimentos: ${daily.impedimentos}`;

        dailyList.appendChild(listItem);
    });
}


// Navegação
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const sectionId = link.getAttribute('href').substring(1);
        mostrarConteudo(sectionId);
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});


function mostrarConteudo(sectionId) {
  const sections = document.querySelectorAll('main .content');
  sections.forEach(section => section.classList.remove('active'));

  const section = document.getElementById(sectionId);
  if (section) {
      section.classList.add('active');
  }
}


// Funções para manipular o modal de histórias
const modalHistoria = document.getElementById("modal-historia");
const criarHistoriaBtn = document.getElementById("criar-historia");
const formHistoria = document.getElementById("historia-form");

criarHistoriaBtn.onclick = function() {
    formHistoria.reset();
    modalHistoria.style.display = "block";
}

formHistoria.onsubmit = function(event) { /* ... (código anterior) */ };

function fecharModalHistoria() {
    modalHistoria.style.display = "none";
}



// Funções para o modal de sprint
const modalSprint = document.getElementById("modal-sprint");
const formSprint = document.getElementById("sprint-form");

document.getElementById("criar-sprint").addEventListener("click", () => {
    formSprint.reset();
    modalSprint.style.display = "block";
});

formSprint.onsubmit = function(event) { /* ... (código anterior) */ };

function fecharModalSprint() {
    modalSprint.style.display = "none";
}

function atualizarSprintInfo() {
    atualizarElemento("sprint-nome", sprintAtual ? sprintAtual.nome : "-");
    atualizarElemento("sprint-meta", sprintAtual ? sprintAtual.meta : "-");
    atualizarElemento("sprint-inicio", sprintAtual ? sprintAtual.inicio : "-");
    atualizarElemento("sprint-fim", sprintAtual ? sprintAtual.fim : "-");
    atualizarElemento("sprint-status", sprintAtual ? sprintAtual.status : "-");
    atualizarBotoesSprint();
}

document.getElementById("iniciar-sprint").addEventListener("click", () => {
    if(sprintAtual){
        sprintAtual.status = "Em Andamento";
        atualizarSprintInfo();
    }
});

document.getElementById("concluir-sprint").addEventListener("click", () => {
    if(sprintAtual){
        sprintAtual.status = "Concluído";
        atualizarSprintInfo();
    }
});

function atualizarBotoesSprint() {
    const iniciarSprintBtn = document.getElementById("iniciar-sprint");
    const concluirSprintBtn = document.getElementById("concluir-sprint");

    if (sprintAtual) {
        iniciarSprintBtn.style.display = sprintAtual.status === "Planejado" ? "inline-block" : "none";
        concluirSprintBtn.style.display = sprintAtual.status === "Em Andamento" ? "inline-block" : "none";

        const sprintAcoes = document.getElementById("sprint-acoes");
        sprintAcoes.innerHTML = "";

        if (sprintAtual.status === "Planejado") {
            sprintAcoes.appendChild(iniciarSprintBtn);
        } else if (sprintAtual.status === "Em Andamento") {
            sprintAcoes.appendChild(concluirSprintBtn);
        }
    }
}

// Funções para manipular membros do time
const modalMembro = document.getElementById("modal-membro");
const closeModalBtnMembro = modalMembro.querySelector(".close-btn");
const adicionarMembroBtn = document.getElementById("adicionar-membro");
const formMembro = document.getElementById("membro-form");
const listaMembros = document.getElementById("lista-membros");

closeModalBtnMembro.onclick = function() { /* ... (código anterior) */ };
adicionarMembroBtn.onclick = function() { /* ... (código anterior) */ };
window.onclick = function(event) { /* ... (código anterior) */ };
formMembro.onsubmit = function(event) { /* ... (código anterior) */ };
function atualizarListaMembros() { /* ... (código anterior) */ }

// Funções para manipular o modal de tarefas
// ... (código anterior - modalTarefa, closeModalTarefa, formTarefa, adicionarTarefaBtn, etc.)


// Inicialização
// ... (chamadas das funções de atualização, criarColunasKanban, preencherDashboard, mostrarConteudo)

// Funções para o Dashboard
function preencherDashboard() { /* ... (código anterior) */ }
function calcularVelocidadeTime() { /* ... (código anterior) */ }
function calcularHistoriasConcluídas() { /* ... (código anterior) */ }
function criarColunasKanban() {
    const kanban = document.getElementById('kanban');
    const status = ['todo', 'doing', 'testing', 'done'];

    status.forEach(s => {
        const column = document.createElement('div');
        column.classList.add('column');
        column.id = s;
        column.dataset.status = s.charAt(0).toUpperCase() + s.slice(1);
        kanban.appendChild(column);
    });

    atualizarKanban();
}

// Preenchimento dinâmico dos formulários
document.getElementById("daily-form").innerHTML = `
    <label for="membro">Membro:</label>
    <select id="membro">
        <option value="ana">Ana</option>
        <option value="joao">João</option>
        <option value="maria">Maria</option>
    </select>

    <label for="ontem">O que você fez ontem?</label>
    <textarea id="ontem"></textarea>

    <label for="hoje">O que você fará hoje?</label>
    <textarea id="hoje"></textarea>

    <label for="impedimentos">Impedimentos:</label>
    <textarea id="impedimentos"></textarea>

    <button type="button" onclick="adicionarDaily()">Adicionar</button>
`;

document.getElementById("historia-form").innerHTML = `<!-- ... (código anterior) -->`;
document.getElementById("sprint-form").innerHTML = `<!-- ... (código anterior) -->`;
document.getElementById("tarefa-form").innerHTML = `<!-- ... (código anterior) -->`;

document.getElementById("sprint-info").innerHTML = `<h3>Sprint Atual: <span id="sprint-nome">${sprintAtual ? sprintAtual.nome : '-'}</span></h3><p>Meta: <span id="sprint-meta">${sprintAtual ? sprintAtual.meta : '-'}</span></p><p>Início: <span id="sprint-inicio">${sprintAtual ? sprintAtual.inicio : '-'}</span> | Fim: <span id="sprint-fim">${sprintAtual ? sprintAtual.fim : '-'}</span></p><p>Status: <span id="sprint-status">${sprintAtual ? sprintAtual.status : '-'}</span></p>`;
document.getElementById("sprint-acoes").innerHTML = `<button id="criar-sprint">Criar Sprint</button><button id="iniciar-sprint">Iniciar Sprint</button><button id="concluir-sprint">Concluir Sprint</button>`;

// ... (código para simulação de relatórios, etc.)