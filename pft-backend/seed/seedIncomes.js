// seed/seedIncomes.js
const mongoose = require("mongoose");
const dayjs = require("dayjs");
const dotenv = require("dotenv");
const connectDB = require("../routes/db"); // adjust path if needed
const Income = require("../models/Income");
const Category = require("../models/Category");
const User = require("../models/User");

dotenv.config();

const seedIncomes = async () => {
  try {
    await connectDB();

    // Find the user by email
    const user = await User.findOne({ email: "ridmi.developer@gmail.com" });
    if (!user) {
      console.log("❌ No user found. Please create the user first.");
      process.exit(1);
    }

    // Get categories
    const categories = await Category.find();
    if (categories.length === 0) {
      console.log("❌ No categories found. Please seed categories first.");
      process.exit(1);
    }

    const incomes = [];
    const years = [2023, 2024, 2025];

    const sources = [
      "Salary",
      "Freelance",
      "Investment",
      "Bonus",
      "Part-time Job",
      "Gift",
    ];

    years.forEach((year) => {
      const endMonth = year === 2025 ? dayjs().month() + 1 : 12; // only up to current month in 2025

      for (let month = 1; month <= endMonth; month++) {
        const daysInMonth = dayjs(`${year}-${month}-01`).daysInMonth();

        // Create up to 5 random incomes per month
        for (let i = 0; i < 5; i++) {
          const randomDay = Math.floor(Math.random() * daysInMonth) + 1;
          const date = dayjs(`${year}-${month}-${randomDay}`).startOf("day").toDate();

          const category =
            categories[Math.floor(Math.random() * categories.length)];

          const description =
            sources[Math.floor(Math.random() * sources.length)];

          const amount = (Math.random() * 5000 + 2000).toFixed(2); // AED 2000–7000

          incomes.push({
            userId: user._id,
            description,
            amount,
            date, // stored as real Date
            category: category._id,
          });
        }
      }
    });

    await Income.insertMany(incomes);
    console.log(`✅ Inserted ${incomes.length} new incomes from 2023–2025`);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedIncomes();
