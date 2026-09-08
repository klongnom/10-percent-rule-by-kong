// ===============================
// 10% Rule by Kong
// ระบบรายได้ + ออม + ลงทุน + เป้าหมาย
// ===============================

let incomes = [];

let savingPercent = 10;

let investmentPercent = 5;

let savingGoal = 30000;

let savedAmount = 0;


// ===============================
// เริ่มระบบ
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadData();

        renderIncome();

        calculate();

        updateGoal();

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
// คำนวณ
// ===============================

function calculate() {

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


    let saving =
        totalIncome *
        savingPercent /
        100;


    let investment =
        totalIncome *
        investmentPercent /
        100;


    let remain =
        totalIncome -
        saving -
        investment;


    document.getElementById(
        "income"
    ).textContent =
        formatMoney(
            totalIncome
        );


    document.getElementById(
        "savingPercent"
    ).textContent =
        savingPercent + "%";


    document.getElementById(
        "saving"
    ).textContent =
        formatMoney(
            saving
        );


    document.getElementById(
        "investmentPercent"
    ).textContent =
        investmentPercent + "%";


    document.getElementById(
        "investment"
    ).textContent =
        formatMoney(
            investment
        );


    document.getElementById(
        "remain"
    ).textContent =
        formatMoney(
            remain
        );


    updateGoal();

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
// ตั้งเป้าหมายเงินก้อน
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


    const savedElement =
        document.getElementById(
            "savedAmount"
        );


    const percentElement =
        document.getElementById(
            "goalPercent"
        );


    const fillElement =
        document.getElementById(
            "progressFill"
        );


    const messageElement =
        document.getElementById(
            "goalMessage"
        );


    if (!goalElement) {

        return;

    }


    goalElement.textContent =
        formatMoney(
            savingGoal
        );


    savedElement.textContent =
        formatMoney(
            savedAmount
        );


    let percent =
        0;


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


    percentElement.textContent =
        percent.toFixed(1) + "%";


    fillElement.style.width =
        percent + "%";


    if (savedAmount >= savingGoal) {

        messageElement.textContent =
            "🎉 เป้าหมายเงินก้อนสำเร็จแล้ว!";

    }
    else {

        let remaining =
            savingGoal -
            savedAmount;


        messageElement.textContent =
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

}


// ===============================
// โหลดข้อมูล
// ===============================

function loadData() {

    const savedIncomes =
        localStorage.getItem(
            "kongIncomes"
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
