"use client";

import { useEffect, useMemo, useState } from "react";

import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";

export default function Home() {

  const [data, setData] = useState<any[]>([]);
  const [goalsData, setGoalsData] = useState<any[]>([]);
  const [incomeData, setIncomeData] = useState<any[]>([]);
  const [budgetData, setBudgetData] = useState<any[]>([]);

  const [open, setOpen] = useState(false);
  

  const [type, setType] = useState("รายรับ");
  const [category, setCategory] = useState("เงินเดือน");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [month, setMonth] = useState("พฤษภาคม");
  const [budgetCategory, setBudgetCategory] =
  useState("ค่าใช้ชีวิตประจำวัน");

const [editOpen, setEditOpen] =
  useState(false);

const [editingRow, setEditingRow] =
  useState<any>(null);

const [editCategory, setEditCategory] =
  useState("");

const [editAmount, setEditAmount] =
  useState("");
  const [budgetAmount, setBudgetAmount] =
  useState("");

 const expenseCategories = [
  "ค่าใช้ชีวิตประจำวัน",
  "ค่าน้ำมัน",
  "ค่าโทรศัพท์",
  "หนี้",
  "ค่าผ่อน",
  "เงินเก็บญี่ปุ่น",
  "เงินเก็บน่าน",
  "เงินเก็บฉุกเฉิน",
  "อื่นๆ",
];

  const goalCategories = [
    "ญี่ปุ่น",
    "น่าน",
    "ฉุกเฉิน",
  ];

  const incomeCategories = [
    "เงินเดือน",
    "ผ่อน",
    "อื่นๆ",
  ];

  const months = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  const goals: any = {
    ญี่ปุ่น: 80000,
    น่าน: 10000,
    ฉุกเฉิน: 9999,
  };

  async function fetchData() {

    try {

      const res = await fetch(
        "https://sheets.googleapis.com/v4/spreadsheets/1ZiN5R43khUEK9XqMYeYzEvMYuYGNM15PovdyHE0KDsc/values/Expense!A1:F100?key=AIzaSyArAT0z9Yn-K4g0TcixeoHuRVmY0_q5KVc"
      );

      const json = await res.json();

      if (json.values) {
        setData(json.values.slice(1));
      }

    } catch (error) {
      console.log(error);
    }

  }

  async function fetchGoals() {

    try {

      const res = await fetch(
        "https://sheets.googleapis.com/v4/spreadsheets/1ZiN5R43khUEK9XqMYeYzEvMYuYGNM15PovdyHE0KDsc/values/Savings!A1:D100?key=AIzaSyArAT0z9Yn-K4g0TcixeoHuRVmY0_q5KVc"
      );

      const json = await res.json();

      if (json.values) {
        setGoalsData(json.values.slice(1));
      }

    } catch (error) {
      console.log(error);
    }

  }

  async function fetchIncome() {

    try {

      const res = await fetch(
        "https://sheets.googleapis.com/v4/spreadsheets/1ZiN5R43khUEK9XqMYeYzEvMYuYGNM15PovdyHE0KDsc/values/Income!A1:D100?key=AIzaSyArAT0z9Yn-K4g0TcixeoHuRVmY0_q5KVc"
      );

      const json = await res.json();

      if (json.values) {
        setIncomeData(json.values.slice(1));
      }

    } catch (error) {
      console.log(error);
    }

  }

  async function fetchBudget() {

    try {

      const res = await fetch(
        "https://sheets.googleapis.com/v4/spreadsheets/1ZiN5R43khUEK9XqMYeYzEvMYuYGNM15PovdyHE0KDsc/values/Allocation!A1:E100?key=AIzaSyArAT0z9Yn-K4g0TcixeoHuRVmY0_q5KVc"
      );

      const json = await res.json();

      if (json.values) {
        setBudgetData(json.values.slice(1));
      }

    } catch (error) {
      console.log(error);
    }

  }

  useEffect(() => {

    fetchData();
    fetchGoals();
    fetchIncome();
    fetchBudget();

  }, []);

  useEffect(() => {

    const saved = localStorage.getItem(
      "money-dashboard-month"
    );

    if (saved) {
      setMonth(saved);
    }

  }, []);

  useEffect(() => {

    localStorage.setItem(
      "money-dashboard-month",
      month
    );

  }, [month]);

  const filteredData = data.filter(
    (row) => row[1] === month
  );

  const filteredSavings = goalsData.filter(
    (row) => row[1] === month
  );

  const filteredIncome = incomeData.filter(
    (row) => row[1] === month
  );

  const allTransactions = useMemo(() => {

    return [

      ...filteredData.map((row, index) => ({
  rowNumber: index + 2,
        date: row[0],
        month: row[1],
        category: row[3],
        amount: row[4],
        type: "expense",
      })),

      ...filteredSavings.map((row) => ({
        date: row[0],
        month: row[1],
        category: row[2],
        amount: row[3],
        type: "saving",
      })),

      ...filteredIncome.map((row) => ({
        date: row[0],
        month: row[1],
        category: row[2],
        amount: row[3],
        type: "income",
      })),

    ].reverse();

  }, [
    filteredData,
    filteredSavings,
    filteredIncome,
  ]);

  const expenseData = filteredData.filter(
    (row) => expenseCategories.includes(row[3])
  );

  const totalIncome = filteredIncome.reduce(
    (sum, row) =>
      sum + Number(row[3] || 0),
    0
  );

  const totalExpense = expenseData.reduce(
  (sum, row) =>
    sum + Number(row[4] || 0),
  0
);



const totalSavingsThisMonth =
  filteredSavings.reduce(
    (sum, row) =>
      sum + Number(row[3] || 0),
    0
  );

const remainingBalance =
  totalIncome - totalExpense - totalSavingsThisMonth;
const today = new Date().toLocaleDateString("th-TH");

const todayExpense = expenseData.filter(
  (row) => row[0] === today
);

const todayExpenseTotal = todayExpense.reduce(
  (sum, row) =>
    sum + Number(row[4] || 0),
  0
);
  const realBalance =
    totalIncome -
    totalExpense -
    totalSavingsThisMonth;

  const grouped: any = {};

  expenseData.forEach((row) => {

    const category = row[3];
    const amount = Number(row[4] || 0);

    if (!grouped[category]) {
      grouped[category] = 0;
    }

    grouped[category] += amount;

  });

  const chartData = Object.keys(grouped).map((key) => ({
    name: key,
    value: grouped[key],
  }));

  const COLORS = [
    "#22c55e",
    "#3b82f6",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#14b8a6",
  ];

  async function addExpense() {

  let sheetName = "Expense";

  let row: any[] = [];

  const today = new Date().toLocaleDateString("th-TH");

  if (type === "รายรับ") {

    sheetName = "Income";

    row = [
      today,
      month,
      category,
      amount,
      "",
    ];

  } else if (type === "รายจ่าย") {

    sheetName = "Expense";

    row = [
      today,
      month,
      "",
      category,
      amount,
      "",
    ];

  } else {

    sheetName = "Savings";

    row = [
      today,
      month,
      category,
      amount,
    ];

  }

  try {

  console.log(sheetName);
  console.log(row);
if (
  category === "เงินเก็บญี่ปุ่น" ||
  category === "เงินเก็บน่าน" ||
  category === "เงินเก็บฉุกเฉิน"
) {

  let goalName = "";

  if (category === "เงินเก็บญี่ปุ่น") {
    goalName = "ญี่ปุ่น";
  }

  if (category === "เงินเก็บน่าน") {
    goalName = "น่าน";
  }

  if (category === "เงินเก็บฉุกเฉิน") {
    goalName = "ฉุกเฉิน";
  }

  fetch(
    "https://script.google.com/macros/s/AKfycbyBCUIRtaaKmrPCcDufS0CoLKmoiEmmeUhyjd2Rj7bpkF_FhW6ALHqKRy0HK7YRWPhDUQ/exec",
    {
      method: "POST",

      mode: "no-cors",

      body: JSON.stringify({
        sheet: "Savings",
        row: [
          today,
          month,
          goalName,
          amount,
        ],
      }),
    }
  );

}
 fetch(
  "https://script.google.com/macros/s/AKfycbyBCUIRtaaKmrPCcDufS0CoLKmoiEmmeUhyjd2Rj7bpkF_FhW6ALHqKRy0HK7YRWPhDUQ/exec",
  {
    method: "POST",

    mode: "no-cors",

    body: JSON.stringify({
      sheet: sheetName,
      row,
    }),
  }
);

    alert("เพิ่มรายการสำเร็จ 🔥");
    setTimeout(() => {

  window.location.reload();

}, 1000);

    
    setOpen(false);

    setAmount("");
    setNote("");

  } catch (error) {

    console.log(error);

    alert("เกิดข้อผิดพลาด");

  }

}

  return (

    <main className="bg-gray-100 min-h-screen p-5">

      {/* MODAL */}

      {open && (

  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

    <div className="bg-white rounded-3xl p-8 w-[420px] shadow-2xl">

      <h2 className="text-3xl font-bold mb-6">
        ➕ เพิ่มรายการ
      </h2>

      <div className="flex flex-col gap-4">

        {/* TYPE */}

        <select
          value={type}
          onChange={(e) => {

            setType(e.target.value);

            if (e.target.value === "รายรับ") {

              setCategory("เงินเดือน");

            } else {

              setCategory("ค่าใช้ชีวิตประจำวัน");

            }

          }}
          className="border p-4 rounded-2xl"
        >

          <option value="รายรับ">
            รายรับ
          </option>

          <option value="รายจ่าย">
            รายจ่าย
          </option>

        </select>

        {/* CATEGORY */}

        {/* CATEGORY */}

<select
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  className="border p-4 rounded-2xl"
>

  {(type === "รายรับ"

    ? [
        "เงินเดือน",
        "ผ่อน",
        "อื่นๆ",
      ]

    : [
  "ค่าใช้ชีวิตประจำวัน",
  "ค่าน้ำมัน",
  "หนี้",
  "ค่าผ่อน",
  "ค่าโทรศัพท์",
  "เงินเก็บญี่ปุ่น",
  "เงินเก็บน่าน",
  "เงินเก็บฉุกเฉิน",
  "อื่นๆ",
]

  ).map((item) => (

    <option
      key={item}
      value={item}
    >
      {item}
    </option>

  ))}

</select>

{/* GOAL SELECT */}

{category === "เป้าหมาย" && (

  <select
    value={note}
    onChange={(e) => setNote(e.target.value)}
    className="border p-4 rounded-2xl"
  >

    <option value="ญี่ปุ่น">
      ญี่ปุ่น
    </option>

    <option value="น่าน">
      น่าน
    </option>

    <option value="ฉุกเฉิน">
      ฉุกเฉิน
    </option>

  </select>

)}

        {/* NOTE */}

        {(category === "ผ่อน" ||
          category === "อื่นๆ") && (

          <input
            type="text"
            placeholder="หมายเหตุ / เงินมาจากไหน"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="border p-4 rounded-2xl"
          />

        )}

        {/* MONTH */}

        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border p-4 rounded-2xl"
        >

          {months.map((item) => (

            <option
              key={item}
              value={item}
            >
              {item}
            </option>

          ))}

        </select>

        {/* AMOUNT */}

        <input
          type="number"
          placeholder="จำนวนเงิน"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-4 rounded-2xl"
        />

        {/* BUTTON */}

        <div className="flex gap-3 mt-4">

          <button
            onClick={addExpense}
            className="bg-black text-white px-6 py-3 rounded-2xl w-full"
          >
            เพิ่ม
          </button>

          <button
            onClick={() => setOpen(false)}
            className="bg-gray-200 px-6 py-3 rounded-2xl w-full"
          >
            ยกเลิก
          </button>

        </div>

      </div>

    </div>

  </div>

)}

      {/* HEADER */}

      <div className="flex items-center justify-between mb-8">

        <div className="flex items-center gap-3">

          <img
            src="https://cdn-icons-png.flaticon.com/512/2331/2331941.png"
            width={50}
          />

          <h1 className="text-5xl font-bold">
            Money Dashboard
          </h1>

        </div>

        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border p-3 rounded-2xl bg-white"
        >

          {months.map((item) => (

            <option
              key={item}
              value={item}
            >
              {item}
            </option>

          ))}

        </select>

      </div>

      {/* BUTTON */}

      <div className="mb-6">

        <button
          onClick={() => setOpen(true)}
          className="bg-black text-white px-6 py-3 rounded-2xl"
        >
          ➕ เพิ่มรายการ
        </button>

      </div>
      {/* BUDGET SETTING */}

<div className="bg-white p-6 rounded-3xl shadow-xl mb-8">

  <h2 className="text-3xl font-bold mb-6">
    💼 ตั้งงบประมาณ
  </h2>

  <div className="flex flex-col md:flex-row gap-4">

    <select
      value={budgetCategory}
      onChange={(e) =>
        setBudgetCategory(e.target.value)
      }
      className="border p-4 rounded-2xl w-full"
    >

      <option>
        ค่าใช้ชีวิตประจำวัน
      </option>

      <option>
        ค่าน้ำมัน
      </option>

      <option>
        ค่าโทรศัพท์
      </option>

      <option>
        หนี้
      </option>

      <option>
        ค่าผ่อน
      </option>

    </select>

    <input
      type="number"
      placeholder="จำนวนงบ"
      value={budgetAmount}
      onChange={(e) =>
        setBudgetAmount(e.target.value)
      }
      className="border p-4 rounded-2xl w-full"
    />

    <button
      onClick={async () => {
if (!budgetAmount) return;

const currentAmount = budgetAmount;

const today =
  new Date().toLocaleDateString("th-TH");
        fetch(
          "https://script.google.com/macros/s/AKfycbyBCUIRtaaKmrPCcDufS0CoLKmoiEmmeUhyjd2Rj7bpkF_FhW6ALHqKRy0HK7YRWPhDUQ/exec",
          {
            method: "POST",

            mode: "no-cors",

            body: JSON.stringify({
              sheet: "Allocation",
              row: [
  today,
  month,
  "งบประมาณ",
  budgetCategory,
  currentAmount,
],
            }),
          }
        );

        alert("ตั้งงบสำเร็จ 🔥");

        setTimeout(() => {

  fetchBudget();

}, 1000);

setBudgetAmount("");

      }}
      className="bg-blue-600 text-white px-6 rounded-2xl"
    >
      บันทึกงบ
    </button>

  </div>

</div>
      
{/* CARDS */}

<div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">

  <div className="bg-white p-6 rounded-3xl shadow-xl">
    <p className="text-gray-500 mb-2">
      💵 รายรับเดือนนี้
    </p>

    <h2 className="text-lg md:text-3xl font-bold text-green-600">
      ฿{totalIncome}
    </h2>
  </div>

  <div className="bg-white p-6 rounded-3xl shadow-xl">
    <p className="text-gray-500 mb-2">
      💸 รายจ่ายเดือนนี้
    </p>

    <h2 className="text-lg md:text-3xl font-bold text-red-500">
      ฿{totalExpense}
    </h2>
  </div>

  <div className="bg-white p-6 rounded-3xl shadow-xl">
    <p className="text-gray-500 mb-2">
      🎯 เงินเก็บเดือนนี้
    </p>

    <h2 className="text-lg md:text-3xl font-bold text-blue-500">
      ฿{totalSavingsThisMonth}
    </h2>
  </div>

  <div className="bg-white p-6 rounded-3xl shadow-xl">
    <p className="text-gray-500 mb-2">
      🟢 เงินคงเหลือจริง
    </p>

    <h2 className="text-lg md:text-3xl font-bold text-emerald-600">
      ฿{realBalance}
    </h2>
  </div>

  <div className="bg-white p-6 rounded-3xl shadow-xl">
    <p className="text-gray-500 mb-2">
      🔥 วันนี้ใช้ไป
    </p>

    <h2 className="text-lg md:text-3xl font-bold text-red-500">
      ฿{todayExpenseTotal}
    </h2>
  </div>

</div>


      {/* EXPENSE CHART */}

      <div className="bg-white rounded-3xl shadow-xl p-6 mb-8">

        <h2 className="text-3xl font-bold mb-6">
          📊 กราฟรายจ่าย
        </h2>

        <div className="w-full h-[400px]">

          <ResponsiveContainer width="100%" height="100%">

            <PieChart>

              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                outerRadius={140}
                label={({ name, value }) =>
                  `${name} ฿${value}`
                }
              >

                {chartData.map((entry, index) => (

                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />

                ))}

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* SAVINGS CHART */}

      <div className="bg-white rounded-3xl shadow-xl p-6 mb-8">

        <h2 className="text-3xl font-bold mb-6">
          🎯 กราฟเงินเก็บ
        </h2>

        <div className="w-full h-[400px]">

          <ResponsiveContainer width="100%" height="100%">

            <PieChart>

              <Pie
                data={goalCategories.map((goal) => {

                  const current = goalsData
                    .filter((row) => row[2] === goal)
                    .reduce((sum, row) =>
                      sum + Number(row[3] || 0), 0);

                  return {
                    name: goal,
                    value: current,
                  };

                })}
                dataKey="value"
                nameKey="name"
                outerRadius={140}
                label={({ name, value }) =>
                  `${name} ฿${value}`
                }
              >

                {goalCategories.map((_, index) => (

                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />

                ))}

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* GOALS */}

      <div className="bg-white rounded-3xl shadow-xl p-6 mb-8">

        <h2 className="text-3xl font-bold mb-6">
          🎯 เป้าหมายการเงิน
        </h2>

        <div className="flex flex-col gap-6">

          {goalCategories.map((goal) => {

            const current = goalsData
              .filter((row) => row[2] === goal)
              .reduce((sum, row) =>
                sum + Number(row[3] || 0), 0);

            const monthlyGoal = goalsData
              .filter(
                (row) =>
                  row[1] === month &&
                  row[2] === goal
              )
              .reduce(
                (sum, row) =>
                  sum + Number(row[3] || 0),
                0
              );

            const target = goals[goal];

            const percent =
              Math.min((current / target) * 100, 100);

            let progressColor =
              "bg-red-500";

            if (percent >= 30) {
              progressColor = "bg-yellow-500";
            }

            if (percent >= 70) {
              progressColor = "bg-green-500";
            }

            return (

              <div
                key={goal}
                className="bg-gray-100 p-5 rounded-3xl"
              >

                <div className="flex justify-between items-center mb-2">

                  <h3 className="text-2xl font-bold">
                    🎯 {goal}
                  </h3>

                  <p className="font-bold">
                    ฿{current} / ฿{target}
                  </p>

                </div>

                <div className="w-full bg-gray-300 rounded-full h-5 overflow-hidden">

                  <div
                    className={`${progressColor} h-full rounded-full transition-all`}
                    style={{
                      width: `${percent}%`,
                    }}
                  />

                </div>

                <div className="flex gap-2 mt-3">

                  <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                    เดือนนี้ +฿{monthlyGoal}
                  </div>

                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                    {percent.toFixed(0)}%
                  </div>

                </div>

                <p className="mt-3 text-gray-600">
                  เหลืออีก ฿{target - current}
                </p>

              </div>

            );

          })}

        </div>

      </div>

      {/* BUDGET */}

      <div className="bg-white rounded-3xl shadow-xl p-6 mb-8">

        <h2 className="text-3xl font-bold mb-6">
          💼 งบประมาณรายเดือน
        </h2>

        <div className="flex flex-col gap-6">

          {budgetData
  .filter(
    (row, index, self) =>
      row[1] === month &&
      index ===
        self.findIndex(
          (r) =>
            r[3] === row[3]
        )
  )
            .map((budget, index) => {

              const category = budget[3];

              const budgetAmount =
                Number(budget[4] || 0);

              const used = filteredData
                .filter(
                  (row) => row[3] === category
                )
                .reduce(
                  (sum, row) =>
                    sum + Number(row[4] || 0),
                  0
                );

              const left =
                budgetAmount - used;

              const percent =
                Math.min(
                  (used / budgetAmount) * 100,
                  100
                );

              return (

                <div
                  key={index}
                  className="bg-gray-100 p-5 rounded-3xl"
                >

                  <div className="flex justify-between mb-2">

                    <h3 className="text-2xl font-bold">
                      {category}
                    </h3>
<button
  onClick={() => {

    const filtered = budgetData.filter(
      (_, i) => i !== index
    );

    setBudgetData(filtered);

  }}
  className="bg-red-500 text-white px-3 py-1 rounded-xl text-sm"
>
  ลบ
</button>
                    <p className="font-bold">
                      ฿{used} / ฿{budgetAmount}
                    </p>

                  </div>

                  <div className="w-full bg-gray-300 rounded-full h-5 overflow-hidden">

                    <div
                      className={`h-full rounded-full ${
                        used > budgetAmount
                          ? "bg-red-500"
                          : "bg-blue-500"
                      }`}
                      style={{
                        width: `${percent}%`,
                      }}
                    />

                  </div>

                  <p className="mt-2 font-bold">

                    {left >= 0
                      ? `เหลือ ฿${left}`
                      : `เกินงบ ฿${Math.abs(left)}`}

                  </p>

                </div>

              );

            })}

        </div>

      </div>

      {/* TABLE */}

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

        <table className="w-full">

          <thead className="bg-black text-white">

            <tr>

              <th className="text-left p-2 text-xs md:text-base">
                วันที่
              </th>

              <th className="text-left p-2 text-xs md:text-base">
                เดือน
              </th>

              <th className="text-left p-2 text-xs md:text-base">
                หมวด
              </th>

              <th className="text-left p-2 text-xs md:text-base">
                ประเภท
              </th>

              <th className="text-left p-2 text-xs md:text-base">
                จำนวน
              </th>
<th className="text-left p-2 text-xs md:text-base">
  จัดการ
</th>
            </tr>

          </thead>

          <tbody>

            {allTransactions.map((row, index) => {

              let rowStyle =
                "bg-white";

              let textStyle =
                "text-black";

              let label =
                "รายจ่าย";

              if (row.type === "income") {

                rowStyle =
                  "bg-green-50";

                textStyle =
                  "text-green-600";

                label =
                  "รายรับ";

              }

              if (row.type === "saving") {

                rowStyle =
                  "bg-blue-50";

                textStyle =
                  "text-blue-600";

                label =
                  "เงินเก็บ";

              }

              return (

                <tr
                  key={index}
                  className={`border-b hover:bg-gray-100 transition ${rowStyle}`}
                >

                  <td className="p-4">
                    {row.date}
                  </td>

                  <td className="p-4">
                    {row.month}
                  </td>

                  <td className={`p-4 font-bold ${textStyle}`}>
                    {row.category}
                  </td>

                  <td className={`p-4 font-bold ${textStyle}`}>
                    {label}
                  </td>

                  <td className={`p-4 font-bold ${textStyle}`}>
                    ฿{row.amount}
                  </td>
                  <td className="p-4">

  <button
    onClick={async () => {

      const confirmDelete =
        confirm("ลบรายการนี้?");

      if (!confirmDelete) return;

      await fetch(
        "https://script.google.com/macros/s/AKfycbyBCUIRtaaKmrPCcDufS0CoLKmoiEmmeUhyjd2Rj7bpkF_FhW6ALHqKRy0HK7YRWPhDUQ/exec",
        {
          method: "POST",

          mode: "no-cors",

          body: JSON.stringify({
            action: "delete",
            sheet: "Expense",
            row: index + 2,
          }),
        }
      );

      alert("ลบสำเร็จ 🔥");

      setTimeout(() => {

        fetchData();

      }, 1000);

    }}
    className="bg-red-500 text-white px-2 py-1 text-sm rounded-xl"
  >
    ลบ
  </button>

</td>

                </tr>

              );

            })}

          </tbody>

        </table>

      </div>

    </main>

  );

}