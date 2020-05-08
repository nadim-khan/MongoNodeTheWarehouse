var express = require('express');
var router = express.Router();

router.get('/', function(req, resp) {
    resp.render('index', {
        title: 'Home'
    });
});


module.exports = router;