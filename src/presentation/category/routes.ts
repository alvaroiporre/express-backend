import { Router } from "express";
import { envs } from "../../config";

export class CategoryRoutes {
  static get routes(): Router {
    const router = Router();
   
    // Definir las rutas
    router.get('/', );
    router.post('/', );
    return router;
  }
}
