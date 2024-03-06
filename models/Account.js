const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const accountSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },

  address: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },

  phone: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true
  },

  passwordResetToken: String,
  passwordResetExpires: Date,

  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
    //b2: Admin
    //be: Staff 
    //b6: Customer
  },
  tokens: {
      type: [String],
      required: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
}, {
  timestamps: true
});

// hash mật khẩu
// accountSchema.pre('save', async function(next) {
//   if (this.isModified('password')) {
//     this.password = await bcrypt.hash(this.password, 8);
//   }
//   next();
// });



// Xác thực mật khẩu
accountSchema.statics.findByCredentials = async function(username, password) {
  const account = await this.findOne({ username });
  if (!account) {
    throw new Error('Unable to login. User not found.');
  }

  const isMatch = await bcrypt.compare(password, account.password);
  if (!isMatch) {
    throw new Error('Login failed: Password incorrect.');
  }
  
  return account;
};



// const password = '1234567';
// const hash = '$2a$08$p.E5gP51pcPdmcRxt.ekD.HV3kUhdYUVwBwJ6Wx7fOJCxgOzZpE6G';
// bcrypt.hash(password, 8, function(err, hash) {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log('New Hash:', hash);
//     bcrypt.compare(password, hash, function(err, result) {
//       if (err) {
//         console.error(err);
//       } else if (result) {
//         console.log('Password matches');
//       } else {
//         console.log('Password does not match');
//       }
//     });
//   }
// });
// bcrypt.compare(password, hash, function(err, result) {
//   if (result) {
//     console.log('Password matches');
//   } else {
//     console.log('Password does not match');
//   }
// });



// // accountSchema.pre('save', async function (next) {
// //   if (this.isModified('password')) {
// //     this.password = await bcrypt.hash(this.password, 8);
// //   }
// //   next();
// // });


// Ham password reset
accountSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
     // Token het han trong 10p
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};


const Account = mongoose.model('Account', accountSchema);

module.exports = Account;