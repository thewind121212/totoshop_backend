import { Router } from "express";
import bannerControllers from "../controllers/banner.controllers";
import route from "./ products.routes";

const router = Router();

router.use('/', bannerControllers.getAllBannerController)

export default router;