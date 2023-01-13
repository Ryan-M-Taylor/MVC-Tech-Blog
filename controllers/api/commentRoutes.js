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
    }
);

router.get('/comments', withAuth, async (req, res) => {
    try {
        const commentData = await Comment.findAll({
        where: {
            user_id: req.session.user_id,
        },
        include: [
            {
            model: Blog,
            attributes: ['id', 'name', 'description', 'date_created', 'user_id'],
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
    
        const comment = commentData.map((comment) => comment.get({ plain: true }));
    
        res.render('comments', {
        comment,
        logged_in: req.session.logged_in,
        });
    } catch (err) {
        res.status(500).json(err);
    }
    }
);

router.get('/comments/:id', withAuth, async (req, res) => {
    try {
        const commentData = await Comment.findByPk(req.params.id, {

        include: [
            {
            model: Blog,
            attributes: ['id', 'name', 'description', 'date_created', 'user_id'],
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

        const comment = commentData.get({ plain: true });

        res.render('comments', {
        ...comment,
        logged_in: req.session.logged_in,
        });
    } catch (err) {
        res.status(500).json(err);

    }
    }
);

router.post('/:id', withAuth, async (req, res) => {
    try {
      const newComment = await Comment.create({
        ...req.body,
        user_id: req.session.user_id,
        blog_id: req.params.id,
      });
      res.json(newComment);
    } catch (err) {
      res.status(500).json(err);
    }
  });


router.delete('/:id', withAuth, async (req, res) => {
    try {
        const commentData = await Comment.destroy({
        where: {
            id: req.params.id,
            user_id: req.session.user_id,
        },
        });
        console.log(commentData);
       res.status(200).json(commentData);
    } catch (err) {
        res.status(500).json(err);
    }
});

  

module.exports = router;