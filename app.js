// ===============================
// 10% Rule by Kong
// รายได้ + ออม + ลงทุน + เป้าหมาย + ค่าใช้จ่าย
// ===============================

let incomes = [];

let expenses = [];

let savingPercent = 10;

let investmentPercent = 5;

let savingGoal = 30000;

let savedAmount = 0;

let savingHistory = [];


// ===============================
// เริ่มระบบ
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadData();

        renderIncome();

        renderExpenses();

        calculate();

        updateGoal();

        renderHistory();

    }
);


// ===============================
// เพิ่มรายได้
// ===============================

function addIncome() {

    let name = prompt(
        "ชื่อแหล่งรายได้ เช่น งานร้านอาหาร"
    );

    if (
        name === null ||
        name.trim() === ""
    ) {
        return;
    }


    let amountText = prompt(
        "จำนวนเงิน เช่น 4500"
    );

    if (amountText === null) {
        return;
    }


    let amount = Number(amountText);


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

        name: name.trim(),

        amount: amount

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


    if (incomes.length === 0) {

        list.innerHTML = `
            <p class="description">
                ยังไม่มีรายได้<br>
                กด ＋ เพิ่ม เพื่อเพิ่มรายได้
            </p>
        `;

        return;
    }


    incomes.forEach(
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
// ===============================

function addExpense() {

    let name = prompt(
        "รายการค่าใช้จ่าย เช่น ค่าอาหาร"
    );


    if (
        name === null ||
        name.trim() === ""
    ) {
        return;
    }


    let category = prompt(
        "หมวดหมู่ เช่น อาหาร / เดินทาง / ช้อปปิ้ง"
    );


    if (
        category === null ||
        category.trim() === ""
    ) {
        return;
    }


    let amountText = prompt(
        "จำนวนเงิน เช่น 100"
    );


    if (amountText === null) {
        return;
    }


    let amount = Number(amountText);


    if (
        isNaN(amount) ||
        amount <= 0
    ) {

        alert(
            "กรุณาใส่จำนวนเงินให้ถูกต้อง"
        );

        return;
    }


    expenses.push({

        id: Date.now(),

        name: name.trim(),

        category: category.trim(),

        amount: amount

    });


    saveData();

    renderExpenses();

    calculate();

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


    if (expenses.length === 0) {

        list.innerHTML = `
            <p class="description">
                ยังไม่มีค่าใช้จ่าย
            </p>
        `;

        return;
    }


    expenses.forEach(
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
// คำนวณทั้งหมด
// ===============================

function calculate() {

    // รายได้รวม
    let totalIncome =
        incomes.reduce(
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


    // ค่าใช้จ่ายจริง
    let totalExpense =
        expenses.reduce(
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


    // เงินที่ควรใช้
    let plannedRemain =
        totalIncome -
        saving -
        investment;


    // เงินคงเหลือจริง
    let actualRemain =
        plannedRemain -
        totalExpense;


    // =========================
    // แสดงรายได้
    // =========================

    const incomeElement =
        document.getElementById(
            "income"
        );

    if (incomeElement) {

        incomeElement.textContent =
            formatMoney(totalIncome);

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


    if (savingPercentElement) {

        savingPercentElement.textContent =
            savingPercent + "%";

    }


    if (savingElement) {

        savingElement.textContent =
            formatMoney(saving);

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


    if (investmentPercentElement) {

        investmentPercentElement.textContent =
            investmentPercent + "%";

    }


    if (investmentElement) {

        investmentElement.textContent =
            formatMoney(investment);

    }


    // =========================
    // เงินควรใช้
    // =========================

    const remainElement =
        document.getElementById(
            "remain"
        );


    if (remainElement) {

        remainElement.textContent =
            formatMoney(plannedRemain);

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
            formatMoney(totalExpense);

    }


    // =========================
    // เงินเหลือจริง
    // =========================

    const actualRemainElement =
        document.getElementById(
            "actualRemain"
        );


    if (actualRemainElement) {

        actualRemainElement.textContent =
            formatMoney(actualRemain);

    }


    // =========================
    // สถานะงบ
    // =========================

    const budgetMessage =
        document.getElementById(
            "budgetMessage"
        );


    if (budgetMessage) {

        if (totalExpense > plannedRemain) {

            budgetMessage.textContent =
                "⚠️ ค่าใช้จ่ายเกินเงินที่วางแผนไว้";

        }
        else {

            let left =
                plannedRemain -
                totalExpense;


            budgetMessage.textContent =
                "เหลืองบอีก " +
                formatMoney(left);

        }

    }

}


// ===============================
// บันทึกเงินออมเดือนนี้
// ===============================

function saveThisMonth() {

    let totalIncome =
        incomes.reduce(
            function (
                total,
                income
            ) {

                return total + income.amount;

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


    let month =
        new Date().toLocaleDateString(
            "th-TH",
            {
                month: "long",
                year: "numeric"
            }
        );


    let alreadySaved =
        savingHistory.some(
            function (item) {

                return item.month === month;

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

        month: month,

        amount: saving

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
                            ${escapeHTML(item.month)}
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

    savingPercent = percent;

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


    savingGoal = goal;

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


    document.getElementById(
        "savingGoal"
    ).textContent =
        formatMoney(
            savingGoal
        );


    document.getElementById(
        "savedAmount"
    ).textContent =
        formatMoney(
            savedAmount
        );


    let percent = 0;


    if (savingGoal > 0) {

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


    document.getElementById(
        "goalPercent"
    ).textContent =
        percent.toFixed(1) + "%";


    document.getElementById(
        "progressFill"
    ).style.width =
        percent + "%";


    const message =
        document.getElementById(
            "goalMessage"
        );


    if (
        savedAmount >= savingGoal
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


    if (
        savedPercent !== null
    ) {

        savingPercent =
            Number(
                savedPercent
            );

    }


    if (
        savedInvestmentPercent !== null
    ) {

        investmentPercent =
            Number(
                savedInvestmentPercent
            );

    }


    if (
        savedGoal !== null
    ) {

        savingGoal =
            Number(
                savedGoal
            );

    }


    if (
        savedMoney !== null
    ) {

        savedAmount =
            Number(
                savedMoney
            );

    }


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

}


// ===============================
// รูปแบบเงิน
// ===============================

function formatMoney(number) {

    return (
        number.toLocaleString(
            "th-TH"
        ) +
        " บาท"
    );

}


// ===============================
// ป้องกัน HTML แปลก ๆ
// ===============================

function escapeHTML(text) {

    return text
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
