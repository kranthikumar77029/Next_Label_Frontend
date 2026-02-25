import { Button } from '@/components/ui/button';
import { Layout } from '@/components/common/layout';
import { useState,useEffect } from 'react';
import { Modal } from '@/components/common/modal';
import { Form } from '@/components/common/form';
import { useProjects } from '@/context/ProjectContext';
// import { useClasses } from '@/context/classesContext';
import { useToast } from '@/hooks/toast/use-toast';
import { createClassApi,listClassesApi,updateClassApi,deleteClassApi} from '@/networking/class-manager/classapi';
import styles from './styles.module.css';

const Classes = () => {
  const [classes, setClasses] = useState([])
  const { projects, selectedProject, setSelectedProject } = useProjects();
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const {showSuccess, showError}=useToast();

  const [formData, setFormData] = useState({
    name: '',
    color: '#06b6d4',
    description: '',
    project: '',
    project_title:''
  });

  
const handleSubmit = async (e) => {
  // e.preventDefault();

  const payload = {
    class_name: formData.name,
    color: formData.color,
    project_id: formData.project,
    project_title: formData.project_title,
    description: formData.description,
  };

  console.log("Submitting payload:", payload);

  try {
    const response = await createClassApi(payload);
    if (response.status===200){
    showSuccess("Class created successfully:", response.data);
    fetchClasses(selectedProject.id);


    // Reset form & close modal
    setFormData({
      name: "",
      color: "#06b6d4",
      description: "",
      project: "",
    });
    setShowModal(false);
  }

  } catch (error) {
     console.log("failed to create class:",error)
    //  showError(error.detail);

     showError(
      error.detail || "Failed to create class"
     );
    
  }
};
const fetchClasses = async (projectId) => {
  console.log("Fetching classes with projectId:", projectId);

  if (!projectId) return;

  try {
    // Pass projectId directly, NOT inside {}
    const response = await listClassesApi(projectId);
    // console.log("Classes API response:", response.data);
   if (response.status===200){

    setClasses(
      (response.data || []).map((item) => ({
        id: item.id,
        name: item.class_name,
        color: item.color,
        project_title: selectedProject?.project_title || "",
        description: item.description,
      }))
    );
  }
  } catch (error) {
    console.error("Fetch classes error:", error);
    showError(
      error?.response?.data?.detail ||
      error?.message ||
      "Failed to fetch classes"
    );
  }
};

useEffect(() => {
  if (selectedProject?.id) {
    fetchClasses(selectedProject.id); // pass the ID directly
  }
}, [selectedProject]);



 const handleEdit = (cls) => {
    setSelectedClass(cls);
    setFormData({
      name: cls.name,
      color: cls.color,
      description: cls.description,
      // project: cls.project,
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
    if (response.status===200){
    showSuccess("Class updated successfully")
    // console.log("Class updated successfully:", response.data);

    // Update local state/UI
    setClasses(
      classes.map((c) =>
        c.id === selectedClass.id ? { ...c, ...formData } : c
      )
    );

    setShowEditModal(false);
    setSelectedClass(null);
    setFormData({ name: '', color: '#06b6d4', description: '', project: '' });
  }
  } catch (error) {
    showError("Failed to update class:", error?.response?.data || error.message);
  }
};

const handleDelete = (cls) => {
    setSelectedClass(cls);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
  if (!selectedClass) return;

  try {
    const response=await deleteClassApi({
      id: selectedClass.id
      // OR class_name: selectedClass.name
    });
    if (response.status===200){
    showSuccess("Class deleted successfully");

  
    setClasses((prev) =>
      prev.filter((c) => c.id !== selectedClass.id)
    );

    setShowDeleteModal(false);
    setSelectedClass(null);
  }
  } catch (error) {
    showError(
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
      {/* <div className={styles.container}> */}
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
                  <span className={styles.className}>{cls.project_title}</span>
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
          <Modal title="Delete Class" onClose={() => setShowDeleteModal(false)}>
            <p className={styles.deleteMessage}>
              Are you sure you want to delete <strong>{selectedClass?.name}</strong>?
            </p>
            <div className={styles.modalActions}>
              <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
              <Button variant="danger" icon="fi-rr-trash" onClick={confirmDelete}>
                Delete Class
              </Button>
            </div>
          </Modal>
        )}
      {/* </div> */}
    </Layout>
  );
};

export default Classes;
