import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import roomRoutes from "./routes/roomRoutes";

const app = express();

app.use(express.json());
app.use(cors());

app.use('/auth', authRoutes);
app.use('/room', roomRoutes);

app.listen(3001,() => {
    console.log("port started at 3001")
});