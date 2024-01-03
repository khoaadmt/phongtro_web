import express from "express";
import * as postController from "../controllers/post";
import { verifyToken, isHost, isAdmin } from "../middlewares/verifyToken";

const router = express.Router();

router.get("/all", postController.getPosts); // lấy danh sách bài viết
router.get("/limit", postController.getPostsLimit); //lấy một số lượng nhất định bài viết
router.get("/one", postController.getPostById); //lấy một bài viết
router.get("/new-post", postController.getNewPosts); // lấy bài viết mới
router.post("/report", postController.reportPost); // lấy các bài viết bị báo cáo
router.put("/expired", verifyToken, isAdmin, postController.plusExpired); // lấy ra thời gian hết hạn của các bài viết
router.get("/get-exp", verifyToken, isAdmin, postController.getExpireds);
router.put("/plus", verifyToken, isAdmin, postController.plusExpired);
router.get("/get-rp", verifyToken, postController.getReports);
router.put("/update-rp", verifyToken, isAdmin, postController.updateReport);
router.delete("/remove-rp", verifyToken, isAdmin, postController.deleteReport);
router.get("/dashboard", verifyToken, isAdmin, postController.getDashboard);

router.use(verifyToken);
router.post("/ratings", postController.ratings);
router.put("/seen-rp", postController.seenReport);
router.post("/wishlist", postController.updateWishlist);
router.get("/wishlist", postController.getWishlist);
router.use(isHost);
router.put("/update-rp/host", postController.plusExpiredPaypal);
router.post("/create-new", postController.createNewPost);
router.post("/request-expired", postController.requestExpired);
router.get("/limit-admin", postController.getPostsLimitAdmin);
router.put("/update", postController.updatePost);
router.delete("/delete", postController.deletePost);
router.put("/rented/:pid", postController.updatePostRented);

export default router;
