var express = require('express');
var router = express.Router();

//get Category model
var Category = require('../models/category');

//Get Category Index
router.get('/', function(req, res) {
    Category.find(function(err, categories) {
        if (err) return console.log("Error in getting categories", error);
        res.render('admin/categories', {
            categories: categories
        });
    });


});

//Get Add category
router.get('/add-category', function(req, res) {
    var title = "";
    res.render('admin/add_category', {
        title: title,
    });
});

//Post Add category
router.post('/add-category', function(req, res, next) {
    req.checkBody('title', 'Title must have a value.').notEmpty();

    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();

    var errors = req.validationErrors();

    if (errors) {
        res.render('admin/add_category', {
            errors: errors,
            title: title,
            slug: slug,
        });
    } else {
        Category.findOne({ slug: slug }, function(err, category) {
            if (category) {
                req.flash('danger', 'category slug exist, Choose Another one!');
                res.render('admin/add_category', {
                    title: title,
                    slug: slug,
                });
            } else {
                category = new Category({
                    title: title,
                    slug: slug,
                    sorting: 0
                });
                category.save(function(err) {
                    if (err)
                        return console.log(err);
                    req.flash('success', 'category Added!');
                    res.redirect('/admin/categories');

                });
            }
        });
    }
});



//Get Edit category
router.get('/edit-category/:id', function(req, res) {
    Category.findById(req.params.id, function(err, category) {
        if (err) {
            return console.log("Error in getting edit category ", err);
        }
        res.render('admin/edit_category', {
            title: category.title,
            id: category._id

        });
    });

});

router.post('/edit-category/:id', function(req, res) {
    req.checkBody('title', 'Title must have a value.').notEmpty();

    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();
    var id = req.params.id;

    var errors = req.validationErrors();

    if (errors) {
        res.render('admin/edit_category', {
            errors: errors,
            title: title,
            id: id
        });
    } else {
        Category.findOne({ slug: slug, _id: { '$ne': id } }, function(err, category) {

            if (category) {
                req.flash('danger', 'category slug exist, Choose Another one!');
                res.render('admin/edit_category', {
                    title: title,
                    id: id
                });
            } else {

                Category.findById(id, function(err, category) {

                    if (err) {
                        return console.log("Error in updating Data : ", err);
                    }
                    category.title = title;
                    category.slug = slug;

                    category.save(function(err) {
                        if (err)
                            return console.log(err);
                        req.flash('success', 'Category Updated!');
                        res.redirect('/admin/categories/edit-category/' + id);

                    });
                });

            }
        });
    }
});


//Delete category
router.get('/delete-category/:id', function(req, res) {
    Category.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            return console.log("Error in Deleting Category : ", err);
        }
        req.flash('success', 'Category Deleted!');
        res.redirect('/admin/categories');
    });
});


module.exports = router;