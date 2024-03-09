const Blogs = require('../models/blog')

const createBlogs = async (req, res) => {
    try {
        const duplicateBlogs = await Blogs.findOne({ blogsTitle: req.body.blogsTitle }, { blogsContent: req.body.blogsContent })
        if (duplicateBlogs) {
            return res.status(409).send({ message: 'This blog with this title or content already existed.' })
        }
        const blogs = new Blogs(req.body);
        console.log(req.body);
        await blogs.save();
        res.status(200).send(blogs);
    } catch (error) {
        res.status(400).send(error);
    }
};

const getAllBlogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1; 
        const limit = parseInt(req.query.limit, 10) || 10; 
        
        const skip = (page - 1) * limit;

        const total = await Blogs.countDocuments();

        const blogsArticles = await Blogs.find()
            .sort({ publishDate: -1 })
            .skip(skip)
            .limit(limit);

        const result = blogsArticles.map(blogs => ({
            blogsid: blogs._id,
            title: blogs.title, 
            content: blogs.content,
            publishDate: blogs.publishDate,
            author: blogs.author,
            images: blogs.images
        }));

        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            totalPages: totalPages,
            currentPage: page,
            limit: limit,
            totalItems: total,
            data: result
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getBlogById = async (req, res) => {
    try {
        const blogs = await Blogs.findById(req.params.id)
        if (!blogs) {
            return res.status(404).send({ message: 'Blog not found' })
        }
        const result = {
            blogsid: blogs._id,
            title: blogs.blogsTitle,
            content: blogs.blogsContent,
            publishDate: blogs.publishDate,
            author: blogs.author,
            images: blogs.images
        };
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error);

    }
}
const deleteBlogById = async (req, res) => {
    try {
        const blogs = await Blogs.findByIdAndDelete(req.params.id)
        if (!blogs) {
            return res.status(404).send({ message: 'Blog not found' })
        }
        res.status(200).send({ message: 'Blog deleted successfully!'});
    } catch (error) {
        res.status(500).send(error);

    }
}

    module.exports = {
        createBlogs,
        getAllBlogs,
        getBlogById,
        deleteBlogById
    }