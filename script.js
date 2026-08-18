
const resultado =
    document.getElementById("resultado");

const expressao =
    document.getElementById("expressao");

const botoes =
    document.querySelectorAll(".botoes button");

const tema =
    document.getElementById("tema");

const listaHistorico =
    document.getElementById("listaHistorico");

const limparHistorico =
    document.getElementById("limparHistorico");

const historicoVazio =
    document.getElementById("historicoVazio");


let calculo = "";


// ==============================
// HISTÓRICO
// ==============================

let historico =
    JSON.parse(
        localStorage.getItem("historicoCalculadora")
    ) || [];


// Mostrar histórico salvo
function mostrarHistorico() {

    listaHistorico.innerHTML = "";

    if (historico.length === 0) {

        historicoVazio.style.display = "block";

        return;
    }

    historicoVazio.style.display = "none";


    historico.forEach(function(item) {

        const li =
            document.createElement("li");

        const conta =
            document.createElement("span");

        const valor =
            document.createElement("span");


        conta.textContent = item.conta;

        valor.textContent = item.resultado;


        li.appendChild(conta);

        li.appendChild(valor);

        listaHistorico.appendChild(li);

    });
}


// Salvar histórico
function adicionarHistorico(
    conta,
    valor
) {

    historico.unshift({

        conta: formatarExpressao(conta),

        resultado: valor

    });


    // Guarda somente os últimos 20 cálculos
    historico =
        historico.slice(0, 20);


    localStorage.setItem(

        "historicoCalculadora",

        JSON.stringify(historico)

    );


    mostrarHistorico();
}


// Apagar histórico
limparHistorico.addEventListener(
    "click",
    function() {

        historico = [];

        localStorage.removeItem(
            "historicoCalculadora"
        );

        mostrarHistorico();

    }
);


// ==============================
// CALCULADORA
// ==============================


// Adicionar valor
function adicionar(valor) {

    if (
        resultado.textContent === "Erro"
    ) {

        calculo = "";

        resultado.textContent = "0";
    }


    calculo += valor;


    atualizarVisor();
}


// Atualizar visor
function atualizarVisor() {

    expressao.textContent =
        formatarExpressao(calculo);


    resultado.textContent =
        calculo || "0";
}


// Formatar símbolos
function formatarExpressao(valor) {

    return valor

        .replace(/\*/g, " × ")

        .replace(/\//g, " ÷ ")

        .replace(/\+/g, " + ")

        .replace(/-/g, " − ");

}


// Limpar
function limpar() {

    calculo = "";

    expressao.textContent = "";

    resultado.textContent = "0";
}


// Apagar
function apagar() {

    calculo =
        calculo.slice(0, -1);

    atualizarVisor();
}


// ==============================
// PORCENTAGEM
// ==============================

function porcentagem() {

    if (!calculo) {

        return;
    }


    try {

        const valor =
            Function(
                `"use strict"; return (${calculo})`
            )();


        const porcentagem =
            valor / 100;


        calculo =
            porcentagem.toString();


        atualizarVisor();


    } catch {

        resultado.textContent = "Erro";

        calculo = "";
    }
}


// ==============================
// CALCULAR
// ==============================

function calcular() {

    if (!calculo) {

        return;
    }


    try {

        const contaOriginal =
            calculo;


        let valor =
            Function(
                `"use strict"; return (${calculo})`
            )();


        if (!Number.isFinite(valor)) {

            throw new Error();
        }


        valor =
            Math.round(
                (
                    valor +
                    Number.EPSILON
                ) *
                100000000
            ) /
            100000000;


        adicionarHistorico(
            contaOriginal,
            valor
        );


        expressao.textContent =
            formatarExpressao(
                contaOriginal
            );


        resultado.textContent =
            valor;


        calculo =
            valor.toString();


    } catch {

        resultado.textContent =
            "Erro";


        expressao.textContent =
            "Operação inválida";


        calculo = "";
    }
}


// ==============================
// BOTÕES
// ==============================

botoes.forEach(function(botao) {

    botao.addEventListener(
        "click",
        function() {

            const valor =
                botao.dataset.valor;

            const acao =
                botao.dataset.acao;


            if (valor !== undefined) {

                if (valor === "%") {

                    porcentagem();

                } else {

                    adicionar(valor);
                }


            } else if (
                acao === "limpar"
            ) {

                limpar();


            } else if (
                acao === "apagar"
            ) {

                apagar();


            } else if (
                acao === "calcular"
            ) {

                calcular();
            }

        }
    );

});


// ==============================
// TECLADO
// ==============================

document.addEventListener(
    "keydown",
    function(event) {

        const tecla =
            event.key;


        if (
            /[0-9+\-*/.%]/.test(tecla)
        ) {

            if (tecla === "%") {

                porcentagem();

            } else {

                adicionar(tecla);
            }
        }


        if (tecla === "Enter") {

            event.preventDefault();

            calcular();
        }


        if (
            tecla === "Backspace"
        ) {

            apagar();
        }


        if (
            tecla === "Escape"
        ) {

            limpar();
        }

    }
);


// ==============================
// TEMA
// ==============================


// Recuperar tema salvo
const temaSalvo =
    localStorage.getItem(
        "temaCalculadora"
    );


if (temaSalvo === "dark") {

    document.body.classList.add("dark");

    tema.textContent = "☾";

} else {

    tema.textContent = "☀️";
}


// Alterar tema
tema.addEventListener(
    "click",
    function() {

        document.body.classList.toggle(
            "dark"
        );


        if (
            document.body.classList.contains(
                "dark"
            )
        ) {

            tema.textContent = "☾";

            localStorage.setItem(
                "temaCalculadora",
                "dark"
            );

        } else {

            tema.textContent = "☀️";

            localStorage.setItem(
                "temaCalculadora",
                "light"
            );
        }

    }
);


// ==============================
// INICIAR
// ==============================

mostrarHistorico();
