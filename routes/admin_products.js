var express = require('express');
var router = express.Router();
var mkdirp = require('mkdirp');
var fs = require('fs-extra');
var resizeImg = require('resize-img');

//get Product model
var Product = require('../models/products');
//get Category model
var Category = require('../models/category');

//Get Pages Index
router.get('/', function(req, res) {
    var count;
    Product.countDocuments(function(err, c) {
        count = c;
    });
    Product.find(function(err, products) {
        res.render('admin/products', {
            products: products,
            count: count
        });
    });
});

//Get Add Product
router.get('/add-product', function(req, res) {
    var title = "";
    var description = "";
    var price = "";
    Category.find(function(err, categories) {
        res.render('admin/add_product', {
            title: title,
            description: description,
            categories: categories,
            price: price
        });
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
                    sorting: 0
                });
                page.save(function(err) {
                    if (err)
                        return console.log(err);
                    req.flash('success', 'Page Added!');
                    res.redirect('/admin/pages');

                });
            }
        });
    }
});

router.post('/reorder-pages', function(req, res) {
    var ids = req.body['id[]'];
    var count = 0;
    for (var i = 0; i < ids.length; i++) {
        var id = ids[i];
        count++;
        (function(count) {
            Page.findById(id, function(err, page) {
                page.sorting = count;
                page.save(function(err) {
                    if (err) {
                        console.log("Error in sorting Pages", err);
                    }
                });
            });
        }(count));
    }
});

//Get Edit page
router.get('/edit-page/:id', function(req, res) {
    Page.findById(req.params.id, function(err, page) {
        if (err) {
            return console.log("Error in getting edit page ", err);
        } else {

        }
        res.render('admin/edit_page', {
            title: page.title,
            slug: page.slug,
            content: page.content,
            id: page._id
        });
    });

});

router.post('/edit-page/:id', function(req, res, next) {
    req.checkBody('title', 'Title must have a value.').notEmpty();
    req.checkBody('content', 'Content must have a value.').notEmpty();

    var title = req.body.title;
    var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if (slug == "") slug = title.replace(/\s+/g, '-').toLowerCase();
    var content = req.body.content;
    var id = req.params.id;

    var errors = req.validationErrors();

    if (errors) {
        console.log("=>", errors);
        res.render('admin/edit_page', {
            errors: errors,
            title: title,
            slug: slug,
            content: content,
            id: id
        });
    } else {
        Page.findById({ slug: slug, _id: { '$ne': id } }, function(err, page) {
            if (page) {
                req.flash('danger', 'Page slug exist, Choose Another one!');
                res.render('admin/edit_page', {
                    title: title,
                    slug: slug,
                    content: content,
                    id: id
                });
            } else {
                Page.findById(id, function(err, page) {
                    if (err) {
                        return console.log("Error in updating Data : ", err);
                    }
                    page.title = title;
                    page.slug = slug;
                    page.save(function(err) {
                        if (err)
                            return console.log(err);
                        req.flash('success', 'Page Added!');
                        res.redirect('/admin/pages/edit-page/' + id);

                    });
                });
                // page = new Page({
                //     title: title,
                //     slug: slug,
                //     content: content,
                //     sorting: 0
                // });

            }
        });
    }
});


//Delete Page
router.get('/delete-page/:id', function(req, res) {
    Page.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            return console.log("Error in Deleting Data : ", err);
        }
        req.flash('success', 'Page Deleted!');
        res.redirect('/admin/pages');
    });
});


module.exports = router;