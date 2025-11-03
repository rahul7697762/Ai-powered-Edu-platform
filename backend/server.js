import express from "express";
import cors from "cors";
import resumeBuilderRoutes from "./routes/resumeBuilderRoutes.js";
import atsAnalyzerRoutes from "./routes/atsAnalyzerRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/resume-builder", resumeBuilderRoutes);
app.use("/api/ats-analyzer", atsAnalyzerRoutes);

app.listen(5000, () => console.log("✅ Backend running on port 5000"));
