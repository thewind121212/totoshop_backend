import { Router } from "express";
import bannerControllers from "../controllers/banner.controllers";
import route from "./product.routes";

const router = Router();

router.get('/', bannerControllers.getAllBannerController)

export default router;