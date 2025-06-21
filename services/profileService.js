const db = require('../users'); // pretend db module

exports.getProfileById = async (userId) => {
  const profile = await db.getUserProfile(userId);
  return profile;
};
