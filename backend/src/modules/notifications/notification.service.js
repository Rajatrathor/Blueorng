const prisma = require("../../utils/prisma");
const { sendPush } = require("../../utils/sendPush");

exports.savePushToken = async (req, res) => {
    const { token, device } = req.body;

    await prisma.deviceToken.upsert({
        where: { token },
        update: { userId: req.user.id },
        create: { token, device, userId: req.user.id },
    });

    res.json({ message: "Token saved" });
};

exports.getNotifications = async (req, res) => {
    const data = await prisma.notification.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: "desc" },
    });

    res.json(data);
};

exports.markRead = async (req, res) => {
    await prisma.notification.update({
        where: { id: Number(req.params.id) },
        data: { isRead: true },
    });

    res.json({ message: "Marked as read" });
};

exports.notifyUser = async ({ userId, title, body, type }) => {
    const notification = await prisma.notification.create({
        data: { userId, title, body, type },
    });

    const tokens = await prisma.deviceToken.findMany({
        where: { userId },
        select: { token: true },
    });

    await sendPush(
        tokens.map(t => t.token),
        title,
        body
    );

    return notification;
};
