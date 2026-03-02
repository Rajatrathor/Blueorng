const router = require("express").Router();
const controller = require("./notification.controller");
const auth = require("../../middlewares/auth.middleware");

router.post("/token", auth, controller.savePushToken);
router.get("/", auth, controller.getNotifications);
router.patch("/:id/read", auth, controller.markRead);

module.exports = router;
