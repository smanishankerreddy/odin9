import { format, parseISO } from 'date-fns';
import { Todo } from './todo.js';
import { Project } from './project.js';

export const DOM = (() => {
  let projectList = [];
  let currentProjectIndex = 0;
  let container;

  const setProjects = (projects) => {
    projectList = projects;
  };

  const getProjects = () => projectList;
  const getCurrentProject = () => projectList[currentProjectIndex];

  const init = (containerElement, projects, onProjectChange, onUpdate) => {
    container = containerElement;
    setProjects(projects);
    renderProjectList(onProjectChange); // this now also selects the first project
  };

  const renderProjectList = (onProjectChange) => {
    const projectContainer = document.getElementById('project-list');
    projectContainer.innerHTML = '';

    projectList.forEach((project, index) => {
      const button = document.createElement('button');
      button.textContent = project.name;
      button.onclick = () => {
        currentProjectIndex = index;
        onProjectChange(index);
      };
      projectContainer.appendChild(button);
    });

    // Automatically render todos from the first project
    if (projectList.length > 0) {
      currentProjectIndex = 0;
      onProjectChange(0); // will trigger renderTodoList via updateUI
    }
  };

  const renderTodoList = (onUpdate) => {
    const todosContainer = document.getElementById('todo-list');
    todosContainer.innerHTML = '';

    const currentProject = getCurrentProject();
    if (!currentProject || !currentProject.todos) {
      todosContainer.innerHTML = '<p>No project selected or no todos yet.</p>';
      return;
    }

    const todos = currentProject.todos;

    if (todos.length === 0) {
      todosContainer.innerHTML = '<p>No todos in this project yet.</p>';
      return;
    }

    // Debug info
    console.log(`Rendering ${todos.length} todos for project "${currentProject.name}"`);
    console.table(todos);

    todos.forEach((todo, index) => {
      const div = document.createElement('div');
      div.className = `todo ${todo.priority}`;
      div.innerHTML = `
        <strong>${todo.title}</strong> - ${todo.dueDate ? format(parseISO(todo.dueDate), 'yyyy-MM-dd') : 'No date'}<br>
        <em>${todo.completed ? '✅ Completed' : '❌ Not done'}</em><br>
        <button data-index="${index}" class="expand">Expand</button>
        <button data-index="${index}" class="delete">Delete</button>
        <button data-index="${index}" class="toggle">Toggle Complete</button>
      `;

      div.querySelector('.expand').onclick = () => {
        alert(
          `Description: ${todo.description}\nNotes: ${todo.notes}\nChecklist: ${todo.checklist.join(', ')}`
        );
      };

      div.querySelector('.delete').onclick = () => {
        getCurrentProject().deleteTodo(index);
        onUpdate();
      };

      div.querySelector('.toggle').onclick = () => {
        todo.toggleComplete();
        onUpdate();
      };

      todosContainer.appendChild(div);
    });
  };

  return {
    init,
    getProjects,
    getCurrentProject,
    renderProjectList,
    renderTodoList,
  };
})();
