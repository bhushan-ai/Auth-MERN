import { Router } from "express";
import userAuth from "../Middleware/userAuth.js";
import getAllUserData from "../Controller/allUserInfo.controller.js";
const dataRoute = Router();

dataRoute.get("/data", userAuth, getAllUserData);

export default dataRoute;
