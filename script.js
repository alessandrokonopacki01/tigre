let saldo = 0;
let nomeAluno = "";
let numeroGiros = 0;
let moedasGastas = 0;
let moedasGanhas = 0;
let rotacaoAtual = 0;
let totalMoedasCompradas = 0;
let girando = false;
const URL_PLANILHA =
    "https://script.google.com/macros/s/AKfycbzN3aouFt-RqDOMuGhegfgLi1V5KfIBvPxomH1z65RUUQ_HAVe18KipozNaF16LPg7BJg/exec";

// -------------------------
// PRÊMIOS
// -------------------------

const premios = [

    {
        nome: "Nada 😢",
        premio: 0,
        chance: 80
    },

    {
        nome: "1 moeda",
        premio: 1,
        chance: 10
    },

    {
        nome: "2 moedas",
        premio: 2,
        chance: 5
    },

    {
        nome: "3 moedas",
        premio: 5,
        chance: 3
    },

    {
        nome: "4 moeda",
        premio: 1,
        chance: 1.9
    },

    {
        nome: "5 moedas 🎉",
        premio: 5,
        chance: 0.1
    }

];


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

    if(girando){
        return;
    }

    if(saldo <= 0){

        alert("Você não possui moedas!");

        return;

    }


    girando = true;

    document
        .getElementById("btnGirar")
        .disabled = true;


    saldo--;

    numeroGiros++;

    moedasGastas++;


    document
        .getElementById("resultado")
        .innerText = "Girando...";


    const resultado = sortearPremio();


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


    setTimeout(() => {

        saldo += resultado.premio;

        moedasGanhas += resultado.premio;


        document
            .getElementById("resultado")
            .innerHTML = resultado.nome;


        adicionarHistorico(resultado);

        atualizarTela();


        girando = false;

        document
            .getElementById("btnGirar")
            .disabled = false;

    }, 4000);

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
// MODAIS DE MOEDAS
// -------------------------

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


// -------------------------
// PAGAMENTO FICTÍCIO
// -------------------------

function confirmarPagamento(quantidade, modal){

    saldo += quantidade;

    totalMoedasCompradas += quantidade;

    atualizarTela();

    fecharModal(modal);

    alert(
        `Pagamento fictício confirmado!\n+${quantidade} moedas adicionadas.`
    );

}


// -------------------------
// CARREGAR ALUNO
// -------------------------

window.addEventListener("load", () => {

    const nomeSalvo =
        localStorage.getItem("nomeAluno");

    const saldoSalvo =
        localStorage.getItem("saldoAluno");


    if(nomeSalvo){

        nomeAluno = nomeSalvo;

        saldo =
            Number(saldoSalvo) || 0;


        document
            .getElementById("nomePerfil")
            .innerText = nomeAluno;


        atualizarTela();


        // MOSTRA O AVISO TODA VEZ QUE ENTRAR
        iniciarAviso();

    }

    else{

        document
            .getElementById("modalNome")
            .style.display = "flex";

    }

});


// -------------------------
// SALVAR NOME
// -------------------------

function salvarNome(){

    const input =
        document.getElementById("nomeAluno");

    const nome =
        input.value.trim();


    if(nome.length < 2){

        alert("Digite seu nome.");

        return;

    }


    nomeAluno = nome;


    localStorage.setItem(
        "nomeAluno",
        nomeAluno
    );


    document
        .getElementById("nomePerfil")
        .innerText = nomeAluno;


    document
        .getElementById("modalNome")
        .style.display = "none";


    iniciarAviso();

}


// -------------------------
// AVISO DE 10 SEGUNDOS
// -------------------------

function iniciarAviso(){

    const modal =
        document.getElementById("modalAviso");

    const botao =
        document.getElementById("btnEntendi");


    modal.style.display = "flex";


    let segundos = 10;


    botao.disabled = true;

    botao.innerText =
        `Aguarde ${segundos} segundos...`;


    const contador =
        setInterval(() => {

            segundos--;


            if(segundos > 0){

                botao.innerText =
                    `Aguarde ${segundos} segundos...`;

            }

            else{

                clearInterval(contador);

                botao.disabled = false;

                botao.innerText =
                    "Entendi — iniciar simulação";

            }

        }, 1000);

}


// -------------------------
// FECHAR AVISO
// -------------------------

function fecharAviso(){

    document
        .getElementById("modalAviso")
        .style.display = "none";

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


    localStorage.setItem(
        "saldoAluno",
        saldo
    );

}


// -------------------------
// REGISTRAR SALDO FINAL
// -------------------------

function sacar(){

    const confirmar = confirm(
        `Encerrar a simulação?\n\n` +
        `Aluno: ${nomeAluno}\n` +
        `Saldo final: ${saldo} moedas`
    );

    if(!confirmar){
        return;
    }


    const diferenca =
        saldo - totalMoedasCompradas;


    let resultadoFinal = "";


    if(diferenca > 0){

        resultadoFinal =
            `GANHOU ${diferenca} moedas`;

    }

    else if(diferenca < 0){

        resultadoFinal =
            `PERDEU ${Math.abs(diferenca)} moedas`;

    }

    else{

        resultadoFinal =
            "NÃO GANHOU NEM PERDEU";

    }


    // ----------------------------------
    // REGISTRO LOCAL
    // ----------------------------------

    const registro = {

        nome: nomeAluno,

        investido: totalMoedasCompradas,

        saldoFinal: saldo,

        resultado: resultadoFinal,

        giros: numeroGiros,

        data:
            new Date().toLocaleString()

    };


    localStorage.setItem(
        "resultadoFinal",
        JSON.stringify(registro)
    );


    // ----------------------------------
    // MENSAGEM PARA WHATSAPP
    // ----------------------------------

    const mensagem = `
🎰 RESULTADO DA SIMULAÇÃO

👤 Aluno: ${nomeAluno}

💰 Moedas adquiridas:
${totalMoedasCompradas}

🪙 Saldo final:
${saldo}

📊 Resultado:
${resultadoFinal}

🎯 Giros realizados:
${numeroGiros}
    `;


    const numeroProfessor =
        "5542999806150";


    const urlWhatsApp =
        `https://wa.me/${numeroProfessor}?text=${encodeURIComponent(mensagem)}`;


    window.open(
        urlWhatsApp,
        "_blank"
    );

}

async function registrarAlunoNaPlanilha(){

    const dados = {
        nome: nomeAluno,
        pix: chavePix,
        depositado: 0,
        saldo: saldo,
        giros: numeroGiros
    };

    try {

        await fetch(URL_PLANILHA, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify(dados)
        });

        console.log("Aluno enviado para a planilha.");

    } catch(erro) {

        console.error(
            "Erro ao registrar aluno:",
            erro
        );

    }

}