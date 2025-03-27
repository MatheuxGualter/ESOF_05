// Elementos do DOM
const listaHistorias = document.getElementById("lista-historias");
const historiasConcluidas = document.getElementById("historias-concluidas");
const ordenarBacklogBtn = document.getElementById("ordenar-backlog");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");

// Variáveis de estado
let historiasBack = [];
let progresso = 0;
const MAX_HISTORIAS = 10; // Define quantas histórias completam 100%

// Modal de criação de histórias (seu código existente)
const modalHistoria = document.getElementById("modal-historia");
const criarHistoriaBtn = document.getElementById("criar-historia");
const formHistoria = document.getElementById("historia-form");

criarHistoriaBtn.onclick = function() {
    formHistoria.reset();
    modalHistoria.style.display = "block";
};

formHistoria.onsubmit = function(event) {
    event.preventDefault();
    const titulo = document.getElementById("titulo-historia").value;
    const prioridade = document.getElementById("prioridade-historia").value;
    
    // Adiciona a nova história ao backlog
    adicionarHistoriaBacklog(titulo, prioridade);
    
    fecharModalHistoria();
    return false;
};

function fecharModalHistoria() {
    modalHistoria.style.display = "none";
}

// Função para adicionar história ao backlog
function adicionarHistoriaBacklog(titulo, prioridade) {
    const historia = {
        id: Date.now(),
        titulo,
        prioridade,
        concluida: false
    };
    
    historiasBack.push(historia);
    renderizarBacklog();
}

// Função para renderizar o backlog
function renderizarBacklog() {
    listaHistorias.innerHTML = "";
    
    historiasBack
        .filter(historia => !historia.concluida)
        .forEach(historia => {
            const li = document.createElement("li");
            li.dataset.id = historia.id;
            
            const span = document.createElement("span");
            span.textContent = `${historia.titulo} (Prioridade: ${historia.prioridade})`;
            
            const concluirBtn = document.createElement("button");
            concluirBtn.textContent = "✓ Concluir";
            concluirBtn.className = "concluir";
            
            const removerBtn = document.createElement("button");
            removerBtn.textContent = "X";
            removerBtn.className = "remover";
            
            concluirBtn.onclick = () => concluirHistoria(historia.id);
            removerBtn.onclick = () => removerHistoria(historia.id);
            
            li.appendChild(span);
            li.appendChild(concluirBtn);
            li.appendChild(removerBtn);
            
            listaHistorias.appendChild(li);
        });
}

// Função para concluir história (move para o dashboard)
function concluirHistoria(id) {
    const historiaIndex = historiasBack.findIndex(h => h.id === id);
    if (historiaIndex !== -1) {
        historiasBack[historiaIndex].concluida = true;
        renderizarBacklog();
        renderizarHistoriasConcluidas();
        atualizarProgresso(10); // Aumenta 10% no progresso
    }
}

// Função para renderizar histórias concluídas no dashboard
function renderizarHistoriasConcluidas() {
    historiasConcluidas.innerHTML = "";
    
    historiasBack
        .filter(historia => historia.concluida)
        .forEach(historia => {
            const li = document.createElement("li");
            li.dataset.id = historia.id;
            
            const span = document.createElement("span");
            span.textContent = historia.titulo;
            
            const removerBtn = document.createElement("button");
            removerBtn.textContent = "❌";
            removerBtn.className = "remover";
            
            removerBtn.onclick = () => {
                const historiaIndex = historiasBack.findIndex(h => h.id === historia.id);
                if (historiaIndex !== -1) {
                    historiasBack.splice(historiaIndex, 1);
                    renderizarHistoriasConcluidas();
                    atualizarProgresso(-10); // Diminui 10% no progresso
                }
            };
            
            li.appendChild(span);
            li.appendChild(removerBtn);
            
            historiasConcluidas.appendChild(li);
        });
}

// Função para atualizar a barra de progresso (igual à anterior)
function atualizarProgresso(valor) {
    progresso += valor;
    progresso = Math.min(100, Math.max(0, progresso));
    
    progressBar.style.width = `${progresso}%`;
    progressText.textContent = `${progresso}% concluído`;
    
    if (progresso === 100) {
        progressBar.style.backgroundColor = "#2E7D32";
    } else {
        progressBar.style.backgroundColor = "#4CAF50";
    }
}

// Função para ordenar o backlog por prioridade
ordenarBacklogBtn.onclick = function() {
    historiasBack.sort((a, b) => a.prioridade - b.prioridade);
    renderizarBacklog();
};

// Inicialização
renderizarBacklog();

// Dados fictícios (últimas 5 sprints)
const sprintGrafico = ["Sprint 1", "Sprint 2", "Sprint 3", "Sprint 4", "Sprint 5"];
const pontosConcluidos = [22, 27, 25, 30, 28]; // Pontos por sprint
const metaPorSprint = 25; // Meta fictícia

// Calcula a média
const media = pontosConcluidos.reduce((total, pontos) => total + pontos, 0) / pontosConcluidos.length;
document.getElementById("media-velocidade").textContent = media.toFixed(1);

// Cria o gráfico
const ctx = document.getElementById('velocity-chart').getContext('2d');
new Chart(ctx, {
    type: 'line',
    data: {
        labels: sprintGrafico,
        datasets: [
            {
                label: 'Pontos Concluídos',
                data: pontosConcluidos,
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                tension: 0.3,
                fill: true
            },
            {
                label: 'Meta',
                data: Array(sprintGrafico.length).fill(metaPorSprint),
                borderColor: '#FF9800',
                borderDash: [5, 5],
                borderWidth: 1,
                pointRadius: 0 // Remove os pontos da linha de meta
            }
        ]
    },
    options: {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context) => `${context.dataset.label}: ${context.raw} pts`
                }
            },
            legend: {
                position: 'top'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Pontos Concluídos'
                }
            }
        }
    }
});

// Simulação de dados
let historias = [
    { id: 1, titulo: "Implementar Login", descricao: "Criar tela de login e fluxo de autenticação.", pontos: 5, prioridade: "alta", status: "doing" },
    { id: 2, titulo: "Criar Kanban", descricao: "Desenvolver a interface do Kanban com drag and drop.", pontos: 8, prioridade: "alta", status: "todo" },
    { id: 3, titulo: "Integração com API", descricao: "Integrar o frontend com a API do backend.", pontos: 13, prioridade: "media", status: "backlog" },
    { id: 4, titulo: "Testes unitários", descricao: "Escrever testes unitários para os componentes.", pontos: 3, prioridade: "baixa", status: "done" }
];


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

// Funções para manipular membros do time

window.onclick = function(event) { /* ... (código anterior) */ };


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

const membrosTime = [];

const modalMembro = document.getElementById("modal-membro");
const adicionarMembroBtn = document.getElementById("adicionar-membro");
const formMembro = document.getElementById("membro-form");
const listaMembros = document.getElementById("lista-membros");

adicionarMembroBtn.onclick = function(){
    formMembro.reset();
    modalMembro.style.display = "block";
};

formMembro.onsubmit = function(event){
    event.preventDefault();

    // 2. Corrigido: adicionado .value para email e funcao
    const nome = document.getElementById("membro-nome").value;
    const email = document.getElementById("membro-email").value;
    const funcao = document.getElementById("membro-funcao").value;

    adicionarMembro(nome, email, funcao);

    fecharModalMembro();
    return false;
};

function adicionarMembro(nome, email, funcao){
    const team = {  
        nome,
        email,
        funcao
    };

    membrosTime.push(team);
    renderizarTime();
};

function renderizarTime(){
    listaMembros.innerHTML = "";

    // 3. Corrigido: mudado 'time' para 'team' para ser consistente
    membrosTime.forEach(team => {
        const li = document.createElement("li");
        li.dataset.nome = team.nome;

        const span = document.createElement("span");
        span.textContent = `${team.nome} \n ${team.email} \n ${team.funcao}`;

        const removerBtn = document.createElement("button");
        removerBtn.textContent = "X";
        removerBtn.className = "remover";

        // 4. Adicionada função removerMembro
        removerBtn.onclick = () => {
            const index = membrosTime.findIndex(m => m.nome === team.nome);
            if (index !== -1) {
                membrosTime.splice(index, 1);
                renderizarTime();
            }
        };

        li.appendChild(span);
        li.appendChild(removerBtn);
        
        // 5. Faltava adicionar o li à lista
        listaMembros.appendChild(li);
    });
}

function fecharModalMembro() {
    modalMembro.style.display = "none";
}

renderizarTime();

// Sprint
document.getElementById('adicionar-tarefa').addEventListener('click', () => {
    document.getElementById('modal-sprint').style.display = 'block';
});

const modalSprint = document.getElementById("modal-sprint");

fecharModalSprint();

function fecharModalSprint() {
    modalSprint.style.display = "none";
}