const nodeCron = require('node-cron');
const Account = require('../models/Account');

const checkAccountStatus = async () => {
    const sixMonthsAgo = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);
    const accounts = await Account.find({
        lastLogin: { $lt: sixMonthsAgo },
        status: 'active'
    });

    for (const account of accounts) {
        account.status = 'inactive';
        await account.save();
    }
};

nodeCron.schedule('0 0 * * *', checkAccountStatus);
module.exports = {
    checkAccountStatus
};
