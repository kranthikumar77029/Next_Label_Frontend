import { useState } from 'react';
import { useProjects } from "@/context/ProjectContext";

import styles from './styles.module.css';

const ProjectSelector = ({ value, onChange }) => {
const { projects } = useProjects();

  return (
    <div className={styles.selector}>
      <label className={styles.label}>Current Project</label>
      <select
        className={styles.select}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
      {projects.map((p) => (
       <option key={p.id} value={p.id}>
     {p.project_title || p.title || p.name}
      </option>
     ))}

      </select>
    </div>
  );
};


export { ProjectSelector };
