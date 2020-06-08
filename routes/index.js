const express = require('express');
const router = express.Router();
const page = "/";

router.get(page, (req, res) => {
    res.render("index");
});

module.exports = {
    name: page,
    router: router,
};


