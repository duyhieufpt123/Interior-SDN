const express = require('express');
const router = express.Router();
const blogsController = require('../controllers/blogsController');
const { auth } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.post('/', auth, roleCheck('staff'), blogsController.createBlogs);
router.get('/', auth, blogsController.getAllBlogs);
router.get('/:id', auth, blogsController.getBlogById);
router.delete('/:id', auth, roleCheck('staff'), blogsController.deleteBlogById);


module.exports = router;
