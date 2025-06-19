export class Todo {
  constructor(title, description, dueDate, priority, notes = '', checklist = [], completed = false) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.notes = notes;
    this.checklist = checklist;
    this.completed = completed;
  }

  toggleComplete() {
    this.completed = !this.completed;
  }

  static fromJSON(obj) {
    return new Todo(
      obj.title,
      obj.description,
      obj.dueDate,
      obj.priority,
      obj.notes,
      obj.checklist,
      obj.completed
    );
  }
}