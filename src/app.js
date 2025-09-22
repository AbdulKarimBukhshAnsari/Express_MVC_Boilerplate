// this file is the entry point of the application

import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors"


const app = express();
const CORS_ORIGIN = process.env.CORS_ORIGIN ;

// defining the configurations

// for defining the ORGIN URL by which the request could be made

// adding middlewares which are necessary for the application , like urlencoded , json , cookie-parser , cors , static files
app.use(cors({
    origin : CORS_ORIGIN ,
    credentials : true 
}))

app.use(express.json({limit : '16kb'}));

app.use(express.urlencoded({extended : true , limit : '16kb'}));

app.use(express.static('public'));

app.use(cookieParser());

// WE are making the groups as per routes and then each routes contains the controller and controllers are comunicating with the models
import userRouter from "./routes/user.routes.js";

// all routers will be added as a middlewares do as per your feasibility now we have only user router for understanding 
app.use('/users' , userRouter) ;


export default app ; 