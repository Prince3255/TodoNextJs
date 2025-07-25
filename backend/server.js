import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import { Pool } from 'pg' 

dotenv.config()

const app = express()
app.use(cors({
    origin: '*',
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const connectionString = process.env.NEON_URL
const pool = new Pool({
    connectionString: connectionString,
})


const jwtSecretKey = process.env.JWT_SECRET_KEY || 'default-super-secret-key'

app.post('/api/auth/register', async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).send({ message: 'Email and password are required.' })
    }
    console.log(email)
    const hashedPassword = await bcrypt.hash(password, 10)
    try {
        await pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, hashedPassword])
        res.status(201).send({ message: 'User created successfully' })
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: 'Error creating user. The email might already be taken.' })
    }
})

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
        if (result.rows.length === 0) {
            return res.status(401).send({ message: 'Invalid credentials' })
        }

        const user = result.rows[0]
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).send({ message: 'Invalid credentials' })
        }

        const token = jwt.sign({ userId: user.id }, jwtSecretKey, { expiresIn: '1h' })
        res.json({ token })
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: 'Server error during login' })
    }
})

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, jwtSecretKey, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

app.get('/api/get/tasks', authenticateToken, async (req, res) => {
    const userId = req.user.userId

    if (!userId) {
        return res.status(401).send({ message: 'Unauthorized' })
    }
    try {
        const response = await pool.query('SELECT * FROM tasks WHERE user_id = $1', [userId])
        res.status(200).json(response.rows)
    } catch (error) {
        console.error(error)
    }
})

app.post('/api/tasks', authenticateToken, async (req, res) => {
    const { title, description } = req.body;
    const userId = req.user.userId;

    if (!title) {
        return res.status(400).send({ message: 'Title is required.' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO tasks (title, description, user_id) VALUES ($1, $2, $3) RETURNING *',
            [title, description || '', userId]
        );
        
        const newTask = result.rows[0];
        res.status(201).json(newTask);

    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).send({ message: 'Error creating task.' });
    }
});

app.listen(5000, () => console.log('Server listening on port 5000'))