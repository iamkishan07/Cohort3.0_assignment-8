const addTransaction = document.querySelector(".aside-bottom");
const formOpen = document.querySelector(".form");
const form = document.querySelector("form");
const close = document.querySelector("#close");
const inp1 = document.querySelector("#type");
const inp2 = document.querySelector(".des");
const inp3 = document.querySelector("#amount");
const inp4 = document.querySelector("#date");
const inp5 = document.querySelector("#category");
const data = document.querySelector(".data");
const clearAll = document.querySelector("#clearAll");
const dark = document.querySelector("#dark");
const totalIncome = document.querySelector("#income")
const totalBalance = document.querySelector("#balance");
const totalExpense = document.querySelector("#expense");
const pages = document.querySelectorAll(".page")
const navUser = document.querySelector("#navUser");
const filter = document.getElementById("filter");
const searchInput = document.querySelector(".search input");
const totalTransactions = document.getElementById("totalTransactions");

function setNavUser() {
    const currentUser = localStorage.getItem("currentUser");

    if (currentUser) {
        navUser.textContent = currentUser;
    } else {
        navUser.textContent = "Guest";
    }
}




let userTransaction = JSON.parse(localStorage.getItem("transactions")) || [];
let editIndex = -1;

function saveData() {
    localStorage.setItem("transactions", JSON.stringify(userTransaction));
}





const loginUser = document.querySelector("#loginUser");
const loginPass = document.querySelector("#loginPassword");
const loginBtn = document.querySelector("#loginBtn");

const registerUser = document.querySelector("#reginsterUser");
const registerPass = document.querySelector("#registerPassword");
const registerBtn = document.querySelector("#registerBtn");

const loginPanel = document.querySelector(".login-pannel");
const registerPanel = document.querySelector(".register-pannel");

const showRegister = document.querySelector("#showRegister");
const showLogin = document.querySelector("#showLogin");

const container = document.querySelector(".container");
const logoutBtn = document.querySelector("#logoutBtn");


loginPanel.style.display = "flex";
registerPanel.style.display = "none";
container.style.display = "none";


showRegister.addEventListener("click", (e) => {
    e.preventDefault();
    loginPanel.style.display = "none";
    registerPanel.style.display = "flex";
});

showLogin.addEventListener("click", (e) => {
    e.preventDefault();
    registerPanel.style.display = "none";
    loginPanel.style.display = "flex";
});


registerBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const user = registerUser.value.trim();
    const pass = registerPass.value.trim();

    if (!user || !pass) {
        alert("Fill all fields");
        return;
    }

    const userData = {
        username: user,
        password: pass
    };

    localStorage.setItem("user", JSON.stringify(userData));

    alert("Registration Successful");

    registerUser.value = "";
    registerPass.value = "";

    registerPanel.style.display = "none";
    loginPanel.style.display = "flex";
});


loginBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const user = loginUser.value.trim();
    const pass = loginPass.value.trim();

    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (!savedUser) {
        alert("Please Register First");
        return;
    }

    if (user === savedUser.username && pass === savedUser.password) {

        alert("Login Successful");

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("currentUser", user);
        setNavUser();


        loginPanel.style.display = "none";
        registerPanel.style.display = "none";
        container.style.display = "flex";

        loginUser.value = "";
        loginPass.value = "";

    } else {
        alert("Invalid Username or Password");
    }
});


logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    setNavUser();

    container.style.display = "none";
    loginPanel.style.display = "flex";

    loginUser.value = "";
    loginPass.value = "";
});


window.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("isLoggedIn") === "true") {
        loginPanel.style.display = "none";
        registerPanel.style.display = "none";
        container.style.display = "flex";
    } else {
        loginPanel.style.display = "flex";
        registerPanel.style.display = "none";
        container.style.display = "none";
    }
    setNavUser();
});


const ctx = document.getElementById("cashFlowChart");

const cashFlowChart = new Chart(ctx, {
    type: "bar",
    data: {
        labels: ["Income vs Expense"],
        datasets: [
            {
                label: "Income",
                data: [0],
                backgroundColor: "#22c55e"
            },
            {
                label: "Expense",
                data: [0],
                backgroundColor: "#ef4444"
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            tooltip: {
                enabled: true,


                callbacks: {
                    title: () => "Income vs Expense",
                    label: (context) =>
                        `${context.dataset.label}: ${getCurrencySymbol()}${context.raw}`
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

const dateInput = document.getElementById("date");

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    const formattedDate = `${yyyy}-${mm}-${dd}`;
    dateInput.value = formattedDate;


dark.addEventListener("click", () => {
    dark.classList.toggle("active");
    document.body.classList.toggle("dark-mode");
});

function showPage(id) {
    pages.forEach(page => {
        page.style.display = "none";
    });

    document.getElementById(id).style.display = "block";
}

document.getElementById("dashboard").addEventListener("click", () => showPage("page-1"));
document.getElementById("set").addEventListener("click", () => showPage("page-2"));



addTransaction.addEventListener("click", (e)=>{
    formOpen.style.display = "flex"
})

close.addEventListener("click", ()=> {
    formOpen.style.display = "none"
})

clearAll.addEventListener("click", () =>{
    userTransaction = []
    saveData()
    ui();
    calculateTotal();
})

const ui = () => {

    const filtered = getFinalTransactions();

    data.innerHTML = `
        <div class="data-head">
            <p class="date">DATE</p>
            <p class="desc">DESCRIPTION</p>
            <p class="category">CATEGORY</p>
            <p class="amount">AMOUNT</p>
            <p class="action">ACTION</p>
        </div>
    `;

    filtered.forEach((elem, index) => {

        const isIncome = elem.type === "income";

        data.innerHTML += `
        <div class="list">
            <p class="date">${elem.date}</p>
            <p class="desc">${elem.description}</p>
            <p class="category">${elem.category}</p>

            <p class="amount ${isIncome ? "income" : "expense"}">
                ${isIncome ? "+" : "-"}${elem.amount}
            </p>

            <div class="action">
                <i onclick="editBtn(${index})" class="ri-pencil-line"></i>
                <i onclick="removeBtn(${index})" class="ri-delete-bin-2-line"></i>
            </div>
        </div>`;
    });
};
ui()
calculateTotal()

function editBtn(index) {
    editIndex = index;
    const transaction = userTransaction[index];

    inp1.value = transaction.type;
    inp2.value = transaction.description;
    inp3.value = transaction.amount;
    inp4.value = transaction.date;
    inp5.value = transaction.category;

    formOpen.style.display = "flex";
}

function removeBtn(index){
    userTransaction.splice(index, 1)
    saveData()
    ui();
    calculateTotal();
}


form.addEventListener("submit", (e)=>{
    e.preventDefault()

    let type = inp1.value
    let description = inp2.value
    let amount = inp3.value
    let date = inp4.value
    let category = inp5.value
   
    if(type.trim() === "" || description.trim() === "" || amount.trim() === "" || date.trim() === "" || category.trim() === "") return;

    let obj = {
        id: Date.now(),
        type,
        description,
        amount,
        date,
        category
    }
    if(editIndex === -1){
        userTransaction.push(obj);
    }else{
        userTransaction[editIndex] = obj;
        editIndex = -1;
    }
    
    saveData();
    ui();
    calculateTotal();
    
    form.reset()
    formOpen.style.display = 'none'
})


function calculateTotal() {

    const income = userTransaction
        .filter(t => t.type === "income")
        .reduce((acc, t) => acc + Number(t.amount), 0);

    const expense = userTransaction
        .filter(t => t.type === "expense")
        .reduce((acc, t) => acc + Number(t.amount), 0);

    const balance = income - expense;

    totalIncome.textContent = income;
    totalExpense.textContent = expense;
    totalBalance.textContent = balance;

    totalTransactions.textContent = userTransaction.length;


    cashFlowChart.data.datasets[0].data = [income];
    cashFlowChart.data.datasets[1].data = [expense];
    cashFlowChart.update();
}

filter.addEventListener("change", () => {
    ui();
    calculateTotal();
});
searchInput.addEventListener("input", () => {
    ui();
    calculateTotal();
});



const nameInput = document.querySelector(".user");
const currencySelect = document.querySelector("#currency");
const saveBtn = document.querySelector(".setting-panel button");

let settings = JSON.parse(localStorage.getItem("settings")) || {
    name: "",
    currency: "usd"
};

window.addEventListener("DOMContentLoaded", () => {

    nameInput.value = settings.name;
    currencySelect.value = settings.currency;

    const currentUser = localStorage.getItem("currentUser");
    if (currentUser && !settings.name) {
        nameInput.value = currentUser;
        settings.name = currentUser;
    }

    applyCurrency();
});


saveBtn.addEventListener("click", () => {

    settings.name = nameInput.value;
    settings.currency = currencySelect.value;

    localStorage.setItem("settings", JSON.stringify(settings));

    localStorage.setItem("currentUser", settings.name);

    alert("Settings Saved Successfully");

    applyCurrency();
});


function getCurrencySymbol() {
    switch (settings.currency) {
        case "usd": return "$";
        case "eur": return "€";
        case "gbp": return "£";
        case "inr": return "₹";
        case "jpy": return "¥";
        default: return "$";
    }
}


function applyCurrency() {

    const income = document.querySelector("#income");
    const expense = document.querySelector("#expense");
    const balance = document.querySelector("#balance");

    const inc = Number(income.textContent.replace(/[^0-9.-]/g, "")) || 0;
    const exp = Number(expense.textContent.replace(/[^0-9.-]/g, "")) || 0;
    const bal = Number(balance.textContent.replace(/[^0-9.-]/g, "")) || 0;

    income.textContent = getCurrencySymbol() + inc;
    expense.textContent = getCurrencySymbol() + exp;
    balance.textContent = getCurrencySymbol() + bal;
}


function getFilteredTransactions() {
    const value = filter.value;

    if (value === "income") {
        return userTransaction.filter(t => t.type === "income");
    }

    if (value === "expense") {
        return userTransaction.filter(t => t.type === "expense");
    }

    return userTransaction;
}
function getSearchFilteredTransactions() {
    const searchText = searchInput.value.toLowerCase();

    return userTransaction.filter(t => {
        return (
            t.description.toLowerCase().includes(searchText) ||
            t.category.toLowerCase().includes(searchText) ||
            t.amount.toString().includes(searchText)
        );
    });
}

function getFinalTransactions() {

    let data = userTransaction;

    const filterValue = filter.value;

    if (filterValue === "income") {
        data = data.filter(t => t.type === "income");
    } else if (filterValue === "expense") {
        data = data.filter(t => t.type === "expense");
    }

    const searchText = searchInput.value.toLowerCase();

    data = data.filter(t => {
        return (
            t.description.toLowerCase().includes(searchText) ||
            t.category.toLowerCase().includes(searchText) ||
            t.amount.toString().includes(searchText)
        );
    });

    return data;
}