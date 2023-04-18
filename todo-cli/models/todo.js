// models/todo.js
"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static async addTask(parameters) {
      return await Todo.create(parameters);
    }
    static async showTodoList() {
      console.log("My Todo list \n");

      //Code for OverDue
      // ============================================================//
      console.log("Overdue");
      // FILL IN HERE
      const overDueTaskList = await Todo.overdue();
      const formattedTasksOver = overDueTaskList.map((task) => {
        return task.displayableString();
      });
      const formattedTaskList = formattedTasksOver.join("\n");
      console.log(formattedTaskList);
      console.log("\n");
      // ============================================================//

      //Code for due Today
      // ============================================================//
      console.log("Due Today");
      // FILL IN HERE
      const dueTodayTodoList = await Todo.dueToday();
      const formattedTasksToday = dueTodayTodoList.map((task) => {
        return task.displayableString();
      });
      const formattedtaskListToday = formattedTasksToday.join("\n");
      console.log(formattedtaskListToday);
      console.log("\n");
      // ============================================================//

      //code for due later
      // ============================================================//
      console.log("Due Later");
      // FILL IN HERE
      const dueLaterTodoList = await Todo.dueLater();
      const formattedTasksLater = dueLaterTodoList.map((task) => {
        return task.displayableString();
      });
      const formattedtaskListLater = formattedTasksLater.join("\n");
      console.log(formattedtaskListLater);
    }
    // ============================================================//

    static async overdue() {
      // FILL IN HERE TO RETURN OVERDUE ITEMS
      const od = await Todo.findAll({
        where: {
          dueDate: {
            [Op.lt]: new Date().toLocaleDateString("en-CA"),
          },
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
        },
      });
      return dulr;
    }

    static async markAsComplete(id) {
      // FILL IN HERE TO MARK AN ITEM AS COMPLETE
      await Todo.update({ completed: true }, { where: { id: id } });
    }

    displayableString() {
      const todayDate = new Date().toISOString().slice(0, 10);
      let checkbox = this.completed ? "[x]" : "[ ]";

      return `${this.id}. ${checkbox} ${this.title} ${
        this.dueDate === todayDate ? "" : this.dueDate
      }`.trim();
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
