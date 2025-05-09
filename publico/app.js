// HISTÓRIA

const listaHistorias = document.getElementById("lista-historias");
const historiasConcluidas = document.getElementById("historias-concluidas");
const ordenarBacklogBtn = document.getElementById("ordenar-backlog");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");

let historiasBack = [];
let progresso = 0;
const MAX_HISTORIAS = 10; 

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
    
    adicionarHistoriaBacklog(titulo, prioridade);
    
    fecharModalHistoria();
    return false;
};

function fecharModalHistoria() {
    modalHistoria.style.display = "none";
}

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

function concluirHistoria(id) {
    const historiaIndex = historiasBack.findIndex(h => h.id === id);
    if (historiaIndex !== -1) {
        historiasBack[historiaIndex].concluida = true;
        renderizarBacklog();
        renderizarHistoriasConcluidas();
        atualizarProgresso(10); 
    }
}


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
                    atualizarProgresso(-10); 
                }
            };
            
            li.appendChild(span);
            li.appendChild(removerBtn);
            
            historiasConcluidas.appendChild(li);
        });
}


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


ordenarBacklogBtn.onclick = function() {
    historiasBack.sort((a, b) => a.prioridade - b.prioridade);
    renderizarBacklog();
};


renderizarBacklog();


const sprintGrafico = ["Sprint 1", "Sprint 2", "Sprint 3", "Sprint 4", "Sprint 5"];
const pontosConcluidos = [22, 27, 25, 30, 28];
const metaPorSprint = 25; 

const media = pontosConcluidos.reduce((total, pontos) => total + pontos, 0) / pontosConcluidos.length;
document.getElementById("media-velocidade").textContent = media.toFixed(1);

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
                pointRadius: 0 
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

// Funções para manipular as sprints


const sprintTime = [];

const modalSprint = document.getElementById("modal-sprint");
const adicionarSprintBtn = document.getElementById("adicionar-tarefa");
const formSprint = document.getElementById("form-sprint");
const listaSprints = document.getElementById("lista-sprints");

adicionarSprintBtn.onclick = function(){
    formSprint.reset();
    modalSprint.style.display = "block";
};

formSprint.onsubmit = function(event){
    event.preventDefault();

    // 2. Corrigido: adicionado .value para email e funcao
    const nome = document.getElementById("sprint-nome").value;
    const dataInicio = document.getElementById("dataIn-sprint").value;
    const dataFim = document.getElementById("dataFim-sprint").value;

    adicionarSprint(nome, dataInicio, dataFim);

    fecharModalSprint();
    return false;
};

function adicionarSprint(nome, dataInicio, dataFim){
    const team = {  
        nome,
        dataInicio,
        dataFim
    };

    sprintTime.push(team);
    renderizarSprint();
};

function renderizarSprint(){
    listaSprints.innerHTML = "";

    // 3. Corrigido: mudado 'time' para 'team' para ser consistente
    sprintTime.forEach(team => {
        const li = document.createElement("li");
        li.dataset.nome = team.nome;

        const span = document.createElement("span");
        span.textContent = `Nome: ${team.nome} \n Data Início: ${team.dataInicio} \n Data Fim: ${team.dataFim}`;

        const removerBtn = document.createElement("button");
        removerBtn.textContent = "X";
        removerBtn.className = "remover";

        // 4. Adicionada função removerMembro
        removerBtn.onclick = () => {
            const index = sprintTime.findIndex(m => m.nome === team.nome);
            if (index !== -1) {
                sprintTime.splice(index, 1);
                renderizarTime();
            }
        };

        li.appendChild(span);
        li.appendChild(removerBtn);
        
        // 5. Faltava adicionar o li à lista
        listaSprints.appendChild(li);
    });
}

renderizarSprint();

fecharModalSprint();

function fecharModalSprint() {
    modalSprint.style.display = "none";
}