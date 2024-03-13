import { Router } from "express";
import bannerControllers from "../controllers/banner.controllers";

const router = Router();

router.get('/', bannerControllers.getAllBannerController)

export default router;