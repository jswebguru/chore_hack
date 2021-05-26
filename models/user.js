const bcrypt = require("bcryptjs");

// Creating our User model
 // Name(string) -- display name
 // Email(string) -- unique identifier for logging in
 // Password(string) -- hashed password for logging in
// color to use in calendar and such
module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define("User", {
   
    name: {
      type: DataTypes.STRING,
      allowNull: false,},
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
   
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    
    color: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "#007bff",
    }
  });
  User.associate = function (models) {
    User.belongsTo(models.Household, {
      foreignKey: {
        allowNull: false
      }
    });
    User.hasMany(models.Chore);
    User.hasMany(models.Repetition, {
      onDelete: "cascade"
    });
  };


  // a method to verify the password
  User.prototype.verifyPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };
  // hash the password before saving it
  User.addHook("beforeCreate", function(user) {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
  });
  return User;
};