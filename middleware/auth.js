const jwt = require('jsonwebtoken');
const Account = require('../models/Account');
const Role = require('../models/Role');

// token sẽ được lưu trong db rồi lấy cái token đấy để làm việc
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
      return res.status(401).send({ error: 'No token provided.' });
    }
    console.log(token)

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    const account = await Account.findOne({ _id: decoded._id, 'tokens': token, 'status': 'active' });

    if (!account) {
      return res.status(401).send({ error: 'Account not found.' });
    }
    console.log(account)

    req.token = token;
    req.account = account;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

// Check admin
const admin = async (req, res, next) => {
  if (req.role !== 'admin') {
    return res.status(403).send({ error: 'Requires admin access.' });
  }
  next();
};

const staff = async (req, res, next) => {
  if (req.role !== 'staff') {
    return res.status(403).send({ error: 'Requires staff access.' });
  }
  next();
};


module.exports = {
  auth,
  admin,
  staff
};
