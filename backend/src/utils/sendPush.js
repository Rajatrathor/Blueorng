const admin = require("firebase-admin");

const serviceAccount = JSON.parse(
    Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, "base64")
        .toString("utf8")
);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

exports.sendPush = async (tokens, title, body) => {
    if (!tokens || tokens.length === 0) return;

    await admin.messaging().sendEachForMulticast({
        tokens,
        notification: { title, body },
    });
};
