import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";




const app = express();




app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"10mb"}));
app.use(express.urlencoded({extended:true,limit:"10mb"}));
app.use(express.static("public"));
app.use(cookieParser());


//routes import
import userRoutes from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js";
import likeRoutes from "./routes/like.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";


//routes declaration
app.use("/api/v1/users",userRoutes);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/likes", likeRoutes);
app.use("/api/v1/subscriptions", subscriptionRouter);
//https://localhost:8000/api/v1/users/register
export {app};

