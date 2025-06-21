module.exports = (sequelize, DataTypes) => {
  const Gallery = sequelize.define('Gallery', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'events',
        key: 'event_id',
      },
      onDelete: 'CASCADE',
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    uploaded_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'gallery',
    timestamps: false,
  });

  Gallery.associate = (models) => {
    Gallery.belongsTo(models.Event, {
      foreignKey: 'event_id',
      as: 'event',
    });
  };

  return Gallery;
};
