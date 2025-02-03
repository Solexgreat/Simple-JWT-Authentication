import express from 'express'
import { authorize, login} from '../auth/authService'
import { authenticate } from '../auth/authMiddleware';


const app = express();

const PORT = 3000;

app.use(express.json());

app.post('/api/auth/login', login)

app.get('/public', (req, res) =>{
    res.json({message: 'public route'})
} )

app.get('/user', authenticate, (req, res) =>{
    res.json({message: 'this route is protected for user'});
})

app.get('/api/contract', authorize(['admin']), (req, res) =>{
    res.json({message: 'this route is protected for user'});
})


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})