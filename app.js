// ===============================
// 10% Rule by Kong
// ระบบรายได้หลายงาน
// ===============================

let incomes = [];
let savingPercent = 10;
let investmentPercent = 5;


// เริ่มต้นระบบ
document.addEventListener("DOMContentLoaded", function () {
    loadData();
    renderIncome();
    calculate();
});


// ===============================
// เพิ่มรายได้
// ===============================

function addIncome() {

    let name = prompt("ชื่อแหล่งรายได้ เช่น งานร้านอาหาร");

    if (name === null || name.trim() === "") {
        return;
    }

    let amountText = prompt("จำนวนเงิน เช่น 4500");

    if (amountText === null) {
        return;
    }

    let amount = Number(amountText);

    if (isNaN(amount) || amount <= 0) {
        alert("กรุณาใส่จำนวนเงินให้ถูกต้อง");
        return;
    }


    // เพิ่มข้อมูล
    incomes.push({
        id: Date.now(),
        name: name.trim(),
        amount: amount
    });


    saveData();
    renderIncome();
    calculate();
}


// ===============================
// แสดงรายการรายได้
// ===============================

function renderIncome() {

    const list = document.getElementById("incomeList");

    list.innerHTML = "";


    if (incomes.length === 0) {

        list.innerHTML = `
            <p class="description">
                ยังไม่มีรายได้<br>
                กด ＋ เพิ่ม เพื่อเพิ่มรายได้
            </p>
        `;

        return;
    }


    incomes.forEach(function (income) {

        const item = document.createElement("div");

        item.className = "income-item";

        item.innerHTML = `
            <div class="income-info">

                <div class="income-name">
                    ${escapeHTML(income.name)}
                </div>

                <div class="income-amount">
                    ${formatMoney(income.amount)}
                </div>

            </div>

            <button
                class="delete-btn"
                onclick="deleteIncome(${income.id})">
                ลบ
            </button>
        `;

        list.appendChild(item);
    });
}


// ===============================
// ลบรายได้
// ===============================

function deleteIncome(id) {

    const confirmDelete = confirm(
        "ต้องการลบรายได้นี้หรือไม่?"
    );

    if (!confirmDelete) {
        return;
    }

    incomes = incomes.filter(function (income) {
        return income.id !== id;
    });

    saveData();
    renderIncome();
    calculate();
}


// ===============================
// คำนวณเงิน
// ===============================

function calculate() {

    let totalIncome = incomes.reduce(
        function (total, income) {
            return total + income.amount;
        },
        0
    );


    let saving =
        totalIncome * savingPercent / 100;


    let remain =
        totalIncome - saving;


    document.getElementById("income").textContent =
        formatMoney(totalIncome);


    document.getElementById("savingPercent").textContent =
        savingPercent + "%";


    document.getElementById("saving").textContent =
        formatMoney(saving);


    document.getElementById("remain").textContent =
        formatMoney(remain);
}


// ===============================
// เปลี่ยนเปอร์เซ็นต์
// ===============================

function setPercent(percent) {

    savingPercent = percent;

    saveData();
    calculate();
}


// ===============================
// บันทึกข้อมูลในเครื่อง
// ===============================

function saveData() {

    localStorage.setItem(
        "kongIncomes",
        JSON.stringify(incomes)
    );

    localStorage.setItem(
        "kongSavingPercent",
        savingPercent
    );
}


// ===============================
// โหลดข้อมูล
// ===============================

function loadData() {

    const savedIncomes =
        localStorage.getItem("kongIncomes");

    const savedPercent =
        localStorage.getItem("kongSavingPercent");


    if (savedIncomes) {

        try {

            incomes = JSON.parse(savedIncomes);

        } catch (error) {

            incomes = [];

        }
    }


    if (savedPercent) {

        savingPercent = Number(savedPercent);

    }
}


// ===============================
// จัดรูปแบบเงิน
// ===============================

function formatMoney(number) {

    return number.toLocaleString("th-TH") + " บาท";
}


// ===============================
// ป้องกัน HTML แปลก ๆ
// ===============================

function escapeHTML(text) {

    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
