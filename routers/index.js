const express = require('express');
const router = express.Router();
const messageRouter = require('./messageRouter');

router.use(messageRouter);

module.exports = router;