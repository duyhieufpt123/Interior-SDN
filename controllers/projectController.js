const Project = require('../models/project');
const Account = require('../models/Account');


const createProject = async (req, res) => {
    try {
        const titleExists = await Project.findOne({ projectTitle: req.body.projectTitle });
        if (titleExists) {
            return res.status(409).json({ message: 'A project with this title already exists.' });
        }
        const project = new Project(req.body);
        await project.save();
        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find()
        .populate('client', '_id firstName lastName dateOfBirth username email address phone')
        .populate('quotation', '_id quotationName quotationDescription quotationCategory quotationPrice');

        const result = projects.map((project) => ({
            projectid: project._id,
            projectTitle: project.projectTitle,
            projectDescription: project.projectDescription,
            projectImages: project.projectImages,
            client: project.client,
            quotation: project.quotation,
            startDate: project.startDate,
            endDate: project.endDate,
            status: project.status
        }))

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
        .populate('client', '_id firstName lastName dateOfBirth username email address phone')
        .populate('quotation', '_id quotationName quotationDescription quotationCategory quotationPrice');;
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        const result = {
            projectid: project._id,
            projectTitle: project.projectTitle,
            projectDescription: project.projectDescription,
            projectImages: project.projectImages,
            client: project.client,
            quotation: project.quotation,
            startDate: project.startDate,
            endDate: project.endDate,
            status: project.status
          };
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createProject,
    getAllProjects,
    getProjectById
}