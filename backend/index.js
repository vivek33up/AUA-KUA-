import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import formsRoutes from "./routes/formsRoutes.js";
import applicationsRoutes from "./routes/applicationsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => res.send("Backend is working!"));

app.use("/test", authRoutes);
app.use("/forms", formsRoutes);
app.use("/applications", applicationsRoutes);
app.use("/admin", adminRoutes);
app.use("/upload", uploadRoutes);

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
