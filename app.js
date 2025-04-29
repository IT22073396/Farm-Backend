require("dotenv").config({ path: "./config/config.env" });

const express = require('express');
const morgan = require('morgan');
const connectDB = require("./config/db");
const auth = require("./middlewares/auth");
const path = require('path');

// Initialize express app
const app = express();

// Middlewares
app.use(express.json());
app.use(morgan("tiny"));
app.use(require("cors")());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Protected route
app.get("/protected", auth, (req, res) => {
    return res.status(200).json({ ...req.user._doc });
});

// Routes
app.use("/api", require("./routes/auth"));
app.use("/api/employees", require("./routes/employees"));
app.use("/api/payslips", require("./routes/payslips"));
app.use("/api/leaves", require("./routes/leaves"));
app.use("/api/suppliers", require("./routes/suppliers"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/products", require("./routes/products"));
app.use("/api/mails", require("./routes/mails"));
app.use("/api/deliveries", require("./routes/deliveries"));
app.use("/api/inventories", require("./routes/inventories"));
app.use("/api/vehicles", require("./routes/vehicles"));
app.use("/api/invoices", require("./routes/invoices"));
app.use("/api/financials", require("./routes/financials"));
app.use("/api/reset-password", require("./routes/resetpasswordrequest"));
app.use("/api/carts", require("./routes/carts"));
app.use("/api/checkouts", require("./routes/checkouts"));
app.use("/api/customerorder", require("./routes/customerorder"));
app.use("/api/feedbacks", require("./routes/feedbacks"));
app.use("/api/shipments", require("./routes/shipments"));
app.use("/api/tmails", require("./routes/tmails"));
// app.use("/api/temperatureController", require("./routes/temperatureController")); // added route

// Server configuration
const PORT = process.env.PORT || 4000;

// Start server after DB connection
app.listen(PORT, async () => {
    try {
        await connectDB();
        console.log(`Server listening on port: ${PORT}`);
    } catch (error) {
        console.log("Error connecting to database:", error.message);
    }
});

