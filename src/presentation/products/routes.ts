import { Router } from "express";
import { AuthMIddleware } from "../middlewares/auth.middleware";
import { ProductController } from "./controller";
import { ProductService } from "../services";

export class ProductRoutes {
  static get routes(): Router {
    const router = Router();
    const productService: ProductService = new ProductService();
    const controller = new ProductController(productService);
    // Definir las rutas
    router.get("/", [ AuthMIddleware.validateJWT ],  controller.getProducts);
    router.post("/", [ AuthMIddleware.validateJWT ], controller.createProduct);
    return router;
  }
}
