/* eslint-disable no-undef */
const todoList = () => {
  all = [];
  const add = (todoItem) => {
    all.push(todoItem);
  };
  const markAsComplete = (index) => {
    all[index].completed = true;
  };

  const overdue = () => {
    // Write the date check condition here and return the array
    // of overdue items accordingly.
    return all.filter(
      (todoitems) => todoitems.dueDate < new Date().toISOString().split("T")[0]
    );
  };

  const dueToday = () => {
    // Write the date check condition here and return the array
    // of todo items that are due today accordingly.
    return all.filter(
      (todoitems) =>
        todoitems.dueDate === new Date().toISOString().split("T")[0]
    );
  };

  const dueLater = () => {
    // Write the date check condition here and return the array
    // of todo items that are due later accordingly.
    return all.filter(
      (todoitems) => todoitems.dueDate > new Date().toISOString().split("T")[0]
    );
  };

  const toDisplayableList = (list) => {
    // Format the To-Do list here, and return the output string
    // as per the format given above.
    let result = "";
    list.forEach((todoitems) => {
      if (todoitems.completed) {
        result += "[x] ";
      } else {
        result += "[ ] ";
      }
      result += todoitems.title;
      if (todoitems.dueDate === today) {
        result += "\n";
      } else {
        result += ` ${todoitems.dueDate}\n`;
      }
    });
    return result;
  };
  return {
    all,
    add,
    markAsComplete,
    overdue,
    dueToday,
    dueLater,
    toDisplayableList,
  };
};

module.exports = todoList;
