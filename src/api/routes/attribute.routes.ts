import attributeControllers from "../controllers/attribute.controllers";
import { Router } from "express";

const router = Router();

router.get('/', attributeControllers.getAllAttributesController)

export default router;