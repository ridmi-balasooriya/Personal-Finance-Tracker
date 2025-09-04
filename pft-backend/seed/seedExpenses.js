// seed/seedExpenses.js
const mongoose = require("mongoose");
const dayjs = require("dayjs");
const dotenv = require("dotenv");
const connectDB = require("../routes/db"); // adjust if needed
const Expense = require("../models/Expense");
const Category = require("../models/Category");
const User = require("../models/User");

dotenv.config();

const seedExpenses = async () => {
  try {
    await connectDB();

    // ✅ Get the correct user by email
    const user = await User.findOne({ email: "ridmi.developer@gmail.com" });
    if (!user) {
      console.log("❌ User 'ridmi.developer@gmail.com' not found. Please register first.");
      process.exit(1);
    }

    // Get categories
    const categories = await Category.find();
    if (categories.length === 0) {
      console.log("❌ No categories found. Please seed categories first.");
      process.exit(1);
    }

    const expenses = [];
    const years = [2023, 2024, 2025];
    const descriptions = [
      "Groceries",
      "Dining out",
      "Transport",
      "Shopping",
      "Bills",
      "Entertainment",
      "Healthcare",
      "Education",
    ];

    years.forEach((year) => {
      const endMonth = year === 2025 ? dayjs().month() + 1 : 12; // up to current month in 2025
      for (let month = 1; month <= endMonth; month++) {
        const daysInMonth = dayjs(`${year}-${month}-01`).daysInMonth();

        // create up to 5 random expenses
        for (let i = 0; i < 5; i++) {
          const randomDay = Math.floor(Math.random() * daysInMonth) + 1;

          // ✅ store date with only YYYY-MM-DD (no time part)
          const date = dayjs(`${year}-${month}-${randomDay}`)
            .startOf("day") // midnight
            .toDate();

          const category =
            categories[Math.floor(Math.random() * categories.length)];
          const description =
            descriptions[Math.floor(Math.random() * descriptions.length)];
          const amount = Number((Math.random() * 500 + 50).toFixed(2));

          expenses.push({
            userId: user._id,
            description,
            amount,
            date,
            category: category._id,
          });
        }
      }
    });

    await Expense.insertMany(expenses);
    console.log(`✅ Inserted ${expenses.length} new expenses for user ${user.email} (2023–2025)`);
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding expenses:", err);
    process.exit(1);
  }
};

seedExpenses();
