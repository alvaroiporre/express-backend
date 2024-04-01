import { Router } from "express";
import { AuthMIddleware } from "../middlewares/auth.middleware";

export class ProductRoutes {
  static get routes(): Router {
    const router = Router();
    // const categoryService: CategoryService = new CategoryService();
    // const controller = new CategoryController(categoryService);
    // Definir las rutas
    // router.get("/", [ AuthMIddleware.validateJWT ],  controller.getCategories);
    // router.post("/", [ AuthMIddleware.validateJWT ], controller.createCategory);
    return router;
  }
}
