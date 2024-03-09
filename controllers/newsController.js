const News = require('../models/news')

const createNews = async (req, res) => {
    try{
        const duplicateNews = await News.findOne({newsTitle: req.body.newsTitle}, {newsContent: req.body.newsContent})
        if(duplicateNews){
            return res.status(409).send({message: 'This new with this titile or content already existed.'})
        }
        const news = new News(req.body);
        console.log(req.body);
        await news.save();
        res.status(200).send(news);
    } catch(error){
        res.status(400).send(error);
    }
};

module.exports = {
    createNews
}