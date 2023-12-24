const { BadRequestError } = require('../errors');

const testUser = (req, res, next) => {
  const testUser = req.user.userId === '6585e44ffe3bf53bc59b5352';
  if (testUser) throw new BadRequestError('Read only user!!!');
  next();
};

module.exports = { testUser };
