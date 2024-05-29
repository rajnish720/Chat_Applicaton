import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";
import connectToMongoDB from "./db/connection.js";

const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 5000;


// app.get('/', (req, res) =>{
//     res.send("Hello Brother!, How are You?");
// })

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);

app.listen(port, () => {
    connectToMongoDB();
    console.log(`Server started on ${port}...`);
})
