import { Request, Response } from "express";

export class AuthController {

  constructor() {}

  registerUser = (req: Request, res: Response) => {
    res.json('registerUser');
  }

  loginUser = (req: Request, res: Response) => {
    res.json('loginUser');
  }

  validateEmail = (req: Request, res: Response) => {
    const {token} = req.params;
    res.json(`validateEmail ${token}`);
  }

}