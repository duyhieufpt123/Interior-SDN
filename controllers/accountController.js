const Account = require('../models/Account');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Role = require('../models/Role');
const sendEmail = require('../utils/mailer');
const crypto = require('crypto');


const generateAuthToken = async (user) => {
  return jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
};

const register = async (req, res) => {
  try {
    const existingAccount = await Account.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }]
    });
    if (existingAccount) {
      return res.status(409).send({ error: 'Username or email already exists with another account.' });
    }

    const defaultRole = await Role.findOne({ name: 'customer' });
    if (!defaultRole) {
      throw new Error('Default role not found.');
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 8);

    const account = new Account({
      ...req.body,
      password: hashedPassword, 
      roleId: defaultRole._id,
    });

    const token = await generateAuthToken(account);
    account.tokens = [token]; 
    await account.save();
    res.status(201).send({ account });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'There was an error processing your request.' });
  }
};

const registerForStaff = async (req, res) => {
  try {
    const existingAccount = await Account.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }]
    });
    if (existingAccount) {
      return res.status(409).send({ error: 'Username or email already exists with another account.' });
    }

    const defaultRole = await Role.findOne({ name: 'staff' });
    if (!defaultRole) {
      throw new Error('Default role not found.');
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 8);

    const account = new Account({
      ...req.body,
      password: hashedPassword, 
      roleId: defaultRole._id,
    });

    const token = await generateAuthToken(account);
    account.tokens = [token]; 
    await account.save();
    res.status(201).send({ account });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'There was an error processing your request.' });
  }
};



const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const account = await Account.findByCredentials(username, password);
    
    if (!account) {
      return res.status(401).send({ error: 'Login failed' });
    }

    if (account.status !== 'active') {
      return res.status(403).send({ error: 'Account is Inactive, please contact support to activate it again.' });
    }

    account.lastLogin = Date.now();
    await account.save();

    console.log('Sending success response');
    res.send({ account });

  } catch (error) {
    console.log('Login failed:', error.message);
    return res.status(400).send({ error: error.message });
  }
};

const requestPasswordReset = async (req, res) => {
  try {
    const account = await Account.findOne({ username: req.body.username });
    if (!account) {
      return res.status(404).send({ error: 'User not found.' });
    }

    const resetToken = account.createPasswordResetToken();
    await account.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://${req.get('host')}/api/accounts/resetPassword/${resetToken}`;
    await sendEmail(account._id, 'Password Reset', `Please reset your password by clicking the following link: ${resetURL}`);


    res.status(200).send({ message: 'Password reset email sent.' });
  } catch (error) {
    console.error('Error during password reset request:', error);
    res.status(500).send({ error: 'There was an error processing your request.' });
  }
};

const resetPassword = async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const account = await Account.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!account) {
    return res.status(400).send({ error: 'Token is invalid or has expired.' });
  }

  account.password = req.body.password;
  account.passwordResetToken = undefined;
  account.passwordResetExpires = undefined;
  await account.save();

  res.status(200).send({ message: 'Your password has been reset.' });
};

const getProfile = async (req, res) => {
  try {
    await req.account.populate({ path: 'roleId', select: 'name -_id' });

    const accountData = req.account.toObject();

    const result = {
      accountid: accountData._id,
      firstName: accountData.firstName,
      lastName: accountData.lastName,
      email: accountData.email,
      dateOfBirth: accountData.dateOfBirth,
      username: accountData.username,
      roleName: accountData.roleId ? accountData.roleId.name : undefined,
      status: accountData.status

    };

    res.send(result);
  } catch (error) {
    console.error('Failed to get profile:', error);
    res.status(500).send({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['firstName', 'lastName', 'email', 'password', 'roleId', 'status'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    let isPasswordBeingUpdated = updates.includes('password');

    for (const update of updates) {
      if (update === 'password' && isPasswordBeingUpdated) {
        req.account.password = await bcrypt.hash(req.body.password, 8);
      } else {
        req.account[update] = req.body[update];
      }
    }
    await req.account.save(); 
    res.send(req.account);  
    console.log(account) 
  } catch (error) {
    res.status(400).send(error);
  }
};

const AdminUpdateProfile = async (req, res) => {
  const accountId = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = ['firstName', 'lastName', 'email', 'password', 'roleId', 'status'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {

    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).send();
    }

    let isPasswordBeingUpdated = updates.includes('password');

    for (const update of updates) {
      if (update === 'password' && isPasswordBeingUpdated) {
        account[update] = await bcrypt.hash(req.body[update], 8);
      } else {
        account[update] = req.body[update];
      }
    }
    await account.save();
    res.send(account);
  } catch (error) {
    res.status(400).send(error);
  }
};



const getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({})
      .populate('roleId', 'name -_id')
      .select('_id firstName lastName email phone address dateOfBirth username tokens status');

    console.log(accounts);


    const result = accounts.map(account => {
      const accountData = account.toObject();
      return {
        accountId: accountData._id,
        status: accountData.status,
        firstName: accountData.firstName,
        lastName: accountData.lastName,
        email: accountData.email,
        phone: accountData.phone,
        address: accountData.address,
        dateOfBirth: accountData.dateOfBirth,
        username: accountData.username,
        tokens: accountData.tokens,
        roleName: accountData.roleId ? accountData.roleId.name : undefined // Đổi roleID thành roleName cho dễ nhìn
      };
    });

    res.status(200).send(result);
  } catch (error) {
    console.error('Failed to get accounts:', error);
    res.status(500).send(error.message || 'Server Error');
  }
};



const deleteAccount = async (req, res) => {
  try {
    const account = await Account.findByIdAndDelete(req.params.id);

    if (!account) {
      return res.status(404).send({ error: 'Account not found.' });
    }

    res.send({ message: 'Account deleted successfully.' });
  } catch (error) {
    res.status(500).send(error);
  }
}


module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  getAllAccounts,
  deleteAccount,
  requestPasswordReset,
  resetPassword,
  registerForStaff,
  AdminUpdateProfile
};


