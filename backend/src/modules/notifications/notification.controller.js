const service = require("./notification.service");

exports.savePushToken = (req, res) =>
    service.savePushToken(req, res);

exports.getNotifications = (req, res) =>
    service.getNotifications(req, res);

exports.markRead = (req, res) =>
    service.markRead(req, res);
