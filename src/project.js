import { Todo } from './todo.js';

export class Project {
  constructor(name) {
    this.name = name;
    this.todos = [];
  }

  addTodo(todo) {
    this.todos.push(todo);
  }

  deleteTodo(index) {
    this.todos.splice(index, 1);
  }

  static fromJSON(obj) {
    const project = new Project(obj.name);
    project.todos = obj.todos.map(todo => Todo.fromJSON(todo));
    return project;
  }
}