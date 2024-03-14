const Role = require('../models/Role');

const roleCheck = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const role = await Role.findById(req.account.roleId);
      if (!role) {
        return res.status(400).send({ error: 'Role does not exist.' });
      }

      if (!allowedRoles.includes(role.name)) {
        return res.status(403).send({ error: 'Permission denied.' });
      }

      next();
    } catch (error) {
      res.status(401).send({ error: 'Not authorized to access this resource' });
    }
  };
};

module.exports = roleCheck;
