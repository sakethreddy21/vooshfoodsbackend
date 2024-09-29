const express = require("express");
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const cookieSession= require('cookie-session')
dotenv.config();
import userRoutes from "./routes/userDetails";
import taskRoutes from './routes/taskRoutes'
import { connectMongoDB } from '../lib/config'; // Adjust the path as needed

connectMongoDB()

app.use(cors())
app.use(
    cookieSession({
        name:"session",
        keys:['cyberwolve'],
        maxAge:24*64*60*100.
    })
)


app.use(express.json());
// Routes



app.use('/users', userRoutes)
app.use('/tasks', taskRoutes)
app.get("/", (req:any, res:any) => res.json("Express on Vercel"));

app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;