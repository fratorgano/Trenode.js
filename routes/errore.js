const express = require('express');
const router = express.Router();
const page = "/errore";

router.get('', (req, res) => {
    res.render("errore");
});

module.exports = {
    name: page,
    router: router,
};
