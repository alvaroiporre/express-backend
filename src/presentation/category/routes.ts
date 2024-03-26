import { Router } from "express";
import { CategoryController } from "./controller";
import { AuthMIddleware } from "../middlewares/auth.middleware";
import { CategoryService } from "../services/category.service";

export class CategoryRoutes {
  static get routes(): Router {
    const router = Router();
    const categoryService: CategoryService = new CategoryService();
    const controller = new CategoryController(categoryService);
    // Definir las rutas
    router.get("/", [ AuthMIddleware.validateJWT ],  controller.getCategories);
    router.post("/", [ AuthMIddleware.validateJWT ], controller.createCategory);
    return router;
  }
}
