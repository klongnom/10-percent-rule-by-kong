// ===============================
// 10% Rule by Kong
// ระบบจัดการเงินแบบแยกเดือน
// รายได้ + ออม + ลงทุน + ค่าใช้จ่าย + เป้าหมาย
// ===============================


// ===============================
// ข้อมูลหลัก
// ===============================

let incomes = [];

let expenses = [];

let savingPercent = 10;

let investmentPercent = 5;

let savingGoal = 30000;

let savedAmount = 0;

let savingHistory = [];

// ===============================
// V3.2 ระบบวินัยการเงิน
// ===============================

let disciplineScore = 0;

let selfTaxFund = 0;

let selfTaxGoal = 500;

let investmentFromTax = 0;

let luxuryExpenses = [];


// เดือนที่กำลังดู
let currentMonth = getCurrentMonth();


// ===============================
// หมวดค่าใช้จ่าย
// ===============================

const expenseCategories = [
    "🍜 อาหาร",
    "🛵 เดินทาง",
    "🏠 ที่พัก",
    "📱 โทรศัพท์/อินเทอร์เน็ต",
    "📚 การศึกษา/พัฒนาตัวเอง",
    "🛍️ ช้อปปิ้ง",
    "🎮 ความบันเทิง",
    "🤝 ช่วยเหลือผู้อื่น",
    "📦 อื่น ๆ"
];


// ===============================
// เริ่มระบบ
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadData();

        renderMonth();

        renderIncome();

        renderExpenses();

        calculate();

        updateGoal();

        renderHistory();

    }
);


// ===============================
// ระบบเดือน
// ===============================

// คืนค่าเดือนปัจจุบัน เช่น
// 2026-09

function getCurrentMonth() {

    const date = new Date();

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    return (
        year +
        "-" +
        month
    );

}


// ===============================
// แปลงเดือนเป็นภาษาไทย
// ===============================

function formatMonth(monthString) {

    const parts =
        monthString.split("-");

    const year =
        Number(parts[0]);

    const month =
        Number(parts[1]);


    const date =
        new Date(
            year,
            month - 1,
            1
        );


    return date.toLocaleDateString(
        "th-TH",
        {
            month: "long",
            year: "numeric"
        }
    );

}


// ===============================
// แสดงเดือน
// ===============================

function renderMonth() {

    const element =
        document.getElementById(
            "currentMonth"
        );


    if (!element) {
        return;
    }


    element.textContent =
        formatMonth(
            currentMonth
        );

}


// ===============================
// เดือนก่อนหน้า
// ===============================

function previousMonth() {

    const parts =
        currentMonth.split("-");


    let year =
        Number(parts[0]);

    let month =
        Number(parts[1]);


    month--;


    if (month === 0) {

        month = 12;

        year--;

    }


    currentMonth =
        year +
        "-" +
        String(month).padStart(
            2,
            "0"
        );


    renderMonth();

    renderIncome();

    renderExpenses();

    calculate();

}


// ===============================
// เดือนถัดไป
// ===============================

function nextMonth() {

    const parts =
        currentMonth.split("-");


    let year =
        Number(parts[0]);

    let month =
        Number(parts[1]);


    month++;


    if (month === 13) {

        month = 1;

        year++;

    }


    currentMonth =
        year +
        "-" +
        String(month).padStart(
            2,
            "0"
        );


    renderMonth();

    renderIncome();

    renderExpenses();

    calculate();

}


// ===============================
// กลับเดือนปัจจุบัน
// ===============================

function goToCurrentMonth() {

    currentMonth =
        getCurrentMonth();


    renderMonth();

    renderIncome();

    renderExpenses();

    calculate();

}


// ===============================
// เพิ่มรายได้
// ===============================

function addIncome() {

    let name =
        prompt(
            "ชื่อแหล่งรายได้ เช่น งานร้านอาหาร"
        );


    if (
        name === null ||
        name.trim() === ""
    ) {
        return;
    }


    let amountText =
        prompt(
            "จำนวนเงิน เช่น 4500"
        );


    if (amountText === null) {
        return;
    }


    let amount =
        Number(amountText);


    if (
        isNaN(amount) ||
        amount <= 0
    ) {

        alert(
            "กรุณาใส่จำนวนเงินให้ถูกต้อง"
        );

        return;
    }


    incomes.push({

        id: Date.now(),

        name:
            name.trim(),

        amount:
            amount,

        month:
            currentMonth

    });


    saveData();

    renderIncome();

    calculate();

}


// ===============================
// แสดงรายได้
// ===============================

function renderIncome() {

    const list =
        document.getElementById(
            "incomeList"
        );


    if (!list) {
        return;
    }


    list.innerHTML = "";


    const monthIncomes =
        incomes.filter(
            function (income) {

                return (
                    income.month ===
                    currentMonth
                );

            }
        );


    if (
        monthIncomes.length === 0
    ) {

        list.innerHTML = `
            <p class="description">
                ยังไม่มีรายได้เดือนนี้<br>
                กด ＋ เพิ่ม เพื่อเพิ่มรายได้
            </p>
        `;

        return;
    }


    monthIncomes.forEach(
        function (income) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "income-item";


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
                    onclick="deleteIncome(${income.id})"
                >
                    ลบ
                </button>

            `;


            list.appendChild(item);

        }
    );

}


// ===============================
// ลบรายได้
// ===============================

function deleteIncome(id) {

    if (
        !confirm(
            "ต้องการลบรายได้นี้หรือไม่?"
        )
    ) {
        return;
    }


    incomes =
        incomes.filter(
            function (income) {

                return income.id !== id;

            }
        );


    saveData();

    renderIncome();

    calculate();

}

// ===============================
// เพิ่มค่าใช้จ่าย
// V3.2 Self Tax 10%
// ===============================

function addExpense() {

    // =========================
    // ชื่อรายการ
    // =========================

    let name =
        prompt(
            "รายการค่าใช้จ่าย เช่น หนังสือ"
        );


    if (
        name === null ||
        name.trim() === ""
    ) {
        return;
    }


    // =========================
    // เลือกหมวดหมู่
    // =========================

    let categoryText =
        "เลือกหมวดหมู่โดยพิมพ์หมายเลข\n\n";


    expenseCategories.forEach(
        function (category, index) {

            categoryText +=
                (index + 1) +
                ". " +
                category +
                "\n";

        }
    );


    let categoryNumber =
        prompt(
            categoryText
        );


    if (categoryNumber === null) {
        return;
    }


    let categoryIndex =
        Number(categoryNumber) - 1;


    let category;


    if (
        categoryIndex >= 0 &&
        categoryIndex <
            expenseCategories.length
    ) {

        category =
            expenseCategories[
                categoryIndex
            ];

    }
    else {

        alert(
            "เลือกหมวดหมู่ไม่ถูกต้อง"
        );

        return;
    }


    // =========================
    // จำนวนเงิน
    // =========================

    let amountText =
        prompt(
            "จำนวนเงิน เช่น 100"
        );


    if (amountText === null) {
        return;
    }


    let amount =
        Number(amountText);


    if (
        isNaN(amount) ||
        amount <= 0
    ) {

        alert(
            "กรุณาใส่จำนวนเงินให้ถูกต้อง"
        );

        return;
    }


    // =========================
    // V3.2
    // ถามว่าจะจ่ายภาษีให้ตัวเองหรือไม่
    // =========================

    const isLuxury =
        confirm(
            "ต้องการจ่ายภาษีให้ตัวเอง 10% หรือไม่?\n\n" +
            "กด OK = ใช่ (+10% เข้ากองทุนลงทุน)\n" +
            "กด Cancel = ไม่"
        );


    // =========================
    // คำนวณ Self Tax
    // =========================

    let selfTax = 0;


    if (isLuxury) {

        selfTax =
            amount * 0.10;

    }


    // =========================
    // เพิ่มค่าใช้จ่าย
    // =========================

    expenses.push({

        id:
            Date.now(),

        name:
            name.trim(),

        category:
            category,

        amount:
            amount,

        isLuxury:
            isLuxury,

        selfTax:
            selfTax,

        month:
            currentMonth

    });


// =========================
// V3.2
// เพิ่มเงินเข้า Self Tax Fund
// และเปลี่ยนเป็นเงินลงทุนเมื่อครบ 500
// =========================

if (selfTax > 0) {

    selfTaxFund +=
        selfTax;

    const investmentBatch =
        Math.floor(
            selfTaxFund /
            selfTaxGoal
        ) *
        selfTaxGoal;

    if (
        investmentBatch > 0
    ) {

        investmentFromTax +=
            investmentBatch;

        selfTaxFund -=
            investmentBatch;

        disciplineScore =
            Math.min(
                100,
                disciplineScore + 10
            );

        alert(
            "🎉 คุณสร้างเงินลงทุนสำเร็จ!\n\n" +
            "เงินลงทุนจาก Self Tax: " +
            formatMoney(
                investmentBatch
            ) +
            "\n\n" +
            "Self Tax Fund เหลือ: " +
            formatMoney(
                selfTaxFund
            ) +
            "\n\n" +
            "คะแนนวินัย: " +
            disciplineScore +
            " / 100"
        );

    }

}


    // =========================
    // บันทึกข้อมูล
    // =========================

    saveData();

    renderExpenses();

    calculate();


    // =========================
    // แจ้งผล
    // =========================

    if (isLuxury) {

        alert(
            "บันทึกค่าใช้จ่ายแล้ว\n\n" +
            "ค่าใช้จ่าย: " +
            formatMoney(amount) +
            "\n" +
            "ภาษีตัวเอง 10%: " +
            formatMoney(selfTax) +
            "\n\n" +
            "Self Tax Fund: " +
            formatMoney(selfTaxFund) +
            " / " +
            formatMoney(selfTaxGoal)
        );

    }

}


// ===============================
// แสดงค่าใช้จ่าย
// ===============================

function renderExpenses() {

    const list =
        document.getElementById(
            "expenseList"
        );


    if (!list) {
        return;
    }


    list.innerHTML = "";


    const monthExpenses =
        expenses.filter(
            function (expense) {

                return (
                    expense.month ===
                    currentMonth
                );

            }
        );


    if (
        monthExpenses.length === 0
    ) {

        list.innerHTML = `
            <p class="description">
                ยังไม่มีค่าใช้จ่ายเดือนนี้
            </p>
        `;

        return;
    }


    monthExpenses.forEach(
        function (expense) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "expense-item";


            item.innerHTML = `

                <div class="expense-info">

                    <div class="expense-name">
                        ${escapeHTML(expense.name)}
                    </div>

                    <div class="expense-category">
                        ${escapeHTML(expense.category)}
                    </div>

                </div>

                <div class="expense-right">

                    <strong>
                        -${formatMoney(expense.amount)}
                    </strong>

                    <button
                        class="delete-btn"
                        onclick="deleteExpense(${expense.id})"
                    >
                        ลบ
                    </button>

                </div>

            `;


            list.appendChild(item);

        }
    );

}


// ===============================
// ลบค่าใช้จ่าย
// ===============================

function deleteExpense(id) {

    if (
        !confirm(
            "ต้องการลบค่าใช้จ่ายนี้หรือไม่?"
        )
    ) {
        return;
    }


    expenses =
        expenses.filter(
            function (expense) {

                return expense.id !== id;

            }
        );


    saveData();

    renderExpenses();

    calculate();

}


// ===============================
// คำนวณเดือนปัจจุบัน
// ===============================

function calculate() {

    const monthIncomes =
        incomes.filter(
            function (income) {

                return (
                    income.month ===
                    currentMonth
                );

            }
        );


    const monthExpenses =
        expenses.filter(
            function (expense) {

                return (
                    expense.month ===
                    currentMonth
                );

            }
        );


    // รายได้รวม

    let totalIncome =
        monthIncomes.reduce(
            function (
                total,
                income
            ) {

                return (
                    total +
                    income.amount
                );

            },
            0
        );


    // ค่าใช้จ่ายรวม

    let totalExpense =
        monthExpenses.reduce(
            function (
                total,
                expense
            ) {

                return (
                    total +
                    expense.amount
                );

            },
            0
        );


    // เงินออม

    let saving =
        totalIncome *
        savingPercent /
        100;


    // เงินลงทุน

    let investment =
        totalIncome *
        investmentPercent /
        100;


    // เงินที่วางแผนให้ใช้

    let plannedRemain =
        totalIncome -
        saving -
        investment;


    // เงินเหลือจริง

    let actualRemain =
        plannedRemain -
        totalExpense;


    // =========================
    // รายได้
    // =========================

    const incomeElement =
        document.getElementById(
            "income"
        );


    if (incomeElement) {

        incomeElement.textContent =
            formatMoney(
                totalIncome
            );

    }


    // =========================
    // เงินออม
    // =========================

    const savingPercentElement =
        document.getElementById(
            "savingPercent"
        );


    const savingElement =
        document.getElementById(
            "saving"
        );


    if (
        savingPercentElement
    ) {

        savingPercentElement.textContent =
            savingPercent +
            "%";

    }


    if (savingElement) {

        savingElement.textContent =
            formatMoney(
                saving
            );

    }


    // =========================
    // เงินลงทุน
    // =========================

    const investmentPercentElement =
        document.getElementById(
            "investmentPercent"
        );


    const investmentElement =
        document.getElementById(
            "investment"
        );


    if (
        investmentPercentElement
    ) {

        investmentPercentElement.textContent =
            investmentPercent +
            "%";

    }


    if (investmentElement) {

        investmentElement.textContent =
            formatMoney(
                investment
            );

    }


    // =========================
    // เงินที่วางแผนให้ใช้
    // =========================

    const remainElement =
        document.getElementById(
            "remain"
        );


    if (remainElement) {

        remainElement.textContent =
            formatMoney(
                plannedRemain
            );

    }


    // =========================
    // ค่าใช้จ่าย
    // =========================

    const expenseElement =
        document.getElementById(
            "totalExpense"
        );


    if (expenseElement) {

        expenseElement.textContent =
            formatMoney(
                totalExpense
            );

    }


    // =========================
    // เงินเหลือจริง
    // =========================

    const actualRemainElement =
        document.getElementById(
            "actualRemain"
        );


    if (
        actualRemainElement
    ) {

        actualRemainElement.textContent =
            formatMoney(
                actualRemain
            );

    }


    // =========================
    // สถานะงบ
    // =========================

    const budgetMessage =
        document.getElementById(
            "budgetMessage"
        );


    if (budgetMessage) {

        if (
            totalExpense >
            plannedRemain
        ) {

            budgetMessage.textContent =
                "⚠️ ค่าใช้จ่ายเกินเงินที่วางแผนไว้";

        }
        else {

            let left =
                plannedRemain -
                totalExpense;


            budgetMessage.textContent =
                "เหลืองบอีก " +
                formatMoney(
                    left
                );

        }

    }

const dashboardIncome =
    document.getElementById("dashboardIncome");

if (dashboardIncome) {
    dashboardIncome.textContent =
        formatMoney(totalIncome);
}

const dashboardSaving =
    document.getElementById("dashboardSaving");

if (dashboardSaving) {
    dashboardSaving.textContent =
        formatMoney(saving);
}

const dashboardInvestment =
    document.getElementById("dashboardInvestment");

if (dashboardInvestment) {
    dashboardInvestment.textContent =
        formatMoney(investment);
}

const dashboardExpense =
    document.getElementById("dashboardExpense");

if (dashboardExpense) {
    dashboardExpense.textContent =
        formatMoney(totalExpense);
}

const dashboardRemain =
    document.getElementById("dashboardRemain");

if (dashboardRemain) {
    dashboardRemain.textContent =
        formatMoney(actualRemain);
}

const dashboardSavingPercent =
    document.getElementById("dashboardSavingPercent");

if (dashboardSavingPercent) {
    dashboardSavingPercent.textContent =
        savingPercent + "%";
}

const dashboardInvestmentPercent =
    document.getElementById("dashboardInvestmentPercent");

if (dashboardInvestmentPercent) {
    dashboardInvestmentPercent.textContent =
        investmentPercent + "%";
}

const dashboardTotalPercent =
    document.getElementById("dashboardTotalPercent");

if (dashboardTotalPercent) {
    dashboardTotalPercent.textContent =
        (savingPercent + investmentPercent) + "%";
}



// Dashboard Chart V2

const chartSaving =
    document.getElementById("chartSaving");

const chartInvestment =
    document.getElementById("chartInvestment");

const chartExpense =
    document.getElementById("chartExpense");

const chartRemain =
    document.getElementById("chartRemain");


const chartSavingText =
    document.getElementById("chartSavingText");

const chartInvestmentText =
    document.getElementById("chartInvestmentText");

const chartExpenseText =
    document.getElementById("chartExpenseText");

const chartRemainText =
    document.getElementById("chartRemainText");


const chartSavingLegend =
    document.getElementById("chartSavingLegend");

const chartInvestmentLegend =
    document.getElementById("chartInvestmentLegend");

const chartExpenseLegend =
    document.getElementById("chartExpenseLegend");

const chartRemainLegend =
    document.getElementById("chartRemainLegend");


if (totalIncome > 0) {

    /*
     * เงินที่สามารถนำไปใช้จ่ายได้จริง
     * หลังหักเงินออมและเงินลงทุน
     */

    const plannedRemain =
        Math.max(
            0,
            totalIncome - saving - investment
        );


    /*
     * ป้องกันกราฟใช้จ่ายเกิน 100%
     */

    const displayExpense =
        Math.min(
            Math.max(totalExpense, 0),
            plannedRemain
        );


    /*
     * เงินที่เหลือสำหรับแสดงบนกราฟ
     */

    const displayRemain =
        Math.max(
            0,
            plannedRemain - displayExpense
        );


    /*
     * คำนวณเปอร์เซ็นต์
     */

    const savingWidth =
        (saving / totalIncome) * 100;

    const investmentWidth =
        (investment / totalIncome) * 100;

    const expenseWidth =
        (displayExpense / totalIncome) * 100;

    const remainWidth =
        (displayRemain / totalIncome) * 100;


    /*
     * กำหนดความกว้างหลอด
     */

    if (chartSaving) {
        chartSaving.style.width =
            savingWidth + "%";
    }

    if (chartInvestment) {
        chartInvestment.style.width =
            investmentWidth + "%";
    }

    if (chartExpense) {
        chartExpense.style.width =
            expenseWidth + "%";
    }

    if (chartRemain) {
        chartRemain.style.width =
            remainWidth + "%";
    }


    /*
     * แสดงตัวเลขบนหลอด
     */

    if (chartSavingText) {
        chartSavingText.textContent =
            Math.round(savingWidth) + "%";
    }

    if (chartInvestmentText) {
        chartInvestmentText.textContent =
            Math.round(investmentWidth) + "%";
    }

    if (chartExpenseText) {
        chartExpenseText.textContent =
            Math.round(expenseWidth) + "%";
    }

    if (chartRemainText) {
        chartRemainText.textContent =
            Math.round(remainWidth) + "%";
    }


    /*
     * แสดงรายละเอียดด้านล่าง
     */

    if (chartSavingLegend) {
        chartSavingLegend.textContent =
            formatMoney(saving) +
            " (" +
            savingWidth.toFixed(1) +
            "%)";
    }

    if (chartInvestmentLegend) {
        chartInvestmentLegend.textContent =
            formatMoney(investment) +
            " (" +
            investmentWidth.toFixed(1) +
            "%)";
    }

    if (chartExpenseLegend) {
        chartExpenseLegend.textContent =
            formatMoney(totalExpense) +
            " (" +
            ((totalExpense / totalIncome) * 100).toFixed(1) +
            "%)";
    }

       if (chartRemainLegend) {
        chartRemainLegend.textContent =
            "0 บาท (0%)";
    }
  }


    // =========================
    // V3.2 Self Tax Fund Display
    // =========================

    const selfTaxFundDisplay =
        document.getElementById(
            "selfTaxFundDisplay"
        );

    const selfTaxProgress =
        document.getElementById(
            "selfTaxProgress"
        );

    const selfTaxRemaining =
        document.getElementById(
            "selfTaxRemaining"
        );

    const investmentFromTaxDisplay =
        document.getElementById(
            "investmentFromTaxDisplay"
        );

    if (selfTaxFundDisplay) {
        selfTaxFundDisplay.textContent =
            formatMoney(selfTaxFund);
    }

    if (selfTaxProgress) {
        const progress =
            Math.min(
                100,
                (selfTaxFund / selfTaxGoal) * 100
            );

        selfTaxProgress.style.width =
            progress + "%";
    }

    if (selfTaxRemaining) {
        const remaining =
            Math.max(
                0,
                selfTaxGoal - selfTaxFund
            );

        selfTaxRemaining.textContent =
            formatMoney(remaining);
    }

    if (investmentFromTaxDisplay) {
        investmentFromTaxDisplay.textContent =
            formatMoney(
                investmentFromTax
            );
    }

}


// ===============================
// บันทึกเงินออมเดือนนี้
// =============================== 
    

    const monthIncomes =
        incomes.filter(
            function (income) {

                return (
                    income.month ===
                    currentMonth
                );

            }
        );


    let totalIncome =
        monthIncomes.reduce(
            function (
                total,
                income
            ) {

                return (
                    total +
                    income.amount
                );

            },
            0
        );


    let saving =
        totalIncome *
        savingPercent /
        100;


    if (saving <= 0) {

        alert(
            "ยังไม่มีเงินออมสำหรับเดือนนี้"
        );

        return;
    }


    let alreadySaved =
        savingHistory.some(
            function (item) {

                return (
                    item.month ===
                    currentMonth
                );

            }
        );


    if (alreadySaved) {

        alert(
            "เดือนนี้บันทึกเงินออมไปแล้ว"
        );

        return;
    }


    savedAmount += saving;


    savingHistory.push({

        id: Date.now(),

        month:
            currentMonth,

        amount:
            saving

    });


    saveData();

    updateGoal();

    renderHistory();


    alert(
        "บันทึกเงินออม " +
        formatMoney(saving) +
        " เรียบร้อยแล้ว"
    );

}


// ===============================
// ประวัติการออม
// ===============================

function renderHistory() {

    const list =
        document.getElementById(
            "savingHistory"
        );


    if (!list) {
        return;
    }


    list.innerHTML = "";


    if (
        savingHistory.length === 0
    ) {

        list.innerHTML = `
            <p class="description">
                ยังไม่มีประวัติการออม
            </p>
        `;

        return;
    }


    savingHistory
        .slice()
        .reverse()
        .forEach(
            function (item) {

                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "history-item";


                row.innerHTML = `

                    <div>

                        <strong>
                            ${formatMonth(item.month)}
                        </strong>

                    </div>

                    <strong class="history-money">
                        +${formatMoney(item.amount)}
                    </strong>

                `;


                list.appendChild(row);

            }
        );

}


// ===============================
// เปลี่ยนเปอร์เซ็นต์ออม
// ===============================

function setPercent(percent) {

    savingPercent =
        percent;


    saveData();

    calculate();

}


// ===============================
// เปลี่ยนเปอร์เซ็นต์ลงทุน
// ===============================

function setInvestmentPercent(
    percent
) {

    investmentPercent =
        percent;


    saveData();

    calculate();

}


// ===============================
// ตั้งเป้าหมาย
// ===============================

function setSavingGoal() {

    let goalText =
        prompt(
            "ต้องการเก็บเงินก้อนเท่าไร? เช่น 30000"
        );


    if (goalText === null) {
        return;
    }


    let goal =
        Number(goalText);


    if (
        isNaN(goal) ||
        goal <= 0
    ) {

        alert(
            "กรุณาใส่เป้าหมายให้ถูกต้อง"
        );

        return;
    }


    savingGoal =
        goal;


    saveData();

    updateGoal();

}


// ===============================
// อัปเดตเป้าหมาย
// ===============================

function updateGoal() {

    const goalElement =
        document.getElementById(
            "savingGoal"
        );


    if (!goalElement) {
        return;
    }


    goalElement.textContent =
        formatMoney(
            savingGoal
        );


    const savedElement =
        document.getElementById(
            "savedAmount"
        );


    if (savedElement) {

        savedElement.textContent =
            formatMoney(
                savedAmount
            );

    }


    let percent = 0;


    if (
        savingGoal > 0
    ) {

        percent =
            savedAmount /
            savingGoal *
            100;

    }


    percent =
        Math.min(
            percent,
            100
        );


    const percentElement =
        document.getElementById(
            "goalPercent"
        );


    if (percentElement) {

        percentElement.textContent =
            percent.toFixed(1) +
            "%";

    }


    const progress =
        document.getElementById(
            "progressFill"
        );


    if (progress) {

        progress.style.width =
            percent +
            "%";

    }


    const message =
        document.getElementById(
            "goalMessage"
        );


    if (!message) {
        return;
    }


    if (
        savedAmount >=
        savingGoal
    ) {

        message.textContent =
            "เป้าหมายเงินก้อนสำเร็จแล้ว!";

    }
    else {

        let remaining =
            savingGoal -
            savedAmount;


        message.textContent =
            "เหลืออีก " +
            formatMoney(
                remaining
            ) +
            " เพื่อถึงเป้าหมาย";

    }

}


// ===============================
// บันทึกข้อมูล
// ===============================

function saveData() {

    localStorage.setItem(
    "kongDisciplineScore",
    disciplineScore
);

localStorage.setItem(
    "kongSelfTaxFund",
    selfTaxFund
);

localStorage.setItem(
    "kongInvestmentFromTax",
    investmentFromTax
);

localStorage.setItem(
    "kongLuxuryExpenses",
    JSON.stringify(
        luxuryExpenses
    )
);

    localStorage.setItem(
        "kongIncomes",
        JSON.stringify(
            incomes
        )
    );


    localStorage.setItem(
        "kongExpenses",
        JSON.stringify(
            expenses
        )
    );


    localStorage.setItem(
        "kongSavingPercent",
        savingPercent
    );


    localStorage.setItem(
        "kongInvestmentPercent",
        investmentPercent
    );


    localStorage.setItem(
        "kongSavingGoal",
        savingGoal
    );


    localStorage.setItem(
        "kongSavedAmount",
        savedAmount
    );


    localStorage.setItem(
        "kongSavingHistory",
        JSON.stringify(
            savingHistory
        )
      );
    
}

 // ===============================
// โหลดข้อมูล
// ===============================

function loadData() {

    // =========================
    // V3.2 โหลดระบบวินัยการเงิน
    // =========================

    const savedDiscipline =
        localStorage.getItem(
            "kongDisciplineScore"
        );

    const savedSelfTax =
        localStorage.getItem(
            "kongSelfTaxFund"
        );

    const savedInvestmentTax =
        localStorage.getItem(
            "kongInvestmentFromTax"
        );

    const savedLuxury =
        localStorage.getItem(
            "kongLuxuryExpenses"
        );


    if (savedDiscipline !== null) {

        disciplineScore =
            Number(
                savedDiscipline
            );

    }


    if (savedSelfTax !== null) {

        selfTaxFund =
            Number(
                savedSelfTax
            );

    }


    if (savedInvestmentTax !== null) {

        investmentFromTax =
            Number(
                savedInvestmentTax
            );

    }


    if (savedLuxury) {

        try {

            luxuryExpenses =
                JSON.parse(
                    savedLuxury
                );

        }
        catch (error) {

            luxuryExpenses = [];

        }

    }


    // =========================
    // ข้อมูลเดิม
    // =========================

    const savedIncomes =
        localStorage.getItem(
            "kongIncomes"
        );


    const savedExpenses =
        localStorage.getItem(
            "kongExpenses"
        );


    const savedPercent =
        localStorage.getItem(
            "kongSavingPercent"
        );


    const savedInvestmentPercent =
        localStorage.getItem(
            "kongInvestmentPercent"
        );


    const savedGoal =
        localStorage.getItem(
            "kongSavingGoal"
        );


    const savedMoney =
        localStorage.getItem(
            "kongSavedAmount"
        );


    const savedHistory =
        localStorage.getItem(
            "kongSavingHistory"
        );


    // =========================
    // รายได้เดิม
    // =========================

    if (savedIncomes) {

        try {

            incomes =
                JSON.parse(
                    savedIncomes
                );

        }
        catch (error) {

            incomes = [];

        }

    }


    // =========================
    // ค่าใช้จ่ายเดิม
    // =========================

    if (savedExpenses) {

        try {

            expenses =
                JSON.parse(
                    savedExpenses
                );

        }
        catch (error) {

            expenses = [];

        }

    }


    // =========================
    // เปอร์เซ็นต์ออม
    // =========================

    if (
        savedPercent !== null
    ) {

        savingPercent =
            Number(
                savedPercent
            );

    }


    // =========================
    // เปอร์เซ็นต์ลงทุน
    // =========================

    if (
        savedInvestmentPercent !== null
    ) {

        investmentPercent =
            Number(
                savedInvestmentPercent
            );

    }


    // =========================
    // เป้าหมาย
    // =========================

    if (
        savedGoal !== null
    ) {

        savingGoal =
            Number(
                savedGoal
            );

    }


    // =========================
    // เงินออมสะสม
    // =========================

    if (
        savedMoney !== null
    ) {

        savedAmount =
            Number(
                savedMoney
            );

    }


    // =========================
    // ประวัติการออม
    // =========================

    if (savedHistory) {

        try {

            savingHistory =
                JSON.parse(
                    savedHistory
                );

        }
        catch (error) {

            savingHistory = [];

        }

    }


    // =========================
    // แปลงข้อมูลเก่า
    // =========================

    let changed = false;


    incomes =
        incomes.map(
            function (income) {

                if (
                    !income.month
                ) {

                    income.month =
                        currentMonth;

                    changed = true;

                }

                return income;

            }
        );


    expenses =
        expenses.map(
            function (expense) {

                if (
                    !expense.month
                ) {

                    expense.month =
                        currentMonth;

                    changed = true;

                }

                return expense;

            }
        );


    // =========================
    // แปลงประวัติการออมเก่า
    // =========================

    savingHistory =
        savingHistory.map(
            function (item) {

                if (
                    !item.month
                ) {

                    item.month =
                        currentMonth;

                    changed = true;

                }

                return item;

            }
        );


    if (changed) {

        saveData();

    }

}  



// ===============================
// รูปแบบเงิน
// ===============================

function formatMoney(number) {

    return (
        Number(number)
            .toLocaleString(
                "th-TH"
            ) +
        " บาท"
    );

}


// ===============================
// ป้องกัน HTML แปลก ๆ
// ===============================

function escapeHTML(text) {

    return String(text)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}
