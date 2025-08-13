// selecao de elementos
const todoForm = document.querySelector("#todo-form")
const todoTituloInput = document.querySelector("#todo-titulo")
const todoDateInput = document.querySelector("#todo-date")
const todoPrazoInput = document.querySelector("#todo-prazo")
const todoList = document.querySelector("#todo-list")
const editForm = document.querySelector("#edit-form")
const editTituloInput = document.querySelector("#edit-titulo")
const editDateInput = document.querySelector("#edit-date")
const editPrazoInput = document.querySelector("#edit-prazo")
const cancelEditBtn = document.querySelector("#cancel-edit-btn")
const searchInput = document.querySelector("#search-input")
const eraseBtn = document.querySelector("#erase-button")
const filterBtn = document.querySelector("#filter-select")

const btnBaixarinput = document.querySelector("#btn-baixar")

let oldTituloInputValue
let oldDateInputValue

let prazo
let mes;
let dia;

// funcoes
const saveTodo = (text, date, prazo, done = 0, save = 1) => {
    const todo = document.createElement("div")
    todo.classList.add("todo")

    const container = document.createElement("div")
    container.classList.add("container")

    const todoTitle = document.createElement("h3")
    const todoDateStart = document.createElement("p")
    const todoP = document.createElement("p")
    const todoDate = document.createElement("span")
    todoDate.classList.add("todoDateEnd")
    const todoDateStartSpan = document.createElement("span")
    todoDateStartSpan.classList.add("todoDateStart")

    dateEnd = diasUteis(date, prazo)

    todoDateStartSpan.innerText = date
    todoDateStart.innerText = "Data início: "
    todoDateStart.appendChild(todoDateStartSpan)
    todoDate.innerText = dateEnd
    todoTitle.innerText = text
    todoP.innerText = `Vencimento: `
    todoP.appendChild(todoDate)
    container.appendChild(todoTitle)
    container.appendChild(todoDateStart)
    container.appendChild(todoP)
    todo.appendChild(container)

    const donebtn = document.createElement("button")
    donebtn.classList.add("finish-todo")
    donebtn.innerHTML = '<i class="fa-solid fa-check"></i>'
    todo.appendChild(donebtn)

    const editTodo = document.createElement("button")
    editTodo.classList.add("edit-todo")
    editTodo.innerHTML = '<i class="fa-solid fa-pen"></i>'
    todo.appendChild(editTodo)

    const removeTodo = document.createElement("button")
    removeTodo.classList.add("remove-todo")
    removeTodo.innerHTML = '<i class="fa-solid fa-xmark"></i>'
    todo.appendChild(removeTodo)

    // utilizando dados da localStorage
    if (done) {
        todo.classList.add("done")
    }

    if (save) {
        saveTodoLocalStorage({ text, date, dateEnd, prazo, done })
    }

    todoList.appendChild(todo)

    todoTituloInput.value = ""
    todoDateInput.value = ""
    todoPrazoInput.value = ""
    todoTituloInput.focus()
}

const toggleForms = () => {
    editForm.classList.toggle("hide")
    todoForm.classList.toggle("hide")
    todoList.classList.toggle("hide")
}

const updateTodo = (text, date, prazo) => {
    const todos = document.querySelectorAll(".todo")

    todos.forEach((todo) => {
        let todoTitle = todo.querySelector("h3")
        let todoDate = todo.querySelector(".todoDateStart")
        let todoDateEnd = todo.querySelector(".todoDateEnd")
        if (todoTitle.innerText === oldTituloInputValue || todoDate.innerText === oldDateInputValue) {
            todoTitle.innerText = text
            todoDateEnd.innerText = diasUteis(date, prazo)
            todoDate.innerText = date
            updateTodoLocalStorage(oldTituloInputValue, text, oldDateInputValue, todoDateEnd.innerText, date, prazo)
        }
    })
}

const getSearchTodos = (search) => {
    const todos = document.querySelectorAll(".todo")

    todos.forEach((todo) => {
        let todoTitle = todo.querySelector("h3").innerText.toLowerCase()

        const normalizedSearch = search.toLowerCase()

        todo.style.display = "flex"
        if (!todoTitle.includes(search)) {
            todo.style.display = "none"
        }
    })
}

const filterTodos = (filterValue) => {
    const todos = document.querySelectorAll(".todo")

    switch (filterValue) {
        case "all":
            todos.forEach((todo) => {
                todo.style.display = "flex"
            })
            break;

        case "done":
            todos.forEach((todo) => {
                todo.classList.contains("done") ? todo.style.display = "flex" : todo.style.display = "none"
            })
            break

        case "todo":
            todos.forEach((todo) => {
                !todo.classList.contains("done") ? todo.style.display = "flex" : todo.style.display = "none"
            })
            break
        default:
            break;
    }
}


// eventos

todoForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const tituloInputValue = todoTituloInput.value
    const dateInputValue = todoDateInput.value
    const prazoInputValue = todoPrazoInput.value

    if (tituloInputValue && dateInputValue) {
        saveTodo(tituloInputValue, dateInputValue, prazoInputValue)
    }
})

document.addEventListener("click", (e) => {
    const targetEl = e.target
    const parentEl = targetEl.closest("div")
    let todoTitle
    let todoDate

    if (parentEl && parentEl.querySelector("h3")) {
        todoTitle = parentEl.querySelector("h3").innerText || ""
        todoDate = parentEl.querySelector(".todoDateStart").innerText || ""
    }

    if (targetEl.classList.contains("finish-todo")) {
        parentEl.classList.toggle("done")
        updateTodoStatusLocalStorage(todoTitle, todoDate)
    }

    if (targetEl.classList.contains("remove-todo")) {
        parentEl.remove()

        removeTodoLocalStorage(todoTitle, todoDate)
    }

    if (targetEl.classList.contains("edit-todo")) {
        toggleForms()

        editTituloInput.value = todoTitle
        oldTituloInputValue = todoTitle
        editDateInput.value = todoDate
        oldDateInputValue = todoDate
        const todos = getTodosLocalStorage()
        todos.forEach((todo) => {
            if (todo.date === todoDate && todo.text === todoTitle) {
                editPrazoInput.value = todo.prazo
            }
        })
    }
})

cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault()

    toggleForms()
})

editForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const editTituloInputValue = editTituloInput.value
    const editDateInputValue = editDateInput.value
    const editPrazoInputValue = editPrazoInput.value

    if (editTituloInputValue || editDateInputValue) {
        updateTodo(editTituloInputValue, editDateInputValue, editPrazoInputValue)
    }

    toggleForms()
})

searchInput.addEventListener("keyup", (e) => {
    const search = e.target.value
    getSearchTodos(search)
})

eraseBtn.addEventListener("click", (e) => {
    e.preventDefault()
    searchInput.value = ""

    searchInput.dispatchEvent(new Event("keyup"))
})


filterBtn.addEventListener("change", (e) => {
    const filterValue = e.target.value

    filterTodos(filterValue)
})



// local Storage

const saveTodoLocalStorage = (todo) => {
    const todos = getTodosLocalStorage()

    todos.push(todo)

    localStorage.setItem("todos", JSON.stringify(todos))
}

const getTodosLocalStorage = () => {
    const todos = JSON.parse(localStorage.getItem("todos")) || []
    return todos.sort((a, b) => a.done > b.done ? -1 : 1)
}

const loadTodos = () => {
    const todos = getTodosLocalStorage()

    todos.forEach((todo) => {
        saveTodo(todo.text, todo.date, todo.prazo, todo.done, 0)
    })
}

const removeTodoLocalStorage = (todoText, todoDate) => {
    const todos = getTodosLocalStorage()

    const filteredTodos = todos.filter((todo) => !(todo.text === todoText && todo.date === todoDate))

    localStorage.setItem("todos", JSON.stringify(filteredTodos))
}

const updateTodoStatusLocalStorage = (text, date) => {
    const todos = getTodosLocalStorage()

    todos.map((todo) => todo.text === text && todo.date === date ? todo.done = !todo.done : null)

    localStorage.setItem("todos", JSON.stringify(todos))
}

const updateTodoLocalStorage = (todoOldText, todoNewText, todoOldDate, todoNewDate, date, prazo) => {
    const todos = getTodosLocalStorage()

    todos.map((todo) => {
        if (todo.text === todoOldText || todo.date === todoOldDate) {
            todo.text = todoNewText
            todo.dateEnd = todoNewDate
            todo.date = date
            todo.prazo = prazo
        } else {
            return null
        }
    })
    localStorage.setItem("todos", JSON.stringify(todos))
}


// calcular prazo de entrega (dias uteis)

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


// funcao

function diaMeses(mes) {
    if (mes === 1) {
        return 31
    }
    if (mes === 2) {
        const bissexto = (ano % 4 === 0 && ano % 100 !== 0) || (ano % 400 === 0)
        return bissexto ? 29 : 28
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

function eFeriado(mes, dia) {
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

function diasUteis(d, prazo1) {
    const data = d.split("-")
    prazo = -1
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
                if (prazo >= prazo1) {
                    return `${ano}-${mes}-${dia}`
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


// dowload
const exportData = () => {
    const todos = getTodosLocalStorage()

    const csvString = [
        ["Titulo", "Data Inicio", "Data final"],
        ...todos.map((todo) => [todo.text, todo.date, todo.dateEnd])
    ].map((e) => e.join(",")).join("\n")

    const element = document.createElement("a")

    element.href = "data:text/csv;charset=utf-8," + encodeURI(csvString)

    element.target = "_blank"

    element.download = "todos.csv"

    element.click()
}

btnBaixarinput.addEventListener("click", () => {
    exportData()
})

loadTodos()