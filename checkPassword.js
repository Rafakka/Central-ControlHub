const bcrypt = require('bcryptjs');

const newPassword = 'password123';
const salt = bcrypt.genSaltSync(10);
const newHash = bcrypt.hashSync(newPassword, salt);

console.log(`New Hash: ${newHash}`);