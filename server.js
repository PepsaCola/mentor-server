import mongoose from "mongoose";
import app from "./app.js";
import dotenv from "dotenv";
import {Server} from "socket.io";
import * as http from "node:http";
import socketHandler from "./sokets/socketHandler.js";

dotenv.config();
const PORT = 3001;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

socketHandler(io)

const{NAME,PASS,LINK,DBNAME}=process.env;
mongoose.connect(`mongodb+srv://${NAME}:${PASS}@${LINK}/${DBNAME}?retryWrites=true&w=majority&appName=mentor`)
    .then(() => {
        server.listen(PORT,()=>{
            console.log(`Server started on port ${PORT}`);
        })
    })
    .catch((error) => {
        console.log(error);
        process.exit(1);
    })

