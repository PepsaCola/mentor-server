import express from 'express';
import cors from 'cors'
import authRouter from "./routes/authRouter.js";
import contactsRouter from "./routes/contactsRouter.js";

const app = express();
app.use(cors())
app.use(express.json());

app.use('/api/auth',authRouter);
app.use('/api/contacts',contactsRouter)

app.use((_,res)=>{

    res.status(404).send('Route not found');
})

app.use((err,req,res,next)=>{
    const {status = 500, message = 'Server error'} = err;
    res.status(status).json({message});
})

export default app;