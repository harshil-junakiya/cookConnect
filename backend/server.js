import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/mongodb.js'
import authRoute from './routes/authRoute.js'
import recipeRoute from "./routes/recipeRoute.js";

dotenv.config()

const app = express()

connectDB()
app.use(express.json())
app.use(cors())


const PORT = process.env.PORT || 4000

app.get('/', (req, res)=> {
    res.send("API Working")
})


app.use("/api/auth", authRoute)
app.use("/api/recipes", recipeRoute)



app.listen(PORT, ()=>{
    console.log("Server Started", PORT)
})

