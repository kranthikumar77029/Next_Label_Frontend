import { useState } from 'react';
import styles from './styles.module.css';

const ProjectSelector = () => {
  const [selectedProject, setSelectedProject] = useState('helmet-detection');

  // Mock projects - this would come from a context/store in real app
  const projects = [
    { id: 'helmet-detection', name: 'Helmet Detection' },
    { id: 'traffic-signs', name: 'Traffic Signs Classification' },
    { id: 'defect-detection', name: 'Manufacturing Defect Detection' },
  ];

  return (
    <div className={styles.selector}>
      <label className={styles.label}>Current Project</label>
      <select
        className={styles.select}
        value={selectedProject}
        onChange={(e) => setSelectedProject(e.target.value)}
      >
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export { ProjectSelector };
