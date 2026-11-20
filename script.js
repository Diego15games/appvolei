let fila = [];
let jogando = [];

// Abas
const menus = document.querySelectorAll(".menu");
const paginas = document.querySelectorAll(".pagina");

// Troca de telas
menus.forEach(botao => {

    botao.addEventListener("click", () => {

        menus.forEach(b => b.classList.remove("ativo"));
        paginas.forEach(p => p.classList.remove("ativa"));

        botao.classList.add("ativo");

        const pagina = document.getElementById(botao.dataset.page);

        pagina.classList.add("ativa");

    });

});

// Conteúdo inicial das páginas

document.getElementById("jogadores").innerHTML = `

<div class="card">

<h2>👥 Jogadores</h2>

<input
type="text"
id="nomeJogador"
placeholder="Nome do jogador">

<button id="btnAdicionar">

➕ Adicionar Jogador

</button>

<p id="contador">

Jogadores: 0

</p>

</div>

<div class="card">

<div id="listaJogadores">

Nenhum jogador cadastrado.

</div>

</div>

`;

document.getElementById("sorteio").innerHTML = `

<div class="card cardConfig">

    <div class="topoConfig">

        <div class="menuConfig" id="btnConfig">
            ⋮
        </div>

    </div>

    <div id="menuConfiguracoes" style="display:none; margin-top:15px;">

        <label>Jogadores por time</label>
        <input type="number" id="jogadoresTime" value="6" min="1">

        <label>Levantadores por time</label>
        <input type="number" id="levantadoresTime" value="1" min="0">

        <label>Meninas por time</label>
        <input type="number" id="meninasTime" value="0" min="0">

        <button id="btnSortear">
            🎲 Sortear Times
        </button>

    </div>

</div>

<div class="areaTimes">

    <div class="card">
        <h3>🔵 Time Azul</h3>
        <div id="timeAzul">Nenhum sorteio.</div>
    </div>

    <div class="card">
        <h3>🔴 Time Vermelho</h3>
        <div id="timeVermelho">Nenhum sorteio.</div>
    </div>

    <div class="card">
        <h3>⏳ Fila de Espera</h3>
        <div id="filaEspera">Nenhum jogador.</div>
    </div>

</div>

`;

document.getElementById("btnConfig").onclick = () => {

    const menu = document.getElementById("menuConfiguracoes");

    menu.style.display =
        menu.style.display === "block"
        ? "none"
        : "block";

};

document.getElementById("placar").innerHTML = `
<div class="seletorEsporte" id="seletorEsporte">
<button class="chip ativo" data-esporte="volei">🏐 Vôlei</button>
<button class="chip" data-esporte="basquete">🏀 Basquete</button>
<button class="chip" data-esporte="futsal">⚽ Futsal</button>
<button class="chip" data-esporte="futebol">⚽ Futebol</button>
</div>

<div id="placarVolei">
<div class="quadro">

<div class="quadroTopo">
<div id="vlTitulo" class="periodo">🏐 Vôlei • até 25 pontos</div>
<div class="vlConfig">
<select id="limitePontos">
<option value="15">15 pontos</option>
<option value="21">21 pontos</option>
<option value="25" selected>25 pontos</option>
<option value="personalizado">Personalizado</option>
</select>
<input
type="number"
id="pontosPersonalizado"
placeholder="Quantos pontos?"
style="display:none;"
min="1">
</div>
</div>

<div class="quadroTimes">

<div class="timeBox azul">
<h3>🔵 Azul</h3>
<div class="gols" id="pontosAzul">0</div>
<div class="botoesPonto">
<button id="vlAzulMais">+1</button>
</div>
</div>

<div class="timeBox vermelho">
<h3>🔴 Vermelho</h3>
<div class="gols" id="pontosVermelho">0</div>
<div class="botoesPonto">
<button id="vlVermelhoMais">+1</button>
</div>
</div>

</div>

<div class="acoesPartida">
<button id="desfazerPonto">↩️ Desfazer</button>
<button id="iniciarPartida">🔄 Nova partida</button>
<button id="btnSync">📡 Conectar</button>
</div>

</div>
</div>

<div id="placarTempo" style="display:none;">
<div class="quadro">

<div class="quadroTopo">
<div id="tpPeriodo" class="periodo"></div>
<div id="tpRelogio" class="relogio">00:00</div>
<div class="ctrlRelogio">
<button id="tpPlay">▶️ Iniciar</button>
<button id="tpAjuste">⏱️ Ajustar</button>
<button id="tpProximo">⏭️ Próximo</button>
</div>
</div>

<div class="quadroTimes" id="tpTimes"></div>

<div class="acoesPartida">
<button id="tpDesfazer">↩️ Desfazer</button>
<button id="tpNova">🔄 Nova partida</button>
</div>

</div>
</div>
`;

document.getElementById("ranking").innerHTML = `

<div class="card">

<h2>🏆 Ranking</h2><br>

<p>

Nenhuma partida registrada.

</p>

</div>

`;

// ==========================
// JOGADORES
// ==========================

let jogadores =
JSON.parse(localStorage.getItem("jogadores")) || [];

const lista =
document.getElementById("listaJogadores");

const contador =
document.getElementById("contador");

const nome =
document.getElementById("nomeJogador");

document
.getElementById("btnAdicionar")
.onclick = adicionarJogador;

function normalizarNome(n){

    return n
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();

}

function nomeRepetido(n, ignorar){

    const alvo = normalizarNome(n);

    return jogadores.some((j,i)=> i !== ignorar && normalizarNome(j.nome) === alvo);

}

function salvarJogadores(){

localStorage.setItem(
"jogadores",
JSON.stringify(jogadores)
);

}

let jogadorEditando = -1;

const modal = document.getElementById("modalEditar");
const editNome = document.getElementById("editNome");
const editSexo = document.getElementById("editSexo");
const editLevantador = document.getElementById("editLevantador");

function atualizarJogadores(){

    contador.innerHTML = "Jogadores: " + jogadores.length;

    if(jogadores.length === 0){
        lista.innerHTML = "Nenhum jogador cadastrado.";
        return;
    }

    lista.innerHTML = "";

    jogadores.forEach((j,index)=>{

        lista.innerHTML += `

        <div class="jogador">

            <div class="infoJogador">

                <div class="nomeJogador">
                    👤 ${j.nome}
                </div>

                <div class="detalhes">
                    ${j.sexo=="M" ? "🚹 Masculino" : "🚺 Feminino"}
                    <br>
                    ${j.levantador ? "🏐 Levantador" : ""}
                </div>

            </div>

            <div class="acoes">

                <button class="btnIcone editar" onclick="editar(${index})">
                    ✏️
                </button>

                <button class="btnIcone excluir" onclick="excluir(${index})">
                    🗑️
                </button>

            </div>

        </div>

        `;

    });

}

function adicionarJogador(){

let n =
nome.value.replace(/\s+/g, " ").trim();

if(n=="") return;

if(nomeRepetido(n, -1)){

alert("Esse jogador já existe.");

return;

}

jogadores.push({

nome:n,

sexo:"M",

levantador:false

});

nome.value="";

salvarJogadores();

atualizarJogadores();

}

function excluir(i){

if(!confirm("Excluir jogador?")) return;

jogadores.splice(i,1);

salvarJogadores();

atualizarJogadores();

}

function editar(i){

    jogadorEditando = i;

    editNome.value = jogadores[i].nome;

    editSexo.value = jogadores[i].sexo;

    editLevantador.checked = jogadores[i].levantador;

    modal.classList.add("ativo");

}

atualizarJogadores();

document.getElementById("cancelarEditar").onclick = () => {

    modal.classList.remove("ativo");

};

document.getElementById("salvarJogador").onclick = () => {

    let nomeNovo = editNome.value.trim();

    if(nomeNovo==""){
        alert("Digite um nome.");
        return;
    }

    if(nomeRepetido(nomeNovo, jogadorEditando)){
        alert("Esse nome já existe.");
        return;
    }

    jogadores[jogadorEditando].nome = nomeNovo;
    jogadores[jogadorEditando].sexo = editSexo.value;
    jogadores[jogadorEditando].levantador = editLevantador.checked;

    salvarJogadores();
    atualizarJogadores();

    modal.classList.remove("ativo");

};

function embaralhar(lista){

    let copia = [...lista];

    for(let i=copia.length-1;i>0;i--){

        let j = Math.floor(Math.random()*(i+1));

        [copia[i],copia[j]] = [copia[j],copia[i]];

    }

    return copia;

}

// ==========================
// REGRAS DO SORTEIO
// ==========================
// Meninas por time e Levantadores por time:
//  - valor maior que 0 = o time tem exatamente essa quantidade (se houver)
//  - se faltar menina/levantador, entra homem no lugar
//  - se sobrar, as que passam do limite esperam a próxima rodada
//  - valor 0 = sem regra

let azulAtual = [];
let vermelhoAtual = [];

function configSorteio(){

    return {
        qtd:  Math.max(1, Number(document.getElementById("jogadoresTime").value) || 6),
        nLev: Math.max(0, Number(document.getElementById("levantadoresTime").value) || 0),
        nMen: Math.max(0, Number(document.getElementById("meninasTime").value) || 0)
    };

}

function ehMenina(j){

    return j.sexo == "F";

}

function formarTime(pool, cfg){

    const { qtd, nLev, nMen } = cfg;

    let disponiveis = [...pool];
    let time = [];
    let cntL = 0;
    let cntF = 0;

    while(time.length < qtd && disponiveis.length){

        let melhor = -1;
        let melhorScore = -1;

        disponiveis.forEach((j, i)=>{

            const L = !!j.levantador;
            const F = ehMenina(j);

            // não passa do limite de cada regra
            if(nLev > 0 && L && cntL >= nLev) return;
            if(nMen > 0 && F && cntF >= nMen) return;

            // quem preenche uma vaga das regras tem prioridade
            let score = 0;
            if(nLev > 0 && L) score++;
            if(nMen > 0 && F) score++;

            if(score > melhorScore){
                melhor = i;
                melhorScore = score;
            }

        });

        if(melhor < 0) break;

        const j = disponiveis.splice(melhor, 1)[0];

        if(j.levantador) cntL++;
        if(ehMenina(j)) cntF++;

        time.push(j);

    }

    // Se o time não fechou por causa dos limites, completa com quem sobrou
    while(time.length < qtd && disponiveis.length){

        time.push(disponiveis.shift());

    }

    return { time: time, resto: disponiveis };

}

function rotulo(j){

    const icone = j.levantador ? "🏐" : (ehMenina(j) ? "👩" : "👨");

    return icone + " " + j.nome;

}

function resumoTime(time){

    return "";

}

function mostrarTimes(){

    const azulDiv = document.getElementById("timeAzul");
    const vermelhoDiv = document.getElementById("timeVermelho");
    const filaDiv = document.getElementById("filaEspera");

    azulDiv.innerHTML = azulAtual.length
        ? azulAtual.map(rotulo).join("<br>") + resumoTime(azulAtual)
        : "Nenhum jogador.";

    vermelhoDiv.innerHTML = vermelhoAtual.length
        ? vermelhoAtual.map(rotulo).join("<br>") + resumoTime(vermelhoAtual)
        : "Nenhum jogador.";

    filaDiv.innerHTML = fila.length
        ? fila.map(rotulo).join("<br>")
        : "Nenhum jogador na fila.";

}

document.getElementById("btnSortear").onclick = ()=>{

    if(jogadores.length === 0){

        alert("Cadastre os jogadores primeiro.");

        return;

    }

    const cfg = configSorteio();

    let azulDiv = document.getElementById("timeAzul");
    let vermelhoDiv = document.getElementById("timeVermelho");

    azulDiv.classList.add("animando");
    vermelhoDiv.classList.add("animando");

    let tempo = 0;

    let efeito = setInterval(()=>{

        let nomes = embaralhar(jogadores);

        azulDiv.innerHTML =
            nomes.slice(0, cfg.qtd).map(j=>"🏐 "+j.nome).join("<br>");

        vermelhoDiv.innerHTML =
            nomes.slice(cfg.qtd, cfg.qtd*2).map(j=>"🏐 "+j.nome).join("<br>");

        tempo++;

        if(tempo >= 15){

            clearInterval(efeito);

            azulDiv.classList.remove("animando");
            vermelhoDiv.classList.remove("animando");

            // Sorteio novo: todos embaralhados, seguindo as regras
            let pool = embaralhar(jogadores);

            let a = formarTime(pool, cfg);
            let v = formarTime(a.resto, cfg);

            azulAtual = a.time;
            vermelhoAtual = v.time;
            fila = v.resto;
            jogando = [...azulAtual, ...vermelhoAtual];

            mostrarTimes();

            zerarVolei();

        }

    }, 120);

};

// Fim da partida: quem ganhou fica, quem perdeu sai
// e um novo time é sorteado com a fila de espera.
// Se a fila não completar o time, entram jogadores de quem perdeu.
function proximaRodada(vencedor){

    const existe = j => jogadores.includes(j);

    // tira quem foi excluído e coloca na fila quem foi cadastrado depois
    azulAtual = azulAtual.filter(existe);
    vermelhoAtual = vermelhoAtual.filter(existe);
    fila = fila.filter(existe);

    jogadores.forEach(j=>{

        if(!azulAtual.includes(j) && !vermelhoAtual.includes(j) && !fila.includes(j)){

            fila.push(j);

        }

    });

    const cfg = configSorteio();

    const perderam = vencedor == "azul" ? vermelhoAtual : azulAtual;

    // Quem estava na fila tem prioridade; depois quem perdeu (embaralhado)
    const pool = [...fila, ...embaralhar(perderam)];

    const r = formarTime(pool, cfg);

    if(vencedor == "azul"){

        vermelhoAtual = r.time;

    }else{

        azulAtual = r.time;

    }

    fila = r.resto;
    jogando = [...azulAtual, ...vermelhoAtual];

    mostrarTimes();

}

let pontosAzul = 0;
let pontosVermelho = 0;
let historico = [];

document.getElementById("limitePontos").onchange = function(){

    document.getElementById("pontosPersonalizado").style.display =
        this.value=="personalizado" ? "block" : "none";

};

function zerarVolei(){

    pontosAzul = 0;
    pontosVermelho = 0;
    historico = [];

    document.getElementById("pontosAzul").innerHTML = "0";
    document.getElementById("pontosVermelho").innerHTML = "0";

    sincronizar();

}

document.getElementById("iniciarPartida").onclick = ()=>{

    if(pontosAzul + pontosVermelho > 0){

        if(!confirm("Começar uma nova partida? O placar será zerado.")) return;

    }

    zerarVolei();

};

function limite(){

    let valor = document.getElementById("limitePontos").value;

    if(valor=="personalizado"){

        return Number(document.getElementById("pontosPersonalizado").value);

    }

    return Number(valor);

}

function atualizarTituloVolei(){

    let max = limite();

    document.getElementById("vlTitulo").textContent =
        "🏐 Vôlei" + (max > 0 ? " • até " + max + " pontos" : "");

}

document.getElementById("limitePontos")
    .addEventListener("change", atualizarTituloVolei);

document.getElementById("pontosPersonalizado")
    .addEventListener("input", atualizarTituloVolei);

atualizarTituloVolei();

document.getElementById("vlAzulMais").onclick = ()=>{

    pontosAzul++;

    historico.push("azul");

    document.getElementById("pontosAzul").innerHTML = pontosAzul;

    verificarFim();

};

document.getElementById("vlVermelhoMais").onclick = ()=>{

    pontosVermelho++;

    historico.push("vermelho");

    document.getElementById("pontosVermelho").innerHTML = pontosVermelho;

    verificarFim();

};

document.getElementById("desfazerPonto").onclick = ()=>{

    let ultimo = historico.pop();

    if(!ultimo) return;

    if(ultimo=="azul"){

        pontosAzul--;

        document.getElementById("pontosAzul").innerHTML = pontosAzul;

    }else{

        pontosVermelho--;

        document.getElementById("pontosVermelho").innerHTML = pontosVermelho;

    }

};

function verificarFim(){

    let max = limite();

    if(max<=0) return;

    if(pontosAzul>=max || pontosVermelho>=max){

        const vencedor = pontosAzul >= max ? "azul" : "vermelho";
        const nomeVencedor = vencedor == "azul" ? "🔵 Azul" : "🔴 Vermelho";
        const placarFinal = pontosAzul + " x " + pontosVermelho;
        const temTimes = azulAtual.length > 0 && vermelhoAtual.length > 0;

        setTimeout(()=>{

            const msg = temTimes
                ? "🏁 Fim da partida!\n\n" + nomeVencedor + " venceu (" + placarFinal + ")\n\nOK = Próxima rodada (quem perdeu sai e entra um novo time)\nCancelar = Desfazer ponto"
                : "🏁 Fim da partida!\n\n" + nomeVencedor + " venceu (" + placarFinal + ")\n\nOK = Nova partida\nCancelar = Desfazer ponto";

            if(confirm(msg)){

                if(temTimes) proximaRodada(vencedor);

                zerarVolei();

            }else{

                document.getElementById("desfazerPonto").click();

            }

        },100);

    }

}

let paginaAtual = "jogadores";

menus.forEach(botao => {
    botao.addEventListener("click", () => {
        paginaAtual = botao.dataset.page;
    });
});

window.addEventListener("orientationchange", () => {
    setTimeout(() => {

        paginas.forEach(p => p.classList.remove("ativa"));
        menus.forEach(b => b.classList.remove("ativo"));

        document.getElementById(paginaAtual).classList.add("ativa");

        document
            .querySelector(`.menu[data-page="${paginaAtual}"]`)
            .classList.add("ativo");

    }, 200);
});

// ==========================
// MULTI-ESPORTES (basquete, futsal, futebol)
// ==========================

// Para adicionar um esporte novo, basta incluir uma linha aqui
// e um botão (chip) no HTML do placar.
const ESPORTES = {
    basquete: {
        nome: "Basquete", periodos: 4, minutos: 10, prorrog: 5,
        regressivo: true,
        rotulo: n => n + "º Quarto",
        pontos: [1, 2, 3],
        limiteFaltas: 5, rotuloLimite: "BÔNUS", zerarFaltas: true,
        tempos: true
    },
    futsal: {
        nome: "Futsal", periodos: 2, minutos: 20, prorrog: 5,
        regressivo: true,
        rotulo: n => n + "º Tempo",
        pontos: [1],
        limiteFaltas: 5, rotuloLimite: "LIMITE", zerarFaltas: true,
        tempos: true
    },
    futebol: {
        nome: "Futebol", periodos: 2, minutos: 45, prorrog: 15,
        regressivo: false,
        rotulo: n => n + "º Tempo",
        pontos: [1],
        limiteFaltas: 0, rotuloLimite: "", zerarFaltas: false,
        tempos: false
    }
};

let esporteAtual = "volei";
let tp = null;
let tpIntervalo = null;
const tpEstados = {};

function tpNovo(chave) {
    const t = {
        chave: chave,
        periodo: 0,
        seg: 0,
        alvo: 0,
        rodando: false,
        ultimo: 0,
        avisou: false,
        fim: false,
        hist: [],
        azul: { pts: 0, faltas: 0, tempos: 0 },
        vermelho: { pts: 0, faltas: 0, tempos: 0 }
    };
    tpPosicionar(t, 0);
    return t;
}

function tpDuracao(e, i) {
    return (i < e.periodos ? e.minutos : e.prorrog) * 60;
}

// Coloca o relógio no começo do período i
function tpPosicionar(t, i) {
    const e = ESPORTES[t.chave];
    t.periodo = i;
    if (e.regressivo) {
        t.seg = tpDuracao(e, i);
        t.alvo = 0;
    } else {
        let inicio = 0;
        for (let k = 0; k < i; k++) inicio += tpDuracao(e, k);
        t.seg = inicio;
        t.alvo = inicio + tpDuracao(e, i);
    }
    t.avisou = false;
    t.fim = false;
}

function tpNomePeriodo(chave, i) {
    const e = ESPORTES[chave];
    if (i < e.periodos) return e.rotulo(i + 1);
    const n = i - e.periodos + 1;
    return "Prorrogação" + (n > 1 ? " " + n : "");
}

function apito() {
    try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        const ctx = new Ctx();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.frequency.value = 880;
        g.gain.value = 0.2;
        o.start();
        o.stop(ctx.currentTime + 0.8);
    } catch (e) {}
    if (navigator.vibrate) navigator.vibrate([300, 100, 300]);
}

function tpMostrar() {
    const e = ESPORTES[tp.chave];
    const s = e.regressivo ? Math.ceil(tp.seg) : Math.floor(tp.seg);
    const m = Math.floor(s / 60);
    const r = s % 60;
    const el = document.getElementById("tpRelogio");
    el.textContent = String(m).padStart(2, "0") + ":" + String(r).padStart(2, "0");
    el.classList.toggle("estourou", !e.regressivo && tp.seg >= tp.alvo);
    el.classList.toggle("parado", !tp.rodando);
}

function tpRenderTopo() {
    document.getElementById("tpPeriodo").textContent =
        tpNomePeriodo(tp.chave, tp.periodo) + (tp.fim ? " • ⏰ Fim do período" : "");
    const b = document.getElementById("tpPlay");
    b.textContent = tp.rodando ? "⏸️ Pausar" : "▶️ Iniciar";
    b.classList.toggle("rodando", tp.rodando);
    tpMostrar();
}

function tpRenderTimes() {
    const e = ESPORTES[tp.chave];

    const caixa = (cor, titulo) => {
        const t = tp[cor];
        const aviso = (e.limiteFaltas && t.faltas >= e.limiteFaltas)
            ? ` <span class="bonus">${e.rotuloLimite}</span>` : "";

        const controle = (rotulo, campo, valor, extra) => `
        <div class="linhaExtra">
            <span>${rotulo}${extra || ""}</span>
            <span class="controles">
                <button data-a="${campo}" data-t="${cor}" data-v="-1">−</button>
                <b>${valor}</b>
                <button data-a="${campo}" data-t="${cor}" data-v="1">+</button>
            </span>
        </div>`;

        return `
        <div class="timeBox ${cor}">
            <h3>${titulo}</h3>
            <div class="gols">${t.pts}</div>
            <div class="botoesPonto">
                ${e.pontos.map(p =>
                    `<button data-a="pts" data-t="${cor}" data-v="${p}">+${p}</button>`
                ).join("")}
            </div>
            ${controle("Faltas", "faltas", t.faltas, aviso)}
            ${e.tempos ? controle("Pedidos de tempo", "tempos", t.tempos) : ""}
        </div>`;
    };

    document.getElementById("tpTimes").innerHTML =
        caixa("azul", "🔵 Azul") + caixa("vermelho", "🔴 Vermelho");
}

function tpTick() {
    const agora = Date.now();
    const dt = (agora - tp.ultimo) / 1000;
    tp.ultimo = agora;

    if (ESPORTES[tp.chave].regressivo) {
        tp.seg -= dt;
        if (tp.seg <= 0) {
            tp.seg = 0;
            tpPausar();
            tp.fim = true;
            apito();
            tpRenderTopo();
            return;
        }
    } else {
        tp.seg += dt;
        if (!tp.avisou && tp.seg >= tp.alvo) {
            tp.avisou = true;
            apito();
        }
    }
    tpMostrar();
}

function tpIniciar() {
    if (tp.rodando) return;
    if (ESPORTES[tp.chave].regressivo && tp.seg <= 0) return;
    tp.rodando = true;
    tp.ultimo = Date.now();
    tpIntervalo = setInterval(tpTick, 200);
    tpRenderTopo();
}

function tpPausar() {
    tp.rodando = false;
    clearInterval(tpIntervalo);
    tpIntervalo = null;
    tpRenderTopo();
}

function tpSnapshot() {
    tp.hist.push(JSON.stringify({ azul: tp.azul, vermelho: tp.vermelho }));
    if (tp.hist.length > 100) tp.hist.shift();
}

// Botões de ponto / falta / pedido de tempo
document.getElementById("tpTimes").addEventListener("click", ev => {
    const b = ev.target.closest("button[data-a]");
    if (!b) return;
    const time = tp[b.dataset.t];
    const campo = b.dataset.a;
    const novo = Math.max(0, time[campo] + Number(b.dataset.v));
    if (novo === time[campo]) return;
    tpSnapshot();
    time[campo] = novo;
    tpRenderTimes();
});

document.getElementById("tpPlay").onclick = () => {
    tp.rodando ? tpPausar() : tpIniciar();
};

document.getElementById("tpAjuste").onclick = () => {
    const atual = document.getElementById("tpRelogio").textContent;
    const r = prompt("Ajustar relógio (mm:ss)", atual);
    if (r === null) return;
    const m = r.trim().match(/^(\d{1,3}):([0-5]?\d)$/);
    if (!m) {
        alert("Use o formato mm:ss, por exemplo 08:30");
        return;
    }
    tp.seg = Number(m[1]) * 60 + Number(m[2]);
    tp.fim = false;
    tp.avisou = !ESPORTES[tp.chave].regressivo && tp.seg >= tp.alvo;
    tpRenderTopo();
};

document.getElementById("tpProximo").onclick = () => {
    const e = ESPORTES[tp.chave];
    const prox = tp.periodo + 1;
    if (!confirm("Ir para: " + tpNomePeriodo(tp.chave, prox) + "?")) return;
    if (tp.rodando) tpPausar();
    if (e.zerarFaltas) {
        tp.azul.faltas = 0;
        tp.vermelho.faltas = 0;
    }
    tp.hist = [];
    tpPosicionar(tp, prox);
    tpRenderTopo();
    tpRenderTimes();
};

document.getElementById("tpDesfazer").onclick = () => {
    const ultimo = tp.hist.pop();
    if (!ultimo) return;
    const d = JSON.parse(ultimo);
    tp.azul = d.azul;
    tp.vermelho = d.vermelho;
    tpRenderTimes();
};

document.getElementById("tpNova").onclick = () => {
    if (!confirm("Começar uma nova partida? O placar e o relógio serão zerados.")) return;
    if (tp.rodando) tpPausar();
    tp = tpNovo(tp.chave);
    tpEstados[tp.chave] = tp;
    tpRenderTopo();
    tpRenderTimes();
};

// Troca de esporte
function selecionarEsporte(chave) {
    if (tp && tp.rodando) tpPausar();
    if (tp) tpEstados[tp.chave] = tp;

    esporteAtual = chave;

    document.querySelectorAll("#seletorEsporte .chip").forEach(c => {
        c.classList.toggle("ativo", c.dataset.esporte === chave);
    });

    const volei = chave === "volei";
    document.getElementById("placarVolei").style.display = volei ? "block" : "none";
    document.getElementById("placarTempo").style.display = volei ? "none" : "block";

    if (!volei) {
        tp = tpEstados[chave] || tpNovo(chave);
        tpRenderTopo();
        tpRenderTimes();
    }

    try { localStorage.setItem("esporteAtual", chave); } catch (e) {}
}

document.querySelectorAll("#seletorEsporte .chip").forEach(c => {
    c.onclick = () => selecionarEsporte(c.dataset.esporte);
});

(function () {
    let salvo = "volei";
    try { salvo = localStorage.getItem("esporteAtual") || "volei"; } catch (e) {}
    if (salvo !== "volei" && !ESPORTES[salvo]) salvo = "volei";
    selecionarEsporte(salvo);
})();


// ==========================
// ROTAÇÃO DA TELA
// ==========================
// Libera a rotação automática quando o navegador permite.
// (Se o celular estiver com "Girar automaticamente" desligado,
// ative nas configurações rápidas do Android.)
try{

    if(screen.orientation && screen.orientation.unlock){

        screen.orientation.unlock();

    }

}catch(e){}


// ==========================
// SINCRONIZAÇÃO ENTRE CELULARES (sem internet)
// ==========================
// Usa conexão direta entre os celulares (WebRTC) pela rede do hotspot.
// Um celular é o "principal" (liga o hotspot e cria a conexão) e os
// outros entram nele. Os códigos de conexão são trocados na mão
// (copiar e colar / compartilhar).

let syncPeers = [];
let syncFalhou = false;
let syncUltimoDetalhe = "";
let syncModo = null;      // "principal" | "convidado" | null
let syncPendente = null;  // convite criado e ainda sem resposta
let syncAplicando = false;

function syncNovoPeer(stun){

    const pc = new RTCPeerConnection({
        iceServers: stun ? [{ urls: "stun:stun.l.google.com:19302" }] : []
    });
    const p = { pc: pc, canal: null, aberto: false };

    const mudou = ()=>{

        const est = pc.connectionState;

        if(est === "failed" || est === "closed"){

            p.aberto = false;

            if(est === "failed") syncFalhou = true;

        }

        syncAtualizarStatus();

    };

    pc.onconnectionstatechange = mudou;
    pc.oniceconnectionstatechange = mudou;

    return p;

}

function syncConfigurarCanal(p, canal){

    p.canal = canal;

    canal.onopen = ()=>{

        p.aberto = true;
        syncFalhou = false;
        syncAtualizarStatus();

        const esconderQr = (id)=>{

            const q = document.getElementById(id);

            if(q) q.style.display = "none";

        };

        if(p === syncPendente) esconderQr("syncQrConvite");

        if(syncModo == "convidado") esconderQr("syncQrResp");

        // o principal manda o estado atual para quem acabou de entrar
        if(syncModo == "principal"){

            try{ canal.send(JSON.stringify(syncMontarEstado())); }catch(e){}

        }

    };

    canal.onclose = ()=>{

        p.aberto = false;
        syncAtualizarStatus();

    };

    canal.onmessage = (e)=>{

        syncReceber(p, e.data);

    };

}

function syncEnviar(msg, exceto){

    const texto = typeof msg == "string" ? msg : JSON.stringify(msg);

    syncPeers.forEach(p=>{

        if(p === exceto || !p.aberto || !p.canal) return;

        try{ p.canal.send(texto); }catch(e){}

    });

}

function syncDados(j){

    return { nome: j.nome, sexo: j.sexo, levantador: !!j.levantador };

}

function syncMontarEstado(){

    return {
        t: "estado",
        pa: pontosAzul,
        pv: pontosVermelho,
        h: historico,
        az: azulAtual.map(syncDados),
        ve: vermelhoAtual.map(syncDados),
        fi: fila.map(syncDados),
        lim: document.getElementById("limitePontos").value,
        limp: document.getElementById("pontosPersonalizado").value
    };

}

function sincronizar(){

    if(syncAplicando) return;

    if(syncPeers.some(p=>p.aberto)){

        syncEnviar(syncMontarEstado());

    }

}

function syncAchar(d, estado){

    let j = jogadores.find(x=> normalizarNome(x.nome) === normalizarNome(d.nome));

    if(!j){

        j = { nome: d.nome, sexo: d.sexo, levantador: d.levantador };
        jogadores.push(j);
        estado.novos = true;

    }

    return j;

}

function syncAplicarEstado(m){

    syncAplicando = true;

    try{

        const info = { novos: false };

        pontosAzul = m.pa;
        pontosVermelho = m.pv;
        historico = m.h || [];

        document.getElementById("pontosAzul").innerHTML = pontosAzul;
        document.getElementById("pontosVermelho").innerHTML = pontosVermelho;

        azulAtual = (m.az || []).map(d=>syncAchar(d, info));
        vermelhoAtual = (m.ve || []).map(d=>syncAchar(d, info));
        fila = (m.fi || []).map(d=>syncAchar(d, info));
        jogando = [...azulAtual, ...vermelhoAtual];

        mostrarTimes();

        if(info.novos){

            salvarJogadores();
            atualizarJogadores();

        }

        const sel = document.getElementById("limitePontos");
        const per = document.getElementById("pontosPersonalizado");

        sel.value = m.lim;
        per.value = m.limp || "";
        sel.dispatchEvent(new Event("change"));

    }finally{

        syncAplicando = false;

    }

}

function syncAplicarPonto(time){

    if(time == "azul"){

        pontosAzul++;
        document.getElementById("pontosAzul").innerHTML = pontosAzul;

    }else{

        pontosVermelho++;
        document.getElementById("pontosVermelho").innerHTML = pontosVermelho;

    }

    historico.push(time);

}

function syncAplicarDesfazer(){

    const ultimo = historico.pop();

    if(!ultimo) return;

    if(ultimo == "azul"){

        pontosAzul--;
        document.getElementById("pontosAzul").innerHTML = pontosAzul;

    }else{

        pontosVermelho--;
        document.getElementById("pontosVermelho").innerHTML = pontosVermelho;

    }

}

function syncReceber(origem, dados){

    let m;

    try{ m = JSON.parse(dados); }catch(e){ return; }

    // o principal repassa para os outros celulares
    if(syncModo == "principal") syncEnviar(dados, origem);

    if(m.t == "ponto") syncAplicarPonto(m.time);
    else if(m.t == "desfazer") syncAplicarDesfazer();
    else if(m.t == "estado") syncAplicarEstado(m);

}

// pontos e desfazer: manda só o que mudou (assim dois celulares
// marcando ao mesmo tempo não perdem ponto)
document.getElementById("vlAzulMais").addEventListener("click", ()=>{

    syncEnviar({ t: "ponto", time: "azul" });

});

document.getElementById("vlVermelhoMais").addEventListener("click", ()=>{

    syncEnviar({ t: "ponto", time: "vermelho" });

});

let syncTamanhoAntes = 0;

document.getElementById("desfazerPonto").addEventListener("click", ()=>{

    syncTamanhoAntes = historico.length;

}, true);

document.getElementById("desfazerPonto").addEventListener("click", ()=>{

    if(historico.length < syncTamanhoAntes) syncEnviar({ t: "desfazer" });

});

// ---------- códigos de conexão ----------

function syncBytesParaTexto(bytes){

    let bin = "";

    for(let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);

    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

}

function syncTextoParaBytes(txt){

    let b64 = txt.replace(/-/g, "+").replace(/_/g, "/");

    while(b64.length % 4) b64 += "=";

    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);

    for(let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);

    return bytes;

}

async function syncComprimir(texto){

    try{

        if(window.CompressionStream){

            const fluxo = new Blob([texto]).stream()
                .pipeThrough(new CompressionStream("deflate-raw"));

            const buf = await new Response(fluxo).arrayBuffer();

            return "Z" + syncBytesParaTexto(new Uint8Array(buf));

        }

    }catch(e){}

    return "P" + syncBytesParaTexto(new TextEncoder().encode(texto));

}

async function syncDescomprimir(codigo){

    codigo = codigo.replace(/\s+/g, "");

    const tipo = codigo[0];
    const bytes = syncTextoParaBytes(codigo.slice(1));

    if(tipo == "Z"){

        const fluxo = new Blob([bytes]).stream()
            .pipeThrough(new DecompressionStream("deflate-raw"));

        return await new Response(fluxo).text();

    }

    return new TextDecoder().decode(bytes);

}

function syncEsperarIce(pc){

    return new Promise(resolve=>{

        if(pc.iceGatheringState === "complete") return resolve();

        const fim = ()=>{

            if(pc.iceGatheringState === "complete"){

                pc.removeEventListener("icegatheringstatechange", fim);
                resolve();

            }

        };

        pc.addEventListener("icegatheringstatechange", fim);

        setTimeout(resolve, 4000);

    });

}

// Tira do SDP o que não é necessário (deixa o código bem menor)
function syncLimparSdp(sdp){

    const linhas = sdp.split(/\r?\n/).filter(l=> l.length > 0);

    const saida = linhas.filter(l=>{

        if(l.startsWith("a=ice-options")) return false;
        if(l.startsWith("a=extmap-allow-mixed")) return false;
        if(l.startsWith("a=msid-semantic")) return false;
        if(l.startsWith("a=max-message-size")) return false;

        if(l.startsWith("a=candidate")){

            const partes = l.split(" ");

            if(/tcp/i.test(partes[2] || "")) return false;
            if((partes[4] || "").includes(":")) return false; // IPv6

        }

        return true;

    });

    // segurança: se não sobrou nenhum candidato, usa o original
    if(!saida.some(l=> l.startsWith("a=candidate"))){

        return linhas.join("\n");

    }

    return saida.join("\n");

}

// ---------- código compacto (bem curto) ----------
// Em vez de mandar o SDP inteiro, manda só o que muda de verdade
// (senha, impressão digital, endereço e porta). Se o SDP tiver
// algo diferente do esperado, usa o formato comprimido de antes.

function syncNormalizarSdp(sdp){

    return sdp.split(/\r?\n/)
        .filter(l=> l && !l.startsWith("o=") && !l.startsWith("a=end-of-candidates"))
        .map(l=>{

            if(l.startsWith("a=candidate:")){

                const p = l.split(" ");

                return "cand " + (p[4] || "").toLowerCase() + " " + p[5];

            }

            if(l.startsWith("a=fingerprint:")) return l.toUpperCase();

            return l;

        })
        .sort()
        .join("\n");

}

function syncBytesParaSdp(b){

    let i = 0;

    const flags = b[i++];
    const setup = (flags & 1) ? "active" : "actpass";
    const n = flags >> 1;

    const lerTexto = ()=>{

        const len = b[i++];
        let t = "";

        for(let k = 0; k < len; k++) t += String.fromCharCode(b[i++]);

        return t;

    };

    const ufrag = lerTexto();
    const pwd = lerTexto();
    const fp = [];

    for(let k = 0; k < 32; k++) fp.push(b[i++].toString(16).padStart(2, "0").toUpperCase());

    const linhas = [
        "v=0",
        "o=- 1 2 IN IP4 127.0.0.1",
        "s=-",
        "t=0 0",
        "a=group:BUNDLE 0",
        "m=application 9 UDP/DTLS/SCTP webrtc-datachannel",
        "c=IN IP4 0.0.0.0"
    ];

    for(let c = 0; c < n; c++){

        const tipo = b[i++];
        let addr;

        if(tipo === 0){

            let hex = "";

            for(let k = 0; k < 16; k++) hex += b[i++].toString(16).padStart(2, "0");

            addr = hex.slice(0, 8) + "-" + hex.slice(8, 12) + "-" + hex.slice(12, 16)
                + "-" + hex.slice(16, 20) + "-" + hex.slice(20) + ".local";

        }else{

            addr = [b[i++], b[i++], b[i++], b[i++]].join(".");

        }

        const porta = (b[i++] << 8) | b[i++];

        linhas.push("a=candidate:" + (c + 1) + " 1 udp " + (1677729535 - c) + " " + addr + " " + porta + " typ host generation 0");

    }

    if(i !== b.length) throw new Error("tamanho");

    linhas.push(
        "a=ice-ufrag:" + ufrag,
        "a=ice-pwd:" + pwd,
        "a=fingerprint:sha-256 " + fp.join(":"),
        "a=setup:" + setup,
        "a=mid:0",
        "a=sctp-port:5000"
    );

    return linhas.join("\r\n") + "\r\n";

}

function syncSdpParaBytes(sdp){

    try{

        const linhas = sdp.split(/\r?\n/).filter(l=> l);

        let ufrag = null, pwd = null, fp = null, setup = null;
        const cands = [];

        for(const l of linhas){

            if(l.startsWith("a=ice-ufrag:")) ufrag = l.slice(12);
            else if(l.startsWith("a=ice-pwd:")) pwd = l.slice(10);
            else if(l.startsWith("a=fingerprint:sha-256 ")) fp = l.slice(22).trim();
            else if(l.startsWith("a=setup:")) setup = l.slice(8).trim();
            else if(l.startsWith("a=candidate:")){

                const p = l.split(" ");

                if(p[1] !== "1" || p[2].toLowerCase() !== "udp" || p[6] !== "typ" || p[7] !== "host") return null;

                cands.push({ addr: p[4], porta: Number(p[5]) });

            }

        }

        if(!ufrag || !pwd || !fp || cands.length === 0 || cands.length > 15) return null;
        if(setup !== "active" && setup !== "actpass") return null;
        if(!/^[\x21-\x7e]{1,255}$/.test(ufrag) || !/^[\x21-\x7e]{1,255}$/.test(pwd)) return null;

        const fpb = fp.split(":");

        if(fpb.length !== 32) return null;

        const bytes = [(setup === "active" ? 1 : 0) | (cands.length << 1)];

        bytes.push(ufrag.length);
        for(let k = 0; k < ufrag.length; k++) bytes.push(ufrag.charCodeAt(k));

        bytes.push(pwd.length);
        for(let k = 0; k < pwd.length; k++) bytes.push(pwd.charCodeAt(k));

        for(const h of fpb){

            const v = parseInt(h, 16);

            if(!(v >= 0 && v < 256)) return null;

            bytes.push(v);

        }

        for(const c of cands){

            if(!(c.porta >= 0 && c.porta < 65536)) return null;

            const m = c.addr.match(/^([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})\.local$/i);

            if(m){

                const hex = m[1] + m[2] + m[3] + m[4] + m[5];

                bytes.push(0);

                for(let k = 0; k < 16; k++) bytes.push(parseInt(hex.substr(k * 2, 2), 16));

            }else if(/^\d+\.\d+\.\d+\.\d+$/.test(c.addr)){

                const o = c.addr.split(".").map(Number);

                if(o.some(v=> v > 255)) return null;

                bytes.push(1, o[0], o[1], o[2], o[3]);

            }else{

                return null;

            }

            bytes.push(c.porta >> 8, c.porta & 255);

        }

        const saida = new Uint8Array(bytes);

        // só usa o formato curto se reconstruir exatamente o mesmo SDP
        if(syncNormalizarSdp(syncBytesParaSdp(saida)) !== syncNormalizarSdp(sdp)) return null;

        return saida;

    }catch(e){

        return null;

    }

}

async function syncCodificar(desc){

    const limpo = syncLimparSdp(desc.sdp);
    const curto = syncSdpParaBytes(limpo);

    if(curto) return "K" + syncBytesParaTexto(curto);

    return await syncComprimir(limpo);

}

async function syncDecodificar(codigo, tipo){

    codigo = codigo.replace(/\s+/g, "");

    if(codigo[0] === "K"){

        return { type: tipo, sdp: syncBytesParaSdp(syncTextoParaBytes(codigo.slice(1))) };

    }

    const texto = await syncDescomprimir(codigo);

    // formato antigo (JSON), por garantia
    if(texto.trim().startsWith("{")) return JSON.parse(texto);

    return { type: tipo, sdp: texto.replace(/\r?\n/g, "\r\n") + "\r\n" };

}

async function syncCriarConvite(){

    syncFalhou = false;

    syncModo = "principal";

    if(syncPendente && !syncPendente.aberto && syncPendente.pc.signalingState === "have-local-offer"){

        try{ syncPendente.pc.close(); }catch(e){}

        syncPeers = syncPeers.filter(p=> p !== syncPendente);
        syncPendente = null;

    }

    const p = syncNovoPeer();

    syncConfigurarCanal(p, p.pc.createDataChannel("placar"));

    await p.pc.setLocalDescription(await p.pc.createOffer());
    await syncEsperarIce(p.pc);

    syncPendente = p;
    syncPeers.push(p);

    return await syncCodificar(p.pc.localDescription);

}

function syncIpValido(ip){

    return /^(\d{1,3}\.){3}\d{1,3}$/.test(ip) && ip.split(".").every(n=> Number(n) <= 255);

}

// troca o endereço de uma linha de candidato (a=candidate:... ou candidate:...)
function syncTrocarIp(linha, ip){

    const p = linha.split(" ");

    if(p.length > 5) p[4] = ip;

    return p.join(" ");

}

async function syncAceitarResposta(codigo, ip){

    if(!syncPendente){

        throw new Error("Primeiro toque em Criar conexão e envie o código.");

    }

    if(ip && !syncIpValido(ip)){

        throw new Error("IP inválido. Exemplo: 192.168.43.20");

    }

    const pc = syncPendente.pc;

    if(pc.signalingState === "stable"){

        throw new Error("Essa resposta já foi usada. Aguarde conectar. Se não conectar, toque em ➕ Outro celular para gerar um código novo.");

    }

    if(pc.signalingState === "closed"){

        throw new Error("Esse convite foi cancelado. Gere um código novo e refaça os passos.");

    }

    let desc;

    try{

        desc = await syncDecodificar(codigo, "answer");

    }catch(e){

        throw new Error("Código incompleto ou com algum caractere trocado. Copie de novo, inteiro.");

    }

    // se você digitou o IP do outro celular, usa ele no lugar do nome
    if(ip){

        desc = {
            type: desc.type,
            sdp: desc.sdp.split(/\r?\n/)
                .map(l=> l.startsWith("a=candidate") ? syncTrocarIp(l, ip) : l)
                .join("\r\n")
        };

    }

    try{

        await pc.setRemoteDescription(desc);

    }catch(e){

        throw new Error("Essa resposta não é deste convite (talvez o código foi refeito). Gere um código novo e refaça. Detalhe: " + e.message);

    }

}

async function syncEntrar(codigo, stun){

    syncFalhou = false;

    let desc;

    try{

        desc = await syncDecodificar(codigo, "offer");

    }catch(e){

        throw new Error("Código incompleto ou com algum caractere trocado. Copie de novo, inteiro.");

    }

    syncDesconectar(true);

    syncModo = "convidado";

    const p = syncNovoPeer(stun);

    p.pc.ondatachannel = (e)=>{ syncConfigurarCanal(p, e.channel); };

    syncPeers = [p];

    // Os endereços do principal ficam guardados e só entram quando você
    // toca em "Tentar conectar agora". Assim este celular não desiste
    // enquanto o principal ainda não colou a resposta.
    const linhas = desc.sdp.split(/\r?\n/).filter(l=> l);

    p.candRemotos = linhas.filter(l=> l.startsWith("a=candidate"));
    p.mid = (linhas.find(l=> l.startsWith("a=mid:")) || "a=mid:0").slice(6);

    const semCandidatos = linhas
        .filter(l=> !l.startsWith("a=candidate") && !l.startsWith("a=end-of-candidates"))
        .join("\r\n") + "\r\n";

    try{

        await p.pc.setRemoteDescription({ type: desc.type, sdp: semCandidatos });

    }catch(e){

        throw new Error("Esse código não é de um convite válido. Detalhe: " + e.message);

    }

    await p.pc.setLocalDescription(await p.pc.createAnswer());
    await syncEsperarIce(p.pc);

    return await syncCodificar(p.pc.localDescription);

}

// convidado: passa a usar os endereços do principal (opcionalmente com o IP digitado)
async function syncTentarAgora(ip){

    const p = syncPeers[0];

    if(!p || !p.candRemotos || p.candRemotos.length === 0){

        throw new Error("Primeiro cole o código do principal e gere a resposta.");

    }

    if(ip && !syncIpValido(ip)){

        throw new Error("IP inválido. Exemplo: 192.168.43.1");

    }

    syncFalhou = false;

    let usados = 0;

    for(const l of p.candRemotos){

        const linha = ip ? syncTrocarIp(l, ip) : l;

        try{

            await p.pc.addIceCandidate({
                candidate: linha.replace(/^a=/, ""),
                sdpMid: p.mid,
                sdpMLineIndex: 0
            });

            usados++;

        }catch(e){}

    }

    if(usados === 0) throw new Error("Não consegui usar os endereços do principal.");

    syncAtualizarStatus();

    return usados;

}

function syncDesconectar(silencioso){


    if(!silencioso) syncFalhou = false;

    syncPeers.forEach(p=>{

        try{ p.pc.close(); }catch(e){}

    });

    syncPeers = [];
    syncPendente = null;
    syncModo = null;

    if(!silencioso) syncAtualizarStatus();

}

// ---------- tela de conexão ----------

function syncConectados(){

    return syncPeers.filter(p=>p.aberto).length;

}

function syncResumoCandidatos(desc){

    if(!desc || !desc.sdp) return "nenhum";

    const c = desc.sdp.split(/\r?\n/).filter(l=> l.startsWith("a=candidate"));

    if(c.length === 0) return "nenhum";

    const tipos = {};

    c.forEach(l=>{

        const end = l.split(" ")[4] || "";
        const k = end.endsWith(".local") ? "mDNS" : (end.includes(":") ? "IPv6" : "IP");

        tipos[k] = (tipos[k] || 0) + 1;

    });

    return c.length + " (" + Object.keys(tipos).map(k=> k + (tipos[k] > 1 ? "x" + tipos[k] : "")).join(", ") + ")";

}

function syncDetalhes(){

    return syncPeers.map((p, i)=>{

        const pc = p.pc;

        return "Celular " + (i + 1)
            + ": rede=" + (pc.iceConnectionState || "?")
            + ", conexão=" + (pc.connectionState || "?")
            + ", canal=" + (p.aberto ? "aberto" : "fechado")
            + " • meus endereços: " + syncResumoCandidatos(pc.localDescription)
            + " • do outro: " + syncResumoCandidatos(pc.remoteDescription);

    }).join("\n");

}

function syncAtualizarStatus(){

    const det = document.getElementById("syncDetalhe");

    if(det){

        const atual = syncDetalhes();

        if(atual) syncUltimoDetalhe = atual;

        det.textContent = atual || syncUltimoDetalhe;

    }

    const n = syncConectados();

    const btn = document.getElementById("btnSync");

    if(btn){

        btn.textContent = n > 0 ? "📡 " + n + " conectado(s)" : "📡 Conectar";

    }

    const st = document.getElementById("syncStatus");

    if(st){

        const estados = syncPeers.map(p=> p.pc.connectionState || p.pc.iceConnectionState);

        if(n > 0){

            st.textContent = "🟢 Conectado a " + n + " celular(es)";


        }else if(syncFalhou){

            st.textContent = "🔴 Não conectou. Confira se os dois estão na mesma rede. No convidado, toque em Tentar conectar agora (pode digitar o IP). Ou gere um código novo.";

        }else if(estados.includes("connecting") || estados.includes("checking")){

            st.textContent = "🟡 Conectando...";

        }else{

            st.textContent = "⚪ Sem conexão";

        }

    }

}

async function syncCopiar(textarea){

    textarea.select();
    textarea.setSelectionRange(0, 999999);

    try{

        await navigator.clipboard.writeText(textarea.value);

        return true;

    }catch(e){

        try{ return document.execCommand("copy"); }catch(e2){ return false; }

    }

}

function syncCompartilhar(textarea){

    if(navigator.share){

        navigator.share({ text: textarea.value }).catch(()=>{});

    }else{

        syncCopiar(textarea);

    }

}

function syncAbrirTela(){

    if(!window.RTCPeerConnection){

        alert("Este navegador não suporta conexão entre celulares.");

        return;

    }

    let tela = document.getElementById("syncTela");

    if(tela){ tela.style.display = "flex"; syncAtualizarStatus(); return; }

    tela = document.createElement("div");
    tela.id = "syncTela";

    tela.innerHTML = `
<div class="syncCaixa">

<h3>📡 Conectar celulares</h3>

<p class="syncDica">
Não precisa de internet. Os dois celulares precisam estar na <b>mesma rede</b>:
o hotspot de um deles ou o mesmo Wi-Fi.
</p>

<div id="syncStatus" class="syncStatus">⚪ Sem conexão</div>
<div id="syncDetalhe" class="syncDetalhe"></div>

<div class="syncEscolha">
<button id="syncBtnPrincipal">📱 Criar conexão<br><small>(este é o principal)</small></button>
<button id="syncBtnConvidado">🔗 Entrar em uma conexão</button>
</div>

<div id="syncPrincipal" style="display:none;">

<p class="syncDica"><b>1.</b> Envie este código para o outro celular:</p>
<textarea id="syncConvite" readonly rows="4" placeholder="Gerando..."></textarea>
<div class="syncLinha">
<button id="syncCopiarConvite">📋 Copiar</button>
<button id="syncCompConvite">📤 Compartilhar</button>
</div>
<p class="syncDica">Dica: em Compartilhar, escolha Bluetooth ou Compartilhamento por proximidade (não usam internet).</p>

<p class="syncDica"><b>2.</b> Cole aqui o código de resposta dele:</p>
<textarea id="syncRespostaIn" rows="4" placeholder="Código de resposta"></textarea>
<input id="syncIpOutro" type="text" inputmode="decimal" placeholder="IP do outro celular (só se não conectar)" autocomplete="off">
<div class="syncLinha">
<button id="syncConectar">✅ Conectar</button>
<button id="syncOutro">➕ Outro celular</button>
</div>

</div>

<div id="syncConvidado" style="display:none;">

<p class="syncDica"><b>1.</b> Cole aqui o código do celular principal:</p>
<textarea id="syncConviteIn" rows="4" placeholder="Código do principal"></textarea>
<div class="syncLinha"><button id="syncGerar">⚙️ Gerar resposta</button></div>

<p class="syncDica"><b>2.</b> Envie este código de volta para o principal:</p>
<textarea id="syncRespostaOut" readonly rows="4" placeholder="A resposta aparece aqui"></textarea>
<div class="syncLinha">
<button id="syncCopiarResp">📋 Copiar</button>
<button id="syncCompResp">📤 Compartilhar</button>
</div>

<p class="syncDica"><b>3.</b> Depois que o principal tocar em Conectar, espere uns 10 segundos. Se não conectar sozinho, toque aqui:</p>
<input id="syncIpPrincipal" type="text" inputmode="decimal" placeholder="IP do principal (só se não conectar)" autocomplete="off">
<div class="syncLinha"><button id="syncTentar">🔄 Tentar conectar agora</button></div>
<p class="syncDica">Onde achar os IPs: Configurações › Wi-Fi › toque na rede › Detalhes. O <b>Endereço IP</b> é o deste celular e o <b>Gateway</b> é o do celular que liga o hotspot.</p>

</div>

<div class="syncLinha" style="margin-top:14px;">
<button id="syncDesconectar">⛔ Desconectar</button>
<button id="syncFechar">Fechar</button>
</div>

</div>`;

    document.body.appendChild(tela);

    const $ = (id)=> document.getElementById(id);

    let ocupado = false;

    async function gerarConvite(){

        if(ocupado) return;

        ocupado = true;

        $("syncConvite").value = "";
        $("syncRespostaIn").value = "";
        $("syncConvite").placeholder = "Gerando... aguarde";

        try{

            $("syncConvite").value = await syncCriarConvite();

        }catch(e){

            alert("Não foi possível criar o convite: " + e.message);

        }

        ocupado = false;

    }

    $("syncBtnPrincipal").onclick = ()=>{

        $("syncPrincipal").style.display = "block";
        $("syncConvidado").style.display = "none";

        // se já existe um código esperando resposta, mantém o mesmo
        if(syncPendente && !syncPendente.aberto && $("syncConvite").value) return;

        gerarConvite();

    };

    $("syncBtnConvidado").onclick = ()=>{

        $("syncConvidado").style.display = "block";
        $("syncPrincipal").style.display = "none";

    };

    $("syncCopiarConvite").onclick = async ()=>{

        if(await syncCopiar($("syncConvite"))) alert("Código copiado!");

    };

    $("syncCompConvite").onclick = ()=> syncCompartilhar($("syncConvite"));

    $("syncConectar").onclick = async ()=>{

        try{

            await syncAceitarResposta($("syncRespostaIn").value, $("syncIpOutro").value.trim());

            $("syncRespostaIn").value = "";

        }catch(e){

            alert(e.message);

        }

    };

    $("syncOutro").onclick = gerarConvite;

    let gerandoResp = false;

    $("syncGerar").onclick = async ()=>{

        if(gerandoResp) return;

        gerandoResp = true;

        $("syncRespostaOut").value = "";
        $("syncRespostaOut").placeholder = "Gerando... aguarde";

        try{

            $("syncRespostaOut").value = await syncEntrar($("syncConviteIn").value);

        }catch(e){

            alert(e.message);

        }

        gerandoResp = false;

    };

    $("syncCopiarResp").onclick = async ()=>{

        if(await syncCopiar($("syncRespostaOut"))) alert("Código copiado!");

    };

    $("syncCompResp").onclick = ()=> syncCompartilhar($("syncRespostaOut"));

    $("syncTentar").onclick = async ()=>{

        try{

            await syncTentarAgora($("syncIpPrincipal").value.trim());

        }catch(e){

            alert(e.message);

        }

    };

    $("syncDesconectar").onclick = ()=>{

        syncDesconectar();

        $("syncConvite").value = "";
        $("syncRespostaOut").value = "";

    };

    $("syncFechar").onclick = ()=>{ tela.style.display = "none"; };

    tela.style.display = "flex";

    syncAtualizarStatus();

    // atualiza os detalhes enquanto a tela está aberta
    setInterval(()=>{

        if(tela.style.display !== "none") syncAtualizarStatus();

    }, 1000);

}

document.getElementById("btnSync").onclick = syncAbrirTela;


// ==========================
// MODO OFFLINE (quando publicado em https, ex.: GitHub Pages)
// ==========================
// Depois da primeira abertura com internet, o app abre sem internet.
try{

    if("serviceWorker" in navigator && location.protocol === "https:"){

        window.addEventListener("load", ()=>{

            navigator.serviceWorker.register("sw.js").catch(()=>{});

        });

    }

}catch(e){}
