function calculate() {

    // รายได้ตัวอย่าง
    let income = 15000;

    // เปอร์เซ็นต์ออม
    let percent = 10;

    // คำนวณเงินออม
    let saving = income * percent / 100;

    // เงินที่เหลือใช้
    let remain = income - saving;


    // แสดงผล
    document.getElementById("income").textContent =
        savingFormat(income);

    document.getElementById("savingPercent").textContent =
        percent + "%";

    document.getElementById("saving").textContent =
        savingFormat(saving);

    document.getElementById("remain").textContent =
        savingFormat(remain);
}


// จัดรูปแบบตัวเลข
function savingFormat(number) {

    return number.toLocaleString("th-TH") + " บาท";

}
