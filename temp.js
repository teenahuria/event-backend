
const bcrypt = require('bcryptjs');

const password = '12345678';
const saltRounds = 10;

const result = bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error generating hash:', err);
    return;
  }

  console.log('Generated Hash:', hash);
});
console.log(result)
