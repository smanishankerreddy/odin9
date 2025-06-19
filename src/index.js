import { Storage } from './storage.js';
import { DOM } from './dom.js';
import { Project } from './project.js';
import { Todo } from './todo.js';

const projects = Storage.loadProjects();

// Ensure at least one project exists
if (projects.length === 0) {
  const defaultProject = new Project('Default');
  projects.push(defaultProject);
  Storage.saveProjects(projects);
}

// UI refresh
function updateUI() {
  Storage.saveProjects(projects);
  DOM.renderProjectList(onProjectChange);
  DOM.renderTodoList(updateUI);
}

// When user switches projects
function onProjectChange(index) {
  DOM.renderTodoList(updateUI);
}

// Initialize after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const projectListElement = document.getElementById('project-list');
  DOM.init(projectListElement, projects, onProjectChange, updateUI);

  // Add project form
  document.getElementById('new-project-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = e.target.projectName.value.trim();
    if (name) {
      projects.push(new Project(name));
      e.target.reset();
      updateUI();
    } else {
      alert("Project name cannot be empty.");
    }
  });

  // Add todo form
  document.getElementById('new-todo-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const currentProject = DOM.getCurrentProject();

    if (!currentProject) {
      alert("Please select or create a project first.");
      return;
    }

    const title = form.title.value.trim();
    const description = form.description.value.trim();
    const dueDate = form.dueDate.value;
    const priority = form.priority.value;
    const notes = form.notes.value.trim();
    const checklist = form.checklist.value
      .split(',')
      .map(item => item.trim())
      .filter(Boolean); // remove blanks

    if (!title) {
      alert("Todo must have a title.");
      return;
    }

    const newTodo = new Todo(title, description, dueDate, priority, notes, checklist);
    currentProject.addTodo(newTodo);
    form.reset();
    updateUI();
  });
});
