import express from "express";
import cors from 'cors'
import "dotenv/config"
import { pool } from "./db/database.js";
import bcrypt from 'bcrypt';
import userRouter from "./routes/userRoute.js";

const app = express()

const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors())


app.get('/' , (req , res)=> res.send('Server is running'))
//  SignIn
app.post('/signup' , async(req , res)=>{
    const {email , password} = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try{
        const saltRound = 10;
        const hash_password = await bcrypt.hash(password, saltRound);

        const query = "INSERT INTO users(email, password_hash) VALUES ($1, $2) Returning id, email"
        const value = [email , hash_password]

        const result = await pool.query(query , value)

        res.status(201).json({
            message : "Successfully Added",
            user : result.rows[0]
        })

    }catch(error){
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Email already exists' });
        }
        console.error(error);

        res.status(500).json({ error: 'Database error occurred during signup' });
    
        }
})

app.post('/login' , async(req , res)=>{

    const {email , password} = req.body

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    } 

    try {
        const queryText = "Select * from users where email = $1"
        const result = await pool.query(queryText , [email])

        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const user = result.rows[0]
        console.log(user)

        const isMatch = await bcrypt.compare(password , user.password_hash)

        if(!isMatch){
            return res.status(400).json({ error: 'Invalid email or password'})
        }

        res.json({
            message: 'Login successful!',
            user: { id: user.id, email: user.email}
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error occurred during login' });
    }


})


app.use('/api/users', userRouter);


app.listen(PORT , ()=>{
    // console.log(`Server Running on ${PORT}`)
    console.log(`Server running on http://localhost:${PORT}`);
    console.log("DB URL:", JSON.stringify(process.env.DATABASE_URL));
    
})


