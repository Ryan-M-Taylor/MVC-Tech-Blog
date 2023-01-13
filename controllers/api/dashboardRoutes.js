const router = require('express').Router();
const { User, Blog, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', withAuth, async (req, res) => {
    try {
        const blogData = await Blog.findAll({
        where: {
            user_id: req.session.user_id,
        },
        include: [
            {
            model: Comment,
            attributes: ['id', 'comment_text', 'blog_id', 'user_id', 'date_created'],
            include: {
                model: User,
                attributes: ['username'],
            },
            },
            {
            model: User,
            attributes: ['username'],
            },
        ],
        });
    
        const blogs = blogData.map((blog) => blog.get({ plain: true }));
    
        res.render('dashboard', {
        blogs,
        logged_in: req.session.logged_in,
        });
    } catch (err) {
        res.status(500).json(err);
    }
    });

router.get('/dashboard', withAuth, async (req, res) => {
    try {
        const blogData = await Blog.findAll({
        where: {
            user_id: req.session.user_id,
        },
        include: [
            {
            model: Comment,
            attributes: ['id', 'comment_text', 'blog_id', 'user_id', 'date_created'],
            include: {
                model: User,
                attributes: ['username'],
            },
            },
            {
            model: User,
            attributes: ['username'],
            },
        ],
        });
    
        const blogs = blogData.map((blog) => blog.get({ plain: true }));
    
        res.render('dashboard', {
        blogs,
        logged_in: req.session.logged_in,
        });
    } catch (err) {
        res.status(500).json(err);
    }
    }
);

module.exports = router;