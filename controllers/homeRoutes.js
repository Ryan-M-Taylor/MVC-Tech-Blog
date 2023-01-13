const router = require('express').Router();
const { Blog, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    // Get all Blogs and JOIN with user data
    const blogData = await Blog.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    // Serialize data so the template can read it
    const blogs = blogData.map((blog) => blog.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', {
      blogs,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/blogs/:id', async (req, res) => {
  try {
    const blogData = await Blog.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name', 'id'],
        },
        {
          model: Comment,
          attributes: ['comment_text', 'date_created', 'id'],
          include: [
            {
              model: User,
              attributes: ['name'],
            },
          ],
        },
      ],
    });

    const blog = blogData.get({ plain: true });
    var matchingCreators = false;
    if (req.session.user_id) {
      if (blog.user_id === req.session.user_id) {
        matchingCreators = true;
      }
    }
    res.render('blogs', {
      ...blog,
      logged_in: req.session.logged_in,
      matchingCreators,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/editblogs/:id', async (req, res) => {
  try {
    const blogData = await Blog.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name', 'id'],
        },
        {
          model: Comment,
          attributes: ['comment_text', 'date_created', 'id'],
          include: [
            {
              model: User,
              attributes: ['name'],
            },
          ],
        },
      ],
    });

    const blog = blogData.get({ plain: true });
    var matchingCreators = false;
    if (req.session.user_id) {
      if (blog.user_id === req.session.user_id) {
        matchingCreators = true;
      }
    }
    res.render('editpost', {
      ...blog,
      logged_in: req.session.logged_in,
      matchingCreators,
    });

    /**
     * 1. when user clicks on edit button, it should redirect them to /editblogs/:id
     * 2. [DONE] when user is on edit page, it should
     *    3. load the input value with the blog's current title <input value="{{ }}"/>
     *    4. load the textarea with the blog's current description 
     * 5. when user clicks on submit button,
     *    6. it should call on the update post endpoint
     *    7. redirect the user to /blogs/:id  
     */
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Blog }],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

module.exports = router;
