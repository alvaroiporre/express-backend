import { Router } from "express";
import { CategoryController } from "./controller";
import { AuthMIddleware } from "../middlewares/auth.middleware";

export class CategoryRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new CategoryController();
    // Definir las rutas
    router.get("/", controller.getCategories);
    router.post("/", [ AuthMIddleware.validateJWT ], controller.createCategory);
    return router;
  }
}
