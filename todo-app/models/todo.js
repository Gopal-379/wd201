"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Todo.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }

    static async addTask(params) {
      return await Todo.create(params);
    }

    static async overdue() {
      // FILL IN HERE TO RETURN OVERDUE ITEMS
      const od = await Todo.findAll({
        where: {
          dueDate: {
            [Op.lt]: new Date().toLocaleDateString("en-CA"),
          },
          completed: false,
        },
      });
      return od;
    }

    static async dueToday() {
      // FILL IN HERE TO RETURN ITEMS DUE tODAY
      const duty = await Todo.findAll({
        where: {
          dueDate: {
            [Op.eq]: new Date().toLocaleDateString("en-CA"),
          },
          completed: false,
        },
      });

      return duty;
    }

    static async dueLater() {
      // FILL IN HERE TO RETURN ITEMS DUE LATER
      const dulr = await Todo.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date().toLocaleDateString("en-CA"),
          },
          completed: false,
        },
      });
      return dulr;
    }

    static completedItems() {
      const coit = this.findAll({
        where: {
          completed: true,
        },
      });
      return coit;
    }

    static async remove(id) {
      return this.destroy({
        where: {
          id,
        },
      });
    }

    markAsCompleted() {
      return this.update({ completed: true });
    }

    static addTodo({ title, dueDate }) {
      return this.create({ title: title, dueDate: dueDate, completed: false });
    }

    static getTodos() {
      return this.findAll({ order: [["id", "ASC"]] });
    }

    setCompletionStatus(statusCode) {
      return this.update({ completed: statusCode });
    }
  }
  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );
  return Todo;
};
