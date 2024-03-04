const Role = require('../models/Role');

const createRole = async (req, res) => {
  try {
    const role = new Role(req.body);
    await role.save();
    res.status(201).send(role);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find({});
    res.send(roles);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!role) {
      return res.status(404).send();
    }

    res.send(role);
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);

    if (!role) {
      return res.status(404).send();
    }

    res.send(role);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  createRole,
  getAllRoles,
  updateRole,
  deleteRole
};
