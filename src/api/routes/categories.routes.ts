import { Router } from "express";
import categoriesControllers from "../controllers/categories.controllers";

const router = Router();


router.get('/', categoriesControllers.getAllCategories)
router.get('/all', categoriesControllers.queryFullCategory )
router.get('/*', categoriesControllers.queryCategory )
// router.get('/mix-jacket', categoriesControllers.getMixJacket)

export default router;