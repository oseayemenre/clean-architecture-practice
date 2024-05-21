import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { AuthRepository } from "../repositories/auth.repository";
import { AuthService } from "../services/auth.services";
import { Bcrypt } from "../utilities/bcrypt";
import { PrismaClient } from "@prisma/client";
import { JWT } from "../utilities/jwt";

const route = Router();

const authRepository = new AuthRepository(new PrismaClient());

const authService = new AuthService(authRepository, new Bcrypt(), new JWT());

const authController = new AuthController(authService);

route.post(
  "/create-account",
  authController.createAccount.bind(authController)
);

route.post("/login", authController.login.bind(authController));

export { route as AuthRoute };
