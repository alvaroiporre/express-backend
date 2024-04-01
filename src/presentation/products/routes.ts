import { Router } from "express";
import { AuthMIddleware } from "../middlewares/auth.middleware";
import { ProductController } from "./controller";

export class ProductRoutes {
  static get routes(): Router {
    const router = Router();
    // const categoryService: CategoryService = new CategoryService();
    const controller = new ProductController();
    // Definir las rutas
    router.get("/", [ AuthMIddleware.validateJWT ],  controller.getProducts);
    router.post("/", [ AuthMIddleware.validateJWT ], controller.createProduct);
    return router;
  }
}
