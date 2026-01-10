import { useProjects } from "@/context/ProjectContext";
import styles from './styles.module.css';

const ProjectSelector = ({ value, onChange }) => {
  const { projects, setSelectedProject } = useProjects();

  const handleSelect = (e) => {
    const projectId = e.target.value;

    // Correct id resolution: works for id OR _id
    const selectedProjectObj = projects.find(
      (p) => (p.id) === (projectId)
    );

    // Update parent
    onChange(selectedProjectObj);

    // Update global context
    setSelectedProject(selectedProjectObj);
  };

  return (
    <div className={styles.selector}>
      <label className={styles.label}>Select Your Project</label>

      <select
        className={styles.select}
        value={value?.id ?? value?._id ?? ""}
        onChange={handleSelect}
      >
        <option value="" disabled>
          Select Project
        </option>

        {projects.map((p) => (
          <option key={p.id ?? p._id} value={p.id ?? p._id}>
            {p.project_title || p.title || p.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export { ProjectSelector };
