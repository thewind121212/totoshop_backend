import { Router } from "express";
import productControllers from "../controllers/product.controllers";


const route = Router();

route.get('/productdetail', productControllers.getProductDetail)   

export default route;