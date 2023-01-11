const router = require('express').Router();
const { User, Project, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', withAuth, async (req, res) => {
    try {
        const projectData = await Project.findAll({
        where: {
            user_id: req.session.user_id,
        },
        include: [
            {
            model: Comment,
            attributes: ['id', 'comment_text', 'project_id', 'user_id', 'date_created'],
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
    
        const projects = projectData.map((project) => project.get({ plain: true }));
    
        res.render('dashboard', {
        projects,
        logged_in: req.session.logged_in,
        });
    } catch (err) {
        res.status(500).json(err);
    }
    }
);

router.get('/comment', withAuth, async (req, res) => {
    try {
        const commentData = await Comment.findAll({
        where: {
            user_id: req.session.user_id,
        },
        include: [
            {
            model: Project,
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
    
        res.render('comment', {
        comment,
        logged_in: req.session.logged_in,
        });
    } catch (err) {
        res.status(500).json(err);
    }
    }
);

router.get('/comment/:id', withAuth, async (req, res) => {
    try {
        const commentData = await Comment.findByPk(req.params.id, {

        include: [
            {
            model: Project,
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

        res.render('comment', {
        ...comment,
        logged_in: req.session.logged_in,
        });
    } catch (err) {
        res.status(500).json(err);

    }
    }
);

module.exports = router;