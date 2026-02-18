const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorMiddleware");


dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://ephemeral-cucurucho-377b2d.netlify.app"
  ],
  credentials: true
}));
const PORT = process.env.PORT || 3000;


app.use("/api/auth", authRoutes);

// Error Middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


