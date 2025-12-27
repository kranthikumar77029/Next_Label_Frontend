import { Button } from '@/components/ui/button';
import { Layout } from '@/components/common/layout';
import { useState,useEffect } from 'react';
import { Modal } from '@/components/common/modal';
import { Form } from '@/components/common/form';
import { useProjects } from '@/context/ProjectContext';
import { createClassApi,listClassesApi,updateClassApi,deleteClassApi} from '@/networking/class-manager/classapi';
import styles from './styles.module.css';

const Classes = () => {
  const [classes, setClasses] = useState([])
  const { projects, selectedProject, setSelectedProject } = useProjects();
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '#06b6d4',
    description: '',
    project: '',
  });

  
const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    class_name: formData.name,
    color: formData.color,
    project_title: formData.project,
    description: formData.description,
  };

  console.log("Submitting payload:", payload);

  try {
    const response = await createClassApi(payload);
    console.log("Class created successfully:", response.data);
    fetchClasses(selectedProject);


    // Reset form & close modal
    setFormData({
      name: "",
      color: "#06b6d4",
      description: "",
      project: "",
    });
    setShowModal(false);

  } catch (error) {
    const message =
      error?.response?.data?.detail ||
      error?.message ||
      "Something went wrong";

    console.error("API Error:", message);
  }
};
const fetchClasses = async (projectTitle) => {
  console.log("fetching classes with",projectTitle);
  if (!projectTitle) return;

  try {
    const response = await listClassesApi(projectTitle);

    setClasses(
      response.data.map((item) => ({
        id: item.id,
        name: item.class_name,
        color: item.color,
        project: item.project_title,
        description: item.description,
      }))
    );
  } catch (error) {
    console.error(
      error?.response?.data?.detail || error.message
    );
  }
};

useEffect(() => {
  if (selectedProject?.project_title) {
    fetchClasses(selectedProject.project_title);
  }
}, [selectedProject]);

 const handleEdit = (cls) => {
    setSelectedClass(cls);
    setFormData({
      name: cls.name,
      color: cls.color,
      description: cls.description,
      project: cls.project,
    });
    setShowEditModal(true);
  };

const handleEditSubmit = async (e) => {
  e.preventDefault();

  if (!selectedClass) return;

  try {
    const updates = {
      new_class_name: formData.name,
      color: formData.color
    };

    const response = await updateClassApi({
      id: selectedClass.id,
      name:selectedClass.name,
      updates
    });

    console.log("Class updated successfully:", response.data);

    // Update local state/UI
    setClasses(
      classes.map((c) =>
        c.id === selectedClass.id ? { ...c, ...formData } : c
      )
    );

    setShowEditModal(false);
    setSelectedClass(null);
    setFormData({ name: '', color: '#06b6d4', description: '', project: '' });

  } catch (error) {
    console.error("Failed to update class:", error?.response?.data || error.message);
  }
};

const handleDelete = (cls) => {
    setSelectedClass(cls);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
  if (!selectedClass) return;

  try {
    await deleteClassApi({
      id: selectedClass.id
      // OR class_name: selectedClass.name
    });

    console.log("Class deleted successfully");

  
    setClasses((prev) =>
      prev.filter((c) => c.id !== selectedClass.id)
    );

    setShowDeleteModal(false);
    setSelectedClass(null);

  } catch (error) {
    console.error(
      "Failed to delete class:",
      error?.response?.data || error.message
    );
  }
};

  return (
    <Layout
      pageTitle="Label Class Manager"
      projects={projects}
      onProjectChange={(project) => setSelectedProject(project)}
      // showProjectSelector={true}
      headerActions={
        <Button icon="fi-rr-plus" onClick={() => setShowModal(true)}>
          Add Class
        </Button>
      }
    >
      <div className={styles.container}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeader}>
              <th className={styles.tableCell}>Class Name</th>
              <th className={styles.tableCell}>Color</th>
              <th className={styles.tableCell}>Project</th>
              <th className={styles.tableCell}>Description</th>
              <th className={styles.tableCell}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {classes.map((cls) => (
              <tr key={cls.id} className={styles.tableRow}>
                <td className={styles.tableCell}>
                  <div className={styles.classNameCell}>
                    <div className={styles.colorDot} style={{ background: cls.color }} />
                    <span className={styles.className}>{cls.name}</span>
                  </div>
                </td>
                <td className={styles.tableCell}>
                  <div className={styles.colorPreview} style={{ background: cls.color }}>
                    {cls.color}
                  </div>
                </td>
                <td className={styles.tableCell}>
                  <span className={styles.className}>{cls.project}</span>
                </td>
                <td className={styles.tableCell}>
                  <span className={styles.description}>{cls.description}</span>
                </td>
                <td className={styles.tableCell}>
                  <div className={styles.actions}>
                    <button className={styles.actionButton} onClick={() => handleEdit(cls)}>
                      <i className="fi fi-rr-edit"></i>
                    </button>
                    <button className={`${styles.actionButton} ${styles.delete}`} onClick={() => handleDelete(cls)}>
                      <i className="fi fi-rr-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showModal && (
          <Modal title="Add New Class" onClose={() => setShowModal(false)}>
            <Form
              mode="class"
              formData={formData}
              setFormData={setFormData}
              submitLabel="Add Class"
              onSubmit={handleSubmit}
              onCancel={() => setShowModal(false)}
            />
          </Modal>
        )}

        {showEditModal && (
          <Modal title="Edit Class" onClose={() => setShowEditModal(false)}>
            <Form
              mode="class"
              formData={formData}
              setFormData={setFormData}
              submitLabel="Update Class"
              onSubmit={handleEditSubmit}
              onCancel={() => setShowEditModal(false)}
            />
          </Modal>
        )}

        {showDeleteModal && (
          <Modal title="Delete Project" onClose={() => setShowDeleteModal(false)}>
            <p className={styles.deleteMessage}>
              Are you sure you want to delete <strong>{selectedClass?.name}</strong>?
            </p>
            <div className={styles.modalActions}>
              <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
              <Button variant="danger" icon="fi-rr-trash" onClick={confirmDelete}>
                Delete Project
              </Button>
            </div>
          </Modal>
        )}
      </div>
    </Layout>
  );
};

export default Classes;
