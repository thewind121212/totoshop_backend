import { Router } from "express";
import categoriesControllers from "../controllers/categories.controllers";

const router = Router();


router.get('/', categoriesControllers.getAllCategories)
router.get('/category', categoriesControllers.queryFullCategory )
router.get('/category/*', categoriesControllers.queryCategory )
// router.get('/mix-jacket', categoriesControllers.getMixJacket)

export default router;