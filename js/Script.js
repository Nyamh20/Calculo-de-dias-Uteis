// selecao de elementos
const btnData = document.querySelector("#btn")
const inputPrazo = document.querySelector("#dias")
const inputData = document.querySelector("#data")
const result = document.querySelector("#result")
const show = document.querySelector("#show")

let prazo
let mes;
let dia;

// feriados
const feriadosFixos = [
    "01-01", // Ano Novo
    "04-21", // Tiradentes
    "05-01", // Dia do Trabalho
    "06-19", //Corpus Christi
    "09-07", //Independência do Brasil
    "09-07", // Independência
    "10-12", // Nossa Senhora Aparecida
    "10-15", // Dia Do Professor
    "10-28", // Dia do Servidor Publico
    "11-02", // Finados
    "11-15", // Proclamação da República
    "11-20", //Consciência Negra
    "12-25", // Natal
    "07-26", // Fundação do Estado de Goiás (estadual)
    "06-07", // Aniversário de Anicuns
    "10-04"  // São Francisco de Assis (padroeiro)
];

const diaMeses = (mes) => {
    if (mes === 1) {
        return 31
    }
    if (mes === 2) {
        return 28
    }
    if (mes === 3) {
        return 31
    }
    if (mes === 4) {
        return 30
    }
    if (mes === 5) {
        return 31
    }
    if (mes === 6) {
        return 30
    }
    if (mes === 7) {
        return 31
    }
    if (mes === 8) {
        return 31
    }
    if (mes === 9) {
        return 30
    }
    if (mes === 10) {
        return 31
    }
    if (mes === 11) {
        return 30
    }
    if (mes === 12) {
        return 31
    }
}


// funcao

const eFeriado = (mes, dia) => {
    // funcao some semelhante ao foreach, percorre todos os elementos do array, retorna true e para a execucao e se nao atender retorna false
    return feriadosFixos.some((d) => {
        const date = d.split("-")
        return Number(date[0]) === mes && Number(date[1]) === dia
    })
}

function eFinalDeSemana(data) {
    const diaSemana = data.getDay()
    return diaSemana === 0 || diaSemana === 6
}

function recessoFeriado(data) {
    const recesso = data.getDay()
    return recesso === 2 || recesso === 4
}

const diasUteis = (d) => {
    const data = d.split("-")
    prazo = 1
    ano = Number(data[0])
    mes = Number(data[1])
    dia = Number(data[2])
    while (true) {
        while (mes < 13) {
            while (dia < diaMeses(mes)) {
                dia++

                if (eFinalDeSemana(new Date(ano, mes - 1, dia)) || eFeriado(mes, dia)) {
                    if (!(eFinalDeSemana(new Date(ano, mes - 1, dia))) && recessoFeriado(new Date(ano, mes - 1, dia))) {
                        prazo--
                    }
                    prazo--
                }
                if (prazo >= inputPrazo.value) {
                    return dia
                }
                prazo++
            }
            mes++
            dia = 0
        }
        ano++
        mes = 1
    }
}

// eventos
btnData.addEventListener("click", () => {
    const dias = diasUteis(inputData.value)
    show.innerText = `O dia útil final é: ${dias}/${mes}/${ano}`
    result.style.display = "block"
})