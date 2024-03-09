const News = require('../models/news')

const createNews = async (req, res) => {
    try {
        const duplicateNews = await News.findOne({ newsTitle: req.body.newsTitle }, { newsContent: req.body.newsContent })
        if (duplicateNews) {
            return res.status(409).send({ message: 'This new with this titile or content already existed.' })
        }
        const news = new News(req.body);
        console.log(req.body);
        await news.save();
        res.status(200).send(news);
    } catch (error) {
        res.status(400).send(error);
    }
};

const getAllNews = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1; 
        const limit = parseInt(req.query.limit, 10) || 10; 
        
        const skip = (page - 1) * limit;

        const total = await News.countDocuments();

        const newsArticles = await News.find()
            .sort({ publishDate: -1 })
            .skip(skip)
            .limit(limit);

        const result = newsArticles.map(news => ({
            newsid: news._id,
            title: news.title, 
            content: news.content,
            publishDate: news.publishDate,
            author: news.author,
            images: news.images
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

const getNewById = async (req, res) => {
    try {
        const news = await News.findById(req.params.id)
        if (!news) {
            return res.status(404).send({ message: 'New not found' })
        }
        const result = {
            newsid: news._id,
            title: news.newsTitle,
            content: news.newsContent,
            publishDate: news.publishDate,
            author: news.author,
            images: news.images
        };
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error);

    }
}
const deleteNewById = async (req, res) => {
    try {
        const news = await News.findByIdAndDelete(req.params.id)
        if (!news) {
            return res.status(404).send({ message: 'New not found' })
        }
        res.status(200).send({ message: 'New deleted successfully!'});
    } catch (error) {
        res.status(500).send(error);

    }
}

    module.exports = {
        createNews,
        getAllNews,
        getNewById,
        deleteNewById
    }