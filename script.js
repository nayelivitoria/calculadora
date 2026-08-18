const resultado = document.getElementById("resultado");
const expressao = document.getElementById("expressao");

const botoes = document.querySelectorAll(".botoes button");

const tema = document.getElementById("tema");

const listaHistorico = document.getElementById("listaHistorico");
const limparHistorico = document.getElementById("limparHistorico");

let calculo = "";


// Adicionar números e operadores
function adicionar(valor) {

    if (resultado.textContent === "Erro") {
        calculo = "";
        resultado.textContent = "0";
    }

    calculo += valor;

    atualizarVisor();
}


// Atualizar visor
function atualizarVisor() {

    let visual = calculo
        .replace(/\*/g, " × ")
        .replace(/\//g, " ÷ ")
        .replace(/\+/g, " + ")
        .replace(/-/g, " − ");

    expressao.textContent = visual;

    resultado.textContent = calculo || "0";
}


// Limpar calculadora
function limpar() {

    calculo = "";

    expressao.textContent = "";

    resultado.textContent = "0";
}


// Apagar último número
function apagar() {

    calculo = calculo.slice(0, -1);

    atualizarVisor();
}


// Calcular
function calcular() {

    if (!calculo) {
        return;
    }

    try {

        let expressaoOriginal = calculo;

        let resultadoCalculado = Function(
            `"use strict"; return (${calculo})`
        )();

        if (!Number.isFinite(resultadoCalculado)) {
            throw new Error();
        }

        resultadoCalculado =
            Math.round(
                (resultadoCalculado + Number.EPSILON) * 100000000
            ) / 100000000;

        adicionarHistorico(
            expressaoOriginal,
            resultadoCalculado
        );

        expressao.textContent =
            expressaoOriginal
                .replace(/\*/g, " × ")
                .replace(/\//g, " ÷ ")
                .replace(/\+/g, " + ")
                .replace(/-/g, " − ");

        resultado.textContent = resultadoCalculado;

        calculo = resultadoCalculado.toString();

    } catch (erro) {

        resultado.textContent = "Erro";

        expressao.textContent = "Operação inválida";

        calculo = "";
    }
}


// Adicionar ao histórico
function adicionarHistorico(expressaoCalculada, resultadoCalculado) {

    const item = document.createElement("li");

    const conta = document.createElement("span");

    const valor = document.createElement("span");

    conta.textContent = expressaoCalculada
        .replace(/\*/g, " × ")
        .replace(/\//g, " ÷ ")
        .replace(/\+/g, " + ")
        .replace(/-/g, " − ");

    valor.textContent = resultadoCalculado;

    item.appendChild(conta);
    item.appendChild(valor);

    listaHistorico.prepend(item);
}


// Limpar histórico
limparHistorico.addEventListener("click", function () {

    listaHistorico.innerHTML = "";

});


// Funcionamento dos botões
botoes.forEach(function (botao) {

    botao.addEventListener("click", function () {

        const valor = botao.dataset.valor;

        const acao = botao.dataset.acao;

        if (valor !== undefined) {

            adicionar(valor);

        } else if (acao === "limpar") {

            limpar();

        } else if (acao === "apagar") {

            apagar();

        } else if (acao === "calcular") {

            calcular();
        }

    });

});


// Usar o teclado
document.addEventListener("keydown", function (event) {

    const tecla = event.key;

    if (/[0-9+\-*/%.]/.test(tecla)) {

        adicionar(tecla);
    }

    if (tecla === "Enter") {

        event.preventDefault();

        calcular();
    }

    if (tecla === "Backspace") {

        apagar();
    }

    if (tecla === "Escape") {

        limpar();
    }

});


// Alterar tema claro/escuro
tema.addEventListener("click", function () {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        tema.textContent = "☾";

    } else {

        tema.textContent = "☀";
    }

});
