import { Router } from "express";
import {
  register,
  login,
  refresh,
  logout,
  googleAuth,
} from "../controllers/auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.post("/google-login", googleAuth);

export default router;
