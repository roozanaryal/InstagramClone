import express from "express";
import isAuthenticated from "../middlewares/auth.middleware.js";
import { getProfile, editProfile, getSuggestedUsers, followOrUnfollow } from "../controllers/user/index.js";
import upload from "../middlewares/multer.middleware.js";
const router = express.Router();

router.get("/:id/profile", isAuthenticated, getProfile);
router.get("/profile/edit").post(isAuthenticated, upload.single("profilePicture"), editProfile);
router.get("/suggested").get(isAuthenticated, getSuggestedUsers);
router.post("/followorunfollow/:id").post(isAuthenticated, followOrUnfollow);



export default router;
