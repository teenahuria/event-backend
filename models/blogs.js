// models/blog.js

module.exports = (sequelize, DataTypes) => {
    const Blog = sequelize.define('Blog', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      datetime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
          isIn: [['publish', 'unpublish', 'draft']],
        },
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
     published_by: {
  type: DataTypes.INTEGER,  // ✅ Fix: it should be an INTEGER FK
  allowNull: true,
},
    }, {
      tableName: 'blogs',
      timestamps: false, // Disable default Sequelize timestamps (createdAt, updatedAt)
      underscored: true, // Match snake_case column names
    });
  
    Blog.associate = function(models) {
     Blog.belongsTo(models.User, {
  foreignKey: 'published_by',
  targetKey: 'user_id',  // ✅ Fix: match with primary key in User
  as: 'publisher',
});

    };
  
    return Blog;
  };
  