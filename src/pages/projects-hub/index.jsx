import { Layout } from '@/components/common/layout';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { StatsCard } from '@/components/projects/stats-card';
import { ProjectCard } from '@/components/projects/project-card';
import { Modal } from '@/components/common/modal';
import { Form } from '@/components/common/form';
import { useToast } from '@/hooks/use-toast';
import { listClassesApi,createClassApi,updateClassApi,deleteClassApi } from '@/networking/class-manager/classapi';
import NoDataFound from '@/assets/no-data-found.svg';

import {
  createProjectApi,
  updateProjectApi,
  deleteProjectApi,
} from '@/networking/project_hub/projectapi';
import styles from './styles.module.css';
import { useProjects } from '@/context/ProjectContext';

const ProjectsHub = () => {
  const { fetchProjects, projects, setProjects, totalProjects,setTotalProjects} = useProjects();
  const [showModal, setShowModal] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  
  // const [loadingClasses, setLoadingClasses] = useState(false);

  const [formData, setFormData] = useState({
    project_title: '',
    description: '',
    tags: '',
    name: '',
    color: '#06b6d4',
    // description: '',
    project: '',
    // project_title:''
  });
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
 
  const { showSuccess, showError } = useToast();
  const stats = [
    { label: 'Total Projects', value: totalProjects, icon: 'fi-rr-folder' },
    { label: 'Images Labeled', value: '0', icon: 'fi-rr-picture' },
    { label: 'Active Projects', value: '1', icon: 'fi-rr-chart-line-up' },
    // { label: 'Models Trained', value: '8', icon: 'fi-rr-brain' },
  ];

 // 🆕 Create Project
  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      const response = await createProjectApi(formData);
      console.log('kjhffj', response);
      // const { status, statusText } = response;
      if (response.status == 200) {
        fetchProjects();
        showSuccess('Project created successfully');
        setShowModal(null);
        setFormData({ project_title: '', description: '', tags: '' });
      }
    } catch (err) {
  showError(err?.response?.data?.detail || "Failed to create project");
}
  };

  // 🆕 Edit Project
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProject) return;

    try {
     const response= await updateProjectApi(selectedProject.id, formData); // send id + updated data
      if (response.status===200){
      showSuccess('Project updated successfully');
      setProjects((prev) =>
        prev.map((p) =>
          p.id === selectedProject.id ? { ...p, ...formData } : p
        )
      );
    }
    } catch (err) {
      showError(err?.response?.data?.message || 'Failed to update project');
    }

    setShowModal(null);
    setSelectedProject(null);
    setFormData({ project_title: '', description: '', tags: '' });
  };

  // Delete Project
  const confirmDelete = async () => {
    try {
      const data = {
        project_id: selectedProject?.id,
        project_title: selectedProject?.project_title,
      };
      const response = await deleteProjectApi(data);
        if (response.status===200){
        setProjects((prev) =>
      prev.filter((p) => p.id !== selectedProject.id)
    );
        setTotalProjects(prev => Math.max(prev - 1, 0));
      
       showSuccess('Project deleted successfully');
       
      // fetchProjects();
      setShowModal(null);
      setSelectedProject(null);
  }
    } catch (error) {
       showError(error?.response?.data?.detail || "Failed to delete project");
    }
  };
  //fetch Classes
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
  //Add Class
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
    setClasses((prev) => [...prev, response.data]);
    await fetchProjects(); 
  //   setProjects((prevProjects) =>
  //   prevProjects.map((project) =>
  //     project.id === selectedProject.id
  //       ? {
  //           ...project,
  //           classes: [...(project.classes || []), newClass],
  //         }
  //       : project
  //   )
  // );

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
     showError(error.detail);

     showError(
      error.detail || "Failed to create class"
     );
    
  }
};
 //Edit Class
  const handleEdit = (cls) => {
     setSelectedClass(cls);
     setFormData({
       name: cls.name,
       color: cls.color,
       description: cls.description,
       // project: cls.project,
     });
     setShowModal('edit-Class');
   };
 
 const handleClassEditSubmit = async (e) => {
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
    setClasses((prev) =>
    prev.map((c) =>
      c.id === selectedClass.id
        ? { ...c, name: formData.name, color: formData.color, description: formData.description }
        : c
    )
  );
     
     setShowModal(false);
     setSelectedClass(null);
     setFormData({ name: '', color: '#06b6d4', description: '', project: '' });
   }
   } catch (error) {
     showError("Failed to update class:", error?.response?.data || error.message);
   }
 };

 //Delete Class
 const handleDelete = (cls) => {
     setSelectedClass(cls);
     setShowModal('delete-Class');
   };
 
 const confirmClassDelete = async () => {
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
     await fetchProjects(); 
     setShowModal(false);
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
      pageTitle="Projects Hub"
      showProjectSelector={false}
      headerActions={
        <Button
          icon="fi-rr-plus"
          onClick={() => {
            setSelectedProject(null); // important
            setFormData({
              project_title: '',
              description: '',
              tags: '',
            });
            setShowModal('create');
          }}
        >
          Create New Project
        </Button>
      }
    >
      <div className={styles.container}>
        {/* Stats */}
        <StatsCard stats={stats} />

        {/* 🔍 Search + Dropdown Filter */}
        <div className={styles.topBar}>
          {/* Search Box */}
          <div className={styles.searchBox}>
            <i className="fi-rr-search" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* Dropdown Filter */}
          <div className={styles.dropdown}>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="All">All Projects</option>
              <option value="Active">Active</option>
              <option value="In-active">In-active</option>
            </select>
          </div>
        </div>

        {/* Projects Grid */}
        <div className={styles.projectsGrid}>
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={{
                id: project.id,
                title: project.project_title,
                description: project.description,
                date: project.created_at,
                tags: project.tags,
                images: 0,
                classes: project.classes || [],          
                classesCount: project.classes?.length || 0, 

                status: 'Pending',
                // accuracy: 'N/A',
              }}
              onViewClasses={(project) => {
                  setSelectedProject(project);
                  setShowModal('classes');
                  fetchClasses(project.id);
                }}
              onEdit={(p) => {
                setSelectedProject(p);
                setFormData({
                  project_title: p.title,
                  description: p.description,
                  tags: p.tags,
                });
                setShowModal('edit');
              }}
              onDelete={(project) => {
                setSelectedProject(project);
                setShowModal('delete');
              }}
            />
          ))}

          {/* Empty state */}
          {projects.length === 0 && (
            <div className={styles.emptyState}>
              <img
                src={NoDataFound}
                alt="No results"
                className={styles.emptyStateimg}
              />
              <p>No projects found</p>
            </div>
          )}
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <Button
              variant="secondary"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </Button>

            <span className={styles.pageInfo}>
              Page {page} of {totalPages}
            </span>

            <Button
              variant="secondary"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showModal === 'create' && (
        <Modal title="Create New Project" onClose={() => setShowModal(null)}>
          <Form
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleCreate}
            onCancel={() => setShowModal(null)}
            submitLabel="Create Project"
          />
        </Modal>
      )}

      {/* Edit Project Modal */}
      {showModal === 'edit' && (
        <Modal title="Edit Project" onClose={() => setShowModal(null)}>
          <Form
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleEditSubmit}
            onCancel={() => setShowModal(null)}
            submitLabel="Update Project"
          />
        </Modal>
      )}

      {/* Delete Project Modal */}
      {showModal === 'delete' && (
        <Modal title="Delete Project" onClose={() => setShowModal(null)}>
          <p className={styles.deleteMessage}>
            Are you sure you want to delete{' '}
            <strong>{selectedProject?.title}</strong>?
          </p>
          <div className={styles.modalActions}>
            <Button variant="secondary" onClick={() => setShowModal(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              icon="fi-rr-trash"
              onClick={() => {
                confirmDelete();
              }}
            >
              Delete Project
            </Button>
          </div>
        </Modal>
      )}

      {/*Class Manager*/}
     {showModal ==='classes' && (
      <Modal
        title="Classes"
        side="right" 
        onClose={() => setShowModal(false)}
      >
        <div className={styles.modalTableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.tableHeader}>
                <th className={styles.tableCell}>Class Name</th>
                <th className={styles.tableCell}>Color</th>
                {/* <th className={styles.tableCell}>Project</th> */}
                <th className={styles.tableCell}>Description</th>
                <th className={styles.tableCell}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {classes.map((cls) => (
                <tr key={cls.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>
                    <div className={styles.classNameCell}>
                      <div
                        className={styles.colorDot}
                        style={{ background: cls.color }}
                      />
                      <span className={styles.className}>{cls.name}</span>
                    </div>
                  </td>

                  <td className={styles.tableCell}>
                    <div
                      className={styles.colorPreview}
                      style={{ background: cls.color }}
                    >
                      {cls.color}
                    </div>
                  </td>

                  {/* <td className={styles.tableCell}>
                    {cls.project_title}
                  </td> */}

                  <td className={styles.tableCell}>
                    {cls.description}
                  </td>

                  <td className={styles.tableCell}>
                    <div className={styles.actions}>
                      <button
                        type="button"
                        className={styles.actionButton}
                        onClick={() => handleEdit(cls)}
                      >
                        <i className="fi fi-rr-edit" />
                      </button>

                      <button
                      type='button'
                        className={`${styles.actionButton} ${styles.delete}`}
                        onClick={() => handleDelete(cls)}
                      >
                        <i className="fi fi-rr-trash" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
          <div className={styles.modalFooter}>
          <Button
              variant="primary"
              onClick={() => {
                const data = {
                  name: "",
                  color: "#06b6d4",
                  description: "",
                  project: selectedProject.id,
                  project_title: selectedProject.title,
                };

                console.log("Add Class formData:", data);

                setFormData(data);
                setShowModal('Add class');
              }}
            >
                Add Class
              </Button>

        </div>
      </Modal>
    )}
    
    {/*Add Class Modal*/}
     {showModal === 'Add class' && (
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
    {/*Edit class Modal*/}
    {showModal === 'edit-Class' && (
          <Modal title="Edit Class" onClose={() => setShowModal(false)}>
            <Form
              mode="class"
              formData={formData}
              setFormData={setFormData}
              submitLabel="Update Class"
              onSubmit={handleClassEditSubmit}
              onCancel={() => setShowModal(false)}
            />
          </Modal>
        )}
     {/*Delete Class Modal*/}
       {showModal === 'delete-Class' && (
        <Modal title="Delete Class" onClose={() => setShowModal(false)}>
         <p className={styles.deleteMessage}>
             Are you sure you want to delete <strong>{selectedClass?.name}</strong>?
          </p>
         <div className={styles.modalActions}>
         <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
         <Button variant="danger" icon="fi-rr-trash" onClick={confirmClassDelete}>
           Delete Class
          </Button>
         </div>
         </Modal>
        )}

    </Layout>
  );
};

export default ProjectsHub;
