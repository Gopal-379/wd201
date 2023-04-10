/* eslint-disable no-undef */
const todoList = require("../todo");

const formattedDate = (date) => {
  return date.toISOString().split("T")[0];
};

const today = formattedDate(new Date());
const yesterday = formattedDate(
  new Date(new Date().setDate(new Date().getDate() - 1))
);
const tomorrow = formattedDate(
  new Date(new Date().setDate(new Date().getDate() + 1))
);

const { all, markAsComplete, add, overdue, dueToday, dueLater } = todoList();

describe("Todo-List Test Suite", () => {
  beforeAll(() => {
    add({
      title: "Test 1",
      completed: false,
      dueDate: today,
    });
    add({
      title: "Test 2",
      completed: false,
      dueDate: yesterday,
    });
    add({
      title: "Test 3",
      completed: false,
      dueDate: tomorrow,
    });
  });

  test("should add new todo item", () => {
    const testCount = all.length;
    add({
      title: "Test 4",
      completed: false,
      dueDate: today,
    });
    expect(all.length).toBe(testCount + 1);
  });

  test("should mark a todo as complete", () => {
    expect(all[0].completed).toBe(false);
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });

  test("should retrieve overdue items", () => {
    let overDue = overdue();
    expect(overDue.length).toBe(1);
    expect(overDue[0]).toBe(all[1]);
  });

  test("should retrieve items due today", () => {
    let duetoday = dueToday();
    expect(duetoday.length).toBe(2);
    expect(duetoday[1]).toBe(all[3]);
    expect(duetoday[0]).toBe(all[0]);
  });

  test("should retrieve items due later", () => {
    let duelater = dueLater();
    expect(duelater.length).toBe(1);
    expect(duelater[0]).toBe(all[2]);
  });
});
