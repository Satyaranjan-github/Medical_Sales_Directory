import cors from "cors"
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import brandRoutes from "../src/brand/brand.route"
import medicineRoutes from '../src/medicine/medicine.route'

dotenv.config()

const app = express()
const PORT = process.env.PORT
const MONGO_URI = process.env.MONGO_URI
app.use(express.json())

// 2. Configure CORS
app.use(cors({
    origin: 'http://localhost:5173', // Allow your React app
    methods: ['GET', 'POST', 'PUT', 'DELETE', "PATCH"],
    credentials: true // Allow cookies/headers if needed
}));

app.use("/api/medicines", medicineRoutes)
app.use("/api/brands", brandRoutes)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

mongoose.connect(MONGO_URI!)
    .then(() => {
        console.log('✅ Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`****************************************************
🚀 Server is up and running!
🌐 Visit your app here: http://localhost:${PORT}
****************************************************`);
        })
    })
    .catch(err => console.error('❌ DB Connection Error:', err));