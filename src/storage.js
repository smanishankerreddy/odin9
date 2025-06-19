import { Project } from './project.js';

export const Storage = (() => {
  const saveProjects = (projects) => {
    localStorage.setItem('projects', JSON.stringify(projects));
  };

  const loadProjects = () => {
    const data = JSON.parse(localStorage.getItem('projects')) || [];
    return data.map(Project.fromJSON);
  };

  return { saveProjects, loadProjects };
})();
