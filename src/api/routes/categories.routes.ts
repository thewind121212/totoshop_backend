import { Router } from "express";
import categoriesControllers from "../controllers/categories.controllers";

const router = Router();


router.get('/', categoriesControllers.getAllCategories)
router.get('/category', categoriesControllers.queryCategory )

export default router;