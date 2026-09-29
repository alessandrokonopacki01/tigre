let saldo = 0;

let numeroGiros = 0;

let moedasGastas = 0;

let moedasGanhas = 0;

let rotacaoAtual = 0;

let girando = false;


// -------------------------
// PRÊMIOS
// -------------------------

const premios = [

    {
        nome: "Nada 😢",
        premio: 0,
        chance: 50
    },

    {
        nome: "1 moeda",
        premio: 1,
        chance: 25
    },

    {
        nome: "2 moedas",
        premio: 2,
        chance: 15
    },

    {
        nome: "5 moedas",
        premio: 5,
        chance: 7
    },

    {
        nome: "10 moedas",
        premio: 10,
        chance: 2.5
    },

    {
        nome: "50 moedas 🎉",
        premio: 50,
        chance: 0.5
    }

];


// -------------------------
// COMPRAR MOEDAS
// -------------------------

function comprarMoedas(quantidade){

    saldo += quantidade;

    atualizarTela();

}


// -------------------------
// ESCOLHER PRÊMIO
// -------------------------

function sortearPremio(){

    const numero = Math.random() * 100;

    let acumulado = 0;

    for(let premio of premios){

        acumulado += premio.chance;

        if(numero < acumulado){

            return premio;

        }

    }

    return premios[0];

}


// -------------------------
// GIRAR ROLETA
// -------------------------

function girar(){

    if(girando)
        return;


    if(saldo <= 0){

        alert("Você não possui moedas!");

        return;

    }


    girando = true;

    document
        .getElementById("btnGirar")
        .disabled = true;


    // CUSTO DO GIRO

    saldo--;

    numeroGiros++;

    moedasGastas++;


    document.getElementById("resultado").innerText =
        "Girando...";


    // SORTEIA RESULTADO

    const resultado = sortearPremio();


    // ANIMAÇÃO

    const voltas =
        5 + Math.floor(Math.random() * 4);

    const anguloExtra =
        Math.floor(Math.random() * 360);

    rotacaoAtual +=
        voltas * 360 + anguloExtra;


    document
        .getElementById("roleta")
        .style.transform =
        `rotate(${rotacaoAtual}deg)`;


    atualizarTela();


    // FINAL DA ANIMAÇÃO

    setTimeout(() => {

        saldo += resultado.premio;

        moedasGanhas += resultado.premio;


        document
            .getElementById("resultado")
            .innerHTML =
            `${resultado.nome}`;


        adicionarHistorico(resultado);


        atualizarTela();


        girando = false;

        document
            .getElementById("btnGirar")
            .disabled = false;

    },4000);

}


// -------------------------
// HISTÓRICO
// -------------------------

function adicionarHistorico(resultado){

    const tabela =
        document.getElementById("historico");


    const linha =
        document.createElement("tr");


    linha.innerHTML = `

        <td>
            ${numeroGiros}
        </td>

        <td>
            ${resultado.nome}
        </td>

        <td>
            +${resultado.premio}
        </td>

    `;


    tabela.prepend(linha);

}


// -------------------------
// ATUALIZAR TELA
// -------------------------

function atualizarTela(){

    document
        .getElementById("saldo")
        .innerText = saldo;


    document
        .getElementById("giros")
        .innerText = numeroGiros;


    document
        .getElementById("gastas")
        .innerText = moedasGastas;


    document
        .getElementById("ganhas")
        .innerText = moedasGanhas;

}
function abrirModal(id){

    document
        .getElementById(id)
        .style.display = "flex";

}


function fecharModal(id){

    document
        .getElementById(id)
        .style.display = "none";

}


function confirmarPagamento(quantidade, modal){

    saldo += quantidade;

    atualizarTela();

    fecharModal(modal);

    alert(
        `Pagamento fictício confirmado!\n+${quantidade} moedas adicionadas.`
    );

}