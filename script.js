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

            syncPeers = syncPeers.filter(x=> x !== p);

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

        // entrou na sala: não precisa mais ouvir o serviço
        if(syncSala && syncSala.modo == "convidado"){

            syncSalaSair();

            syncSalaMsg("🟢 Conectado!");

        }

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

// ---------- gerador de QR Code (sem internet, sem biblioteca) ----------

const QR_ECC = {
    L: {
        bits: 1,
        cw: [-1,7,10,15,20,26,18,20,24,30,18,20,24,26,30,22,24,28,30,28,28,28,28,30,30,26,28,30,30,30,30,30,30,30,30,30,30,30,30,30,30],
        blocos: [-1,1,1,1,1,1,2,2,2,2,4,4,4,4,4,6,6,6,6,7,8,8,9,9,10,12,12,12,13,14,15,16,17,18,19,19,20,21,22,24,25]
    },
    M: {
        bits: 0,
        cw: [-1,10,16,26,18,24,16,18,22,22,26,30,22,22,24,24,28,28,26,26,26,26,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28],
        blocos: [-1,1,1,1,2,2,4,4,4,5,5,5,8,9,9,10,10,11,13,14,16,17,17,18,20,21,23,25,26,28,29,31,33,35,37,38,40,43,45,47,49]
    }
};

function qrModulosBrutos(ver){

    let r = (16 * ver + 128) * ver + 64;

    if(ver >= 2){

        const na = Math.floor(ver / 7) + 2;

        r -= (25 * na - 10) * na - 55;

        if(ver >= 7) r -= 36;

    }

    return r;

}

function qrCapacidade(ver, ecc){

    return Math.floor(qrModulosBrutos(ver) / 8) - QR_ECC[ecc].cw[ver] * QR_ECC[ecc].blocos[ver];

}

function qrMul(x, y){

    let z = 0;

    for(let i = 7; i >= 0; i--){

        z = (z << 1) ^ ((z >>> 7) * 0x11D);
        z ^= ((y >>> i) & 1) * x;

    }

    return z;

}

function qrDivisor(grau){

    const r = new Array(grau).fill(0);

    r[grau - 1] = 1;

    let raiz = 1;

    for(let i = 0; i < grau; i++){

        for(let j = 0; j < r.length; j++){

            r[j] = qrMul(r[j], raiz);

            if(j + 1 < r.length) r[j] ^= r[j + 1];

        }

        raiz = qrMul(raiz, 2);

    }

    return r;

}

function qrResto(dados, divisor){

    const r = divisor.map(()=> 0);

    dados.forEach(b=>{

        const f = b ^ r.shift();

        r.push(0);

        divisor.forEach((c, i)=>{ r[i] ^= qrMul(c, f); });

    });

    return r;

}

function qrCodewords(bytes, ver, ecc){

    const bits = [];

    const add = (v, n)=>{

        for(let i = n - 1; i >= 0; i--) bits.push((v >>> i) & 1);

    };

    add(4, 4);
    add(bytes.length, ver <= 9 ? 8 : 16);
    bytes.forEach(b=> add(b, 8));

    const cap = qrCapacidade(ver, ecc) * 8;

    add(0, Math.min(4, cap - bits.length));
    add(0, (8 - bits.length % 8) % 8);

    for(let pad = 0xEC; bits.length < cap; pad ^= 0xEC ^ 0x11) add(pad, 8);

    const dados = [];

    for(let i = 0; i < bits.length; i += 8){

        let v = 0;

        for(let j = 0; j < 8; j++) v = (v << 1) | bits[i + j];

        dados.push(v);

    }

    const nb = QR_ECC[ecc].blocos[ver];
    const el = QR_ECC[ecc].cw[ver];
    const raw = Math.floor(qrModulosBrutos(ver) / 8);
    const nCurtos = nb - raw % nb;
    const tamCurto = Math.floor(raw / nb);
    const divisor = qrDivisor(el);
    const blocos = [];

    for(let i = 0, k = 0; i < nb; i++){

        const len = tamCurto - el + (i < nCurtos ? 0 : 1);
        const d = dados.slice(k, k + len);

        k += len;

        const e = qrResto(d, divisor);

        if(i < nCurtos) d.push(0);

        blocos.push(d.concat(e));

    }

    const saida = [];

    for(let i = 0; i < blocos[0].length; i++){

        blocos.forEach((b, j)=>{

            if(i != tamCurto - el || j >= nCurtos) saida.push(b[i]);

        });

    }

    return saida;

}

function qrAlinhamento(ver){

    if(ver == 1) return [];

    const na = Math.floor(ver / 7) + 2;
    const passo = (ver == 32) ? 26 : Math.ceil((ver * 4 + 4) / (na * 2 - 2)) * 2;
    const tam = ver * 4 + 17;
    const r = [6];

    for(let pos = tam - 7; r.length < na; pos -= passo) r.splice(1, 0, pos);

    return r;

}

function qrPenalidade(m){

    const n = m.length;
    let p = 0;

    const linhas = m.map(l=> l.map(v=> v ? "1" : "0").join(""));
    const colunas = [];

    for(let x = 0; x < n; x++){

        let s = "";

        for(let y = 0; y < n; y++) s += m[y][x] ? "1" : "0";

        colunas.push(s);

    }

    linhas.concat(colunas).forEach(s=>{

        (s.match(/0+|1+/g) || []).forEach(r=>{ if(r.length >= 5) p += 3 + (r.length - 5); });

        p += 40 * ((s.match(/(?=10111010000)/g) || []).length);
        p += 40 * ((s.match(/(?=00001011101)/g) || []).length);

    });

    for(let y = 0; y < n - 1; y++){

        for(let x = 0; x < n - 1; x++){

            const c = m[y][x];

            if(c == m[y][x+1] && c == m[y+1][x] && c == m[y+1][x+1]) p += 3;

        }

    }

    let escuros = 0;

    m.forEach(l=> l.forEach(v=>{ if(v) escuros++; }));

    const total = n * n;

    p += (Math.ceil(Math.abs(escuros * 20 - total * 10) / total) - 1) * 10;

    return p;

}

function qrMatriz(bytes, ecc){

    let ver = 1;

    for(; ver <= 40; ver++){

        if(4 + (ver <= 9 ? 8 : 16) + bytes.length * 8 <= qrCapacidade(ver, ecc) * 8) break;

    }

    if(ver > 40) return null;

    const tam = ver * 4 + 17;
    const mod = Array.from({ length: tam }, ()=> new Array(tam).fill(false));
    const fun = Array.from({ length: tam }, ()=> new Array(tam).fill(false));

    const set = (x, y, v)=>{ mod[y][x] = v; fun[y][x] = true; };

    for(let i = 0; i < tam; i++){

        set(6, i, i % 2 == 0);
        set(i, 6, i % 2 == 0);

    }

    const localizador = (cx, cy)=>{

        for(let dy = -4; dy <= 4; dy++){

            for(let dx = -4; dx <= 4; dx++){

                const x = cx + dx;
                const y = cy + dy;
                const d = Math.max(Math.abs(dx), Math.abs(dy));

                if(x >= 0 && x < tam && y >= 0 && y < tam) set(x, y, d != 2 && d != 4);

            }

        }

    };

    localizador(3, 3);
    localizador(tam - 4, 3);
    localizador(3, tam - 4);

    const alin = qrAlinhamento(ver);
    const na = alin.length;

    for(let i = 0; i < na; i++){

        for(let j = 0; j < na; j++){

            if((i == 0 && j == 0) || (i == 0 && j == na - 1) || (i == na - 1 && j == 0)) continue;

            for(let dy = -2; dy <= 2; dy++){

                for(let dx = -2; dx <= 2; dx++){

                    set(alin[i] + dx, alin[j] + dy, Math.max(Math.abs(dx), Math.abs(dy)) != 1);

                }

            }

        }

    }

    const formato = (mascara)=>{

        const dados = (QR_ECC[ecc].bits << 3) | mascara;
        let rem = dados;

        for(let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);

        const b = ((dados << 10) | rem) ^ 0x5412;
        const bit = (i)=> ((b >>> i) & 1) != 0;

        for(let i = 0; i <= 5; i++) set(8, i, bit(i));

        set(8, 7, bit(6));
        set(8, 8, bit(7));
        set(7, 8, bit(8));

        for(let i = 9; i < 15; i++) set(14 - i, 8, bit(i));
        for(let i = 0; i < 8; i++) set(tam - 1 - i, 8, bit(i));
        for(let i = 8; i < 15; i++) set(8, tam - 15 + i, bit(i));

        set(8, tam - 8, true);

    };

    formato(0);

    if(ver >= 7){

        let rem = ver;

        for(let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1F25);

        const b = (ver << 12) | rem;

        for(let i = 0; i < 18; i++){

            const cor = ((b >>> i) & 1) != 0;
            const a = tam - 11 + i % 3;
            const c = Math.floor(i / 3);

            set(a, c, cor);
            set(c, a, cor);

        }

    }

    const cw = qrCodewords(bytes, ver, ecc);
    let k = 0;

    for(let dir = tam - 1; dir >= 1; dir -= 2){

        if(dir == 6) dir = 5;

        for(let vert = 0; vert < tam; vert++){

            for(let j = 0; j < 2; j++){

                const x = dir - j;
                const sobe = ((dir + 1) & 2) == 0;
                const y = sobe ? tam - 1 - vert : vert;

                if(!fun[y][x] && k < cw.length * 8){

                    mod[y][x] = ((cw[k >>> 3] >>> (7 - (k & 7))) & 1) != 0;
                    k++;

                }

            }

        }

    }

    const mascaras = [
        (x, y)=> (x + y) % 2 == 0,
        (x, y)=> y % 2 == 0,
        (x, y)=> x % 3 == 0,
        (x, y)=> (x + y) % 3 == 0,
        (x, y)=> (Math.floor(x / 3) + Math.floor(y / 2)) % 2 == 0,
        (x, y)=> x * y % 2 + x * y % 3 == 0,
        (x, y)=> (x * y % 2 + x * y % 3) % 2 == 0,
        (x, y)=> ((x + y) % 2 + x * y % 3) % 2 == 0
    ];

    const aplicar = (mi)=>{

        for(let y = 0; y < tam; y++){

            for(let x = 0; x < tam; x++){

                if(!fun[y][x] && mascaras[mi](x, y)) mod[y][x] = !mod[y][x];

            }

        }

    };

    let melhor = 0;
    let melhorPen = Infinity;

    for(let mi = 0; mi < 8; mi++){

        aplicar(mi);
        formato(mi);

        const pen = qrPenalidade(mod);

        if(pen < melhorPen){ melhorPen = pen; melhor = mi; }

        aplicar(mi);

    }

    aplicar(melhor);
    formato(melhor);

    return mod;

}

function syncQrMatrizDe(texto){

    const bytes = Array.from(new TextEncoder().encode(texto));

    return qrMatriz(bytes, "M") || qrMatriz(bytes, "L");

}

function syncDesenharQr(canvas, texto){

    const m = syncQrMatrizDe(texto);

    if(!m){

        canvas.style.display = "none";

        return false;

    }

    const borda = 4;
    const total = m.length + borda * 2;
    const px = Math.max(4, Math.ceil(320 / total));

    canvas.width = total * px;
    canvas.height = total * px;

    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000000";

    for(let y = 0; y < m.length; y++){

        for(let x = 0; x < m.length; x++){

            if(m[y][x]) ctx.fillRect((x + borda) * px, (y + borda) * px, px, px);

        }

    }

    canvas.style.display = "block";

    return true;

}

// ---------- leitor de QR Code pela câmera ----------

async function syncEscanear(){

    let detector;

    try{

        detector = new BarcodeDetector({ formats: ["qr_code"] });

    }catch(e){

        alert("Aqui dentro não dá para ler QR Code. Escaneie com a câmera do próprio celular, copie o texto e cole em \"Usar código em texto\".");

        return false;

    }

    if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){

        alert("Aqui dentro a câmera não está disponível. Escaneie com a câmera do próprio celular, copie o texto e cole em \"Usar código em texto\".");

        return false;

    }

    let stream;

    try{

        stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: "environment" } },
            audio: false
        });

    }catch(e){

        alert("Não consegui abrir a câmera aqui dentro. Escaneie com a câmera do próprio celular, copie o texto e cole em \"Usar código em texto\".");

        return false;

    }

    const tela = document.createElement("div");

    tela.id = "syncCam";

    tela.innerHTML = '<video playsinline muted></video>'
        + '<p>Aponte a câmera para o QR Code do outro celular</p>'
        + '<button type="button">Cancelar</button>';

    document.body.appendChild(tela);

    const video = tela.querySelector("video");

    video.srcObject = stream;

    try{ await video.play(); }catch(e){}

    return new Promise(resolve=>{

        let ativo = true;

        const fechar = (valor)=>{

            ativo = false;

            stream.getTracks().forEach(t=> t.stop());

            tela.remove();

            resolve(valor);

        };

        tela.querySelector("button").onclick = ()=> fechar(null);

        const ciclo = async ()=>{

            if(!ativo) return;

            try{

                const r = await detector.detect(video);

                if(r.length > 0 && r[0].rawValue){

                    fechar(r[0].rawValue);

                    return;

                }

            }catch(e){}

            setTimeout(ciclo, 150);

        };

        ciclo();

    });

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

async function syncAceitarResposta(codigo){

    if(!syncPendente){

        throw new Error("Primeiro toque em Criar conexão e envie o código.");

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

    try{

        await p.pc.setRemoteDescription(desc);

    }catch(e){

        throw new Error("Esse código não é de um convite válido. Detalhe: " + e.message);

    }

    await p.pc.setLocalDescription(await p.pc.createAnswer());
    await syncEsperarIce(p.pc);

    return await syncCodificar(p.pc.localDescription);

}

function syncDesconectar(silencioso){

    if(!silencioso) syncSalaSair();

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

function syncAtualizarStatus(){

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

            st.textContent = "🔴 Não conectou. Confira se os dois estão no mesmo hotspot ou Wi-Fi e tente de novo com um código novo.";

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

// ---------- sala com usuário e senha (precisa de internet) ----------
// Os dois celulares digitam o mesmo usuário e senha. Disso sai um nome
// secreto de sala (a senha não é guardada em lugar nenhum). Por esse nome
// eles trocam os códigos de conexão usando um serviço público de mensagens
// (ntfy.sh). Depois de conectados, os pontos passam direto entre os celulares.

const SYNC_SERVICO = "https://ntfy.sh/";

let syncSala = null;

function syncSalaMsg(texto){

    const el = document.getElementById("syncSalaMsg");

    if(el) el.textContent = texto;

}

async function syncHashSala(usuario, senha){

    const txt = normalizarNome(usuario) + "|" + senha;

    try{

        const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(txt));

        return Array.from(new Uint8Array(buf))
            .map(b=> b.toString(16).padStart(2, "0"))
            .join("");

    }catch(e){

        // plano B simples (quando o navegador não oferece SHA-256)
        let h1 = 0xdeadbeef ^ txt.length;
        let h2 = 0x41c6ce57 ^ txt.length;
        let h3 = 0x9e3779b9;
        let h4 = 0x85ebca6b;

        for(let i = 0; i < txt.length; i++){

            const ch = txt.charCodeAt(i);

            h1 = Math.imul(h1 ^ ch, 2654435761);
            h2 = Math.imul(h2 ^ ch, 1597334677);
            h3 = Math.imul(h3 ^ ch, 2246822519);
            h4 = Math.imul(h4 ^ ch, 3266489917);

        }

        return [h1, h2, h3, h4]
            .map(v=> (v >>> 0).toString(16).padStart(8, "0"))
            .join("");

    }

}

function syncSalaSair(){

    if(!syncSala) return;

    try{ if(syncSala.es) syncSala.es.close(); }catch(e){}

    if(syncSala.timer) clearInterval(syncSala.timer);

    syncSala = null;

}

async function syncSalaEnviar(msg){

    if(!syncSala) return;

    const r = await fetch(SYNC_SERVICO + syncSala.topico, {
        method: "POST",
        body: JSON.stringify(msg)
    });

    if(!r.ok) throw new Error("O serviço respondeu " + r.status);

}

function syncSalaAbrir(){

    return new Promise((resolve, reject)=>{

        const es = new EventSource(SYNC_SERVICO + syncSala.topico + "/sse");

        syncSala.es = es;

        let aberto = false;

        const limite = setTimeout(()=>{

            if(!aberto){

                try{ es.close(); }catch(e){}

                reject(new Error("Sem internet ou o serviço não respondeu."));

            }

        }, 8000);

        es.onopen = ()=>{

            aberto = true;

            clearTimeout(limite);

            resolve();

        };

        es.onmessage = (ev)=>{

            let d, m;

            try{ d = JSON.parse(ev.data); }catch(e){ return; }

            if(d.event && d.event !== "message") return;

            try{ m = JSON.parse(d.message); }catch(e){ return; }

            syncSalaReceber(m);

        };

    });

}

// cria um convite para um celular que está entrando na sala
async function syncCriarConviteSala(){

    syncModo = "principal";

    const p = syncNovoPeer(true);

    syncConfigurarCanal(p, p.pc.createDataChannel("placar"));

    await p.pc.setLocalDescription(await p.pc.createOffer());
    await syncEsperarIce(p.pc);

    syncPeers.push(p);

    return { p: p, codigo: await syncCodificar(p.pc.localDescription) };

}

async function syncAplicarRespostaPeer(p, codigo){

    const desc = await syncDecodificar(codigo, "answer");

    if(p.pc.signalingState !== "have-local-offer") return;

    await p.pc.setRemoteDescription(desc);

}

async function syncSalaReceber(m){

    if(!syncSala || !m) return;

    if(syncSala.modo === "principal"){

        if(m.k === "oi" && m.id){

            let e = syncSala.convidados[m.id];

            if(!e){

                e = { p: null, codigo: null, respondido: false };

                syncSala.convidados[m.id] = e;

                try{

                    const r = await syncCriarConviteSala();

                    e.p = r.p;
                    e.codigo = r.codigo;

                }catch(err){

                    delete syncSala.convidados[m.id];

                    return;

                }

            }

            if(e.codigo && !e.respondido){

                syncSalaEnviar({ k: "of", para: m.id, c: e.codigo }).catch(()=>{});

            }

        }else if(m.k === "re" && m.de && syncSala.convidados[m.de]){

            const e = syncSala.convidados[m.de];

            if(!e.p || e.respondido) return;

            e.respondido = true;

            try{

                await syncAplicarRespostaPeer(e.p, m.c);

            }catch(err){

                e.respondido = false;

            }

        }

    }else if(syncSala.modo === "convidado"){

        if(m.k === "of" && m.para === syncSala.id && !syncSala.respondeu){

            syncSala.respondeu = true;

            syncSalaMsg("Conectando...");

            try{

                const resposta = await syncEntrar(m.c, true);

                await syncSalaEnviar({ k: "re", de: syncSala.id, c: resposta });

                setTimeout(()=>{

                    if(syncSala && syncConectados() === 0){

                        syncSalaMsg("Não conectou. Confira se os dois têm internet e tente de novo. Em redes diferentes (por exemplo 4G e Wi-Fi) pode falhar.");

                    }

                }, 25000);

            }catch(err){

                if(syncSala) syncSala.respondeu = false;

                syncSalaMsg("⚠️ Não consegui conectar: " + err.message);

            }

        }

    }

}

async function syncSalaCriar(usuario, senha){

    syncFalhou = false;

    syncSalaSair();

    const hash = await syncHashSala(usuario, senha);

    syncSala = {
        topico: "vt" + hash.slice(0, 40),
        modo: "principal",
        convidados: {},
        es: null,
        timer: null
    };

    syncModo = "principal";

    try{

        await syncSalaAbrir();

    }catch(e){

        syncSalaSair();

        throw e;

    }

}

async function syncSalaEntrar(usuario, senha){

    syncFalhou = false;

    syncSalaSair();

    const hash = await syncHashSala(usuario, senha);

    syncSala = {
        topico: "vt" + hash.slice(0, 40),
        modo: "convidado",
        id: Math.random().toString(36).slice(2, 10),
        respondeu: false,
        tentativas: 0,
        es: null,
        timer: null
    };

    try{

        await syncSalaAbrir();

    }catch(e){

        syncSalaSair();

        throw e;

    }

    const chamar = ()=>{

        if(!syncSala || syncSala.respondeu) return;

        if(syncSala.tentativas >= 6){

            clearInterval(syncSala.timer);

            syncSalaMsg("Ninguém criou essa sala ainda. Confira o usuário e a senha e tente de novo.");

            return;

        }

        syncSala.tentativas++;

        syncSalaEnviar({ k: "oi", id: syncSala.id }).catch(()=>{

            syncSalaMsg("Não consegui falar com o serviço. Confira a internet.");

        });

    };

    chamar();

    syncSala.timer = setInterval(chamar, 4000);

}

function syncAbrirTela(){

    if(!window.RTCPeerConnection){

        alert("Este navegador não suporta conexão entre celulares. Abra o app no Chrome.");

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
Os dois celulares precisam estar na <b>mesma rede</b>: o hotspot de um deles
(não precisa de internet) ou o mesmo Wi-Fi.
</p>

<div id="syncStatus" class="syncStatus">⚪ Sem conexão</div>

<div class="syncEscolha">
<button id="syncBtnPrincipal">📱 Criar conexão<br><small>(este é o principal)</small></button>
<button id="syncBtnConvidado">🔗 Entrar em uma conexão</button>
</div>

<div class="syncEscolha">
<button id="syncBtnSala">🔑 Sala com usuário e senha<br><small>(precisa de internet)</small></button>
</div>

<div id="syncSalaPainel" style="display:none;">
<p class="syncDica">
Os dois celulares digitam o <b>mesmo usuário e senha</b>. Precisa de internet nos dois.
Evite usuário e senha comuns, para ninguém cair na sua sala por acaso.
</p>
<input id="syncUsuario" type="text" placeholder="Usuário" autocomplete="off" autocapitalize="none">
<input id="syncSenha" type="password" placeholder="Senha (mínimo 4 caracteres)" autocomplete="off">
<div class="syncLinha">
<button id="syncSalaCriar">🏠 Criar sala</button>
<button id="syncSalaEntrar">🚪 Entrar na sala</button>
</div>
<div id="syncSalaMsg" class="syncDica"></div>
</div>

<div id="syncPrincipal" style="display:none;">

<p class="syncDica"><b>1.</b> No outro celular, toque em <b>Entrar em uma conexão</b> e escaneie este QR Code:</p>
<canvas id="syncQrConvite" class="syncQr"></canvas>

<p class="syncDica"><b>2.</b> Quando o outro celular mostrar o QR Code dele, escaneie:</p>
<div class="syncLinha">
<button id="syncEscResp">📷 Escanear resposta</button>
<button id="syncOutro">➕ Outro celular</button>
</div>

<details class="syncTexto">
<summary>Usar código em texto</summary>
<p class="syncDica">Envie este código para o outro celular:</p>
<textarea id="syncConvite" readonly rows="3" placeholder="Gerando..."></textarea>
<div class="syncLinha">
<button id="syncCopiarConvite">📋 Copiar</button>
<button id="syncCompConvite">📤 Compartilhar</button>
</div>
<p class="syncDica">Cole aqui o código de resposta dele:</p>
<textarea id="syncRespostaIn" rows="3" placeholder="Código de resposta"></textarea>
<div class="syncLinha"><button id="syncConectar">✅ Conectar</button></div>
</details>

</div>

<div id="syncConvidado" style="display:none;">

<p class="syncDica"><b>1.</b> Escaneie o QR Code do celular principal:</p>
<div class="syncLinha"><button id="syncEscConv">📷 Escanear código</button></div>

<p class="syncDica"><b>2.</b> Mostre este QR Code para o celular principal escanear:</p>
<canvas id="syncQrResp" class="syncQr"></canvas>

<details class="syncTexto">
<summary>Usar código em texto</summary>
<p class="syncDica">Cole aqui o código do celular principal:</p>
<textarea id="syncConviteIn" rows="3" placeholder="Código do principal"></textarea>
<div class="syncLinha"><button id="syncGerar">⚙️ Gerar resposta</button></div>
<p class="syncDica">Envie este código de volta para o principal:</p>
<textarea id="syncRespostaOut" readonly rows="3" placeholder="A resposta aparece aqui"></textarea>
<div class="syncLinha">
<button id="syncCopiarResp">📋 Copiar</button>
<button id="syncCompResp">📤 Compartilhar</button>
</div>
</details>

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
        $("syncQrConvite").style.display = "none";
        $("syncConvite").placeholder = "Gerando... aguarde";

        try{

            const codigo = await syncCriarConvite();

            $("syncConvite").value = codigo;

            syncDesenharQr($("syncQrConvite"), codigo);

        }catch(e){

            alert("Não foi possível criar o convite: " + e.message);

        }

        ocupado = false;

    }

    $("syncBtnPrincipal").onclick = ()=>{

        $("syncPrincipal").style.display = "block";
        $("syncConvidado").style.display = "none";
        $("syncSalaPainel").style.display = "none";

        // se já existe um código esperando resposta, mantém o mesmo
        if(syncPendente && !syncPendente.aberto && $("syncConvite").value) return;

        gerarConvite();

    };

    $("syncBtnConvidado").onclick = ()=>{

        $("syncConvidado").style.display = "block";
        $("syncPrincipal").style.display = "none";
        $("syncSalaPainel").style.display = "none";

    };

    $("syncBtnSala").onclick = ()=>{

        $("syncSalaPainel").style.display = "block";
        $("syncPrincipal").style.display = "none";
        $("syncConvidado").style.display = "none";

    };

    const lerSala = ()=>{

        const u = $("syncUsuario").value.trim();
        const senha = $("syncSenha").value;

        if(!u || senha.length < 4){

            alert("Digite o usuário e uma senha com pelo menos 4 caracteres.");

            return null;

        }

        return { u: u, s: senha };

    };

    $("syncSalaCriar").onclick = async ()=>{

        const d = lerSala();

        if(!d) return;

        syncSalaMsg("Criando a sala...");

        try{

            await syncSalaCriar(d.u, d.s);

            syncSalaMsg("✅ Sala criada. No outro celular, toque em Entrar na sala com o mesmo usuário e senha.");

        }catch(e){

            syncSalaMsg("⚠️ " + e.message);

        }

    };

    $("syncSalaEntrar").onclick = async ()=>{

        const d = lerSala();

        if(!d) return;

        syncSalaMsg("Procurando a sala...");

        try{

            await syncSalaEntrar(d.u, d.s);

        }catch(e){

            syncSalaMsg("⚠️ " + e.message);

        }

    };

    $("syncCopiarConvite").onclick = async ()=>{

        if(await syncCopiar($("syncConvite"))) alert("Código copiado!");

    };

    $("syncCompConvite").onclick = ()=> syncCompartilhar($("syncConvite"));

    $("syncConectar").onclick = async ()=>{

        try{

            await syncAceitarResposta($("syncRespostaIn").value);

            $("syncRespostaIn").value = "";

        }catch(e){

            alert(e.message);

        }

    };

    $("syncEscResp").onclick = async ()=>{

        const lido = await syncEscanear();

        if(lido === false){ $("syncPrincipal").querySelector("details").open = true; return; }

        if(!lido) return;

        $("syncRespostaIn").value = lido;

        $("syncConectar").onclick();

    };

    $("syncOutro").onclick = gerarConvite;

    let gerandoResp = false;

    async function gerarResposta(){

        if(gerandoResp) return;

        gerandoResp = true;

        $("syncRespostaOut").value = "";
        $("syncQrResp").style.display = "none";
        $("syncRespostaOut").placeholder = "Gerando... aguarde";

        try{

            const codigo = await syncEntrar($("syncConviteIn").value);

            $("syncRespostaOut").value = codigo;

            syncDesenharQr($("syncQrResp"), codigo);

        }catch(e){

            alert(e.message);

        }

        gerandoResp = false;

    }

    $("syncGerar").onclick = gerarResposta;

    $("syncEscConv").onclick = async ()=>{

        const lido = await syncEscanear();

        if(lido === false){ $("syncConvidado").querySelector("details").open = true; return; }

        if(!lido) return;

        $("syncConviteIn").value = lido;

        gerarResposta();

    };

    $("syncCopiarResp").onclick = async ()=>{

        if(await syncCopiar($("syncRespostaOut"))) alert("Código copiado!");

    };

    $("syncCompResp").onclick = ()=> syncCompartilhar($("syncRespostaOut"));

    $("syncDesconectar").onclick = ()=>{

        syncDesconectar();

        syncSalaMsg("");

        $("syncConvite").value = "";
        $("syncRespostaOut").value = "";
        $("syncQrConvite").style.display = "none";
        $("syncQrResp").style.display = "none";

    };

    $("syncFechar").onclick = ()=>{ tela.style.display = "none"; };

    tela.style.display = "flex";

    syncAtualizarStatus();

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
