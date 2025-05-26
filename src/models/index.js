const User = require('./User');
const Accommodation = require('./Accommodation');

// Definiera relationer
User.hasMany(Accommodation, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

Accommodation.belongsTo(User, {
  foreignKey: 'userId',
});

module.exports = {
  User,
  Accommodation,
}; 