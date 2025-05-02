require("dotenv").config({ path: "./config/config.env" });

const express = require("express");
const morgan = require("morgan");
const connectDB = require("./config/db");
const auth = require("./middlewares/auth");
const path = require("path");
const cors = require("cors");
const WebSocket = require("ws");
const axios = require("axios");

// Initialize express app
const app = express();

// Middlewares
app.use(express.json());
app.use(morgan("tiny"));
app.use(cors({ origin: "http://localhost:5173" }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Share WebSocket instance
const wss = new WebSocket.Server({ noServer: true });
app.locals.wss = wss;

// ESP32 URL
const ESP32_URL = "http://192.168.8.102/sensor-temperature";

// WebSocket connection handler
wss.on('connection', (ws) => {
    console.log('WebSocket client connected');

    // Send a welcome message to the client
    ws.send(JSON.stringify({ message: "Welcome to the WebSocket server!" }));

    ws.on('message', (message) => {
        console.log('📨 Received:', message);
        // Example echo:
        ws.send(`Echo: ${message}`);
    });

    ws.on('close', () => {
        console.log('WebSocket client disconnected');
    });
});

// Function to fetch data from ESP32 and broadcast to WebSocket clients
const fetchAndBroadcastESP32Data = async () => {
    try {
        const response = await axios.get(ESP32_URL, { timeout: 10000 }); // 10-second timeout
        if (response.status === 200) {
            const { temperature, humidity, soil_moisture, height } = response.data;

            const data = {
                temperature,
                humidity,
                soil_moisture,
                height,
                timestamp: new Date().toISOString(),
            };

            console.log("Fetched data from ESP32:", data);

            // Broadcast the data to all connected WebSocket clients
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(data));
                }
            });
        }
    } catch (error) {
        console.error("Error fetching data from ESP32:", error.message);
        // Retry logic
        setTimeout(fetchAndBroadcastESP32Data, 5000); // Retry after 5 seconds
    }
};

// Periodically fetch data from ESP32 and broadcast it
setInterval(fetchAndBroadcastESP32Data, 2000); // Fetch data every 2 seconds

// API Routes
app.use("/api/temperatureSendRcv", require("./routes/temperatureSendRcv"));
app.get("/protected", auth, (req, res) => {
    return res.status(200).json({ ...req.user._doc });
});

// Load other routes
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
// app.use('/api/tempaverage', require('./routes/tempaverage'));
app.use('/api/data', require('./routes/dataRoutes'));

// Start server
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, async () => {
    try {
        await connectDB();
        console.log(`HTTP server listening on port: ${PORT}`);
    } catch (error) {
        console.error("Error connecting to database:", error.message);
    }
});

// Handle WebSocket upgrade
server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});