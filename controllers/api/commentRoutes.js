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

router.get('/comments', withAuth, async (req, res) => {
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
        project_id: req.params.id,
      });
      res.json(newComment);
    } catch (err) {
      res.status(500).json(err);
    }
  });


router.delete('/:id', withAuth, async (req, res) => {
    try {
        console.log("Deleting the comment")
        console.log(req.params)
        console.log(req.session.user_id)
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