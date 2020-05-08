var express = require('express');
var router = express.Router();

//get Page model
var Page = require('../models/page');

//Get Pages Index
router.get('/', function(req, res) {
    Page.find({}).sort({ sorting: 1 }).exec(function(err, pages) {
        res.render('admin/pages', {
            pages: pages
        });

    });
});

//Get Add page
router.get('/add-page', function(req, res) {
    var title = "";
    var slug = "";
    var content = "";
    res.render('admin/add_page', {
        title: title,
        slug: slug,
        content: content
    });
});

//Post Add page
router.post('/add-page', function(req, res, next) {
    req.checkBody('title', 'Title must have a value.').notEmpty();
    req.checkBody('content', 'Content must have a value.').notEmpty();

    var title = req.body.title;
    var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if (slug == "") slug = title.replace(/\s+/g, '-').toLowerCase();
    var content = req.body.content;

    var errors = req.validationErrors();

    if (errors) {
        console.log("=>", errors);
        res.render('admin/add_page', {
            errors: errors,
            title: title,
            slug: slug,
            content: content
        });
    } else {
        Page.findOne({ slug: slug }, function(err, page) {
            if (page) {
                req.flash('danger', 'Page slug exist, Choose Another one!');
                res.render('admin/add_page', {
                    title: title,
                    slug: slug,
                    content: content
                });
            } else {
                page = new Page({
                    title: title,
                    slug: slug,
                    content: content,
                    sorting: 100
                });
                page.save(function(err) {
                    if (err)
                        return console.log(err);
                    console.log('page => ', page)
                    req.flash('success', 'Page Added!');
                    next();

                });
            }
        });
    }
    res.render('admin/add_page', {
        title: title,
        slug: slug,
        content: content
    });
});


module.exports = router;