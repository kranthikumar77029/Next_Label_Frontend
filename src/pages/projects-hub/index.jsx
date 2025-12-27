import { useEffect } from "react";
import { Layout } from '@/components/common/layout';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { StatsCard } from '@/components/projects/stats-card';
import { ProjectCard } from '@/components/projects/project-card';
import { Modal } from '@/components/common/modal';
import { Form } from '@/components/common/form';
import { useToast } from "@/hooks/use-toast";
import NoDataFound from "@/assets/no-data-found.svg";

import {
  createProjectApi,
  updateProjectApi,
  deleteProjectApi,
  listProjectsApi,
} from '@/networking/project_hub/projectapi';
import styles from './styles.module.css';

const ProjectsHub = () => {
  const [showModal, setShowModal] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState({ project_title: '',description: '', tags: '' });
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [projectList, setProjectList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProjects, setTotalProjects] = useState(0);
  const { showSuccess, showError } = useToast();
  const stats = [
    { label: 'Total Projects', value: totalProjects, icon: 'fi-rr-folder' },
    { label: 'Images Labeled', value: '3,547', icon: 'fi-rr-picture' },
    { label: 'Active Projects', value: '3', icon: 'fi-rr-chart-line-up' },
    // { label: 'Models Trained', value: '8', icon: 'fi-rr-brain' },
  ];

  const projects = projectList;

  // 🔍 Filtering logic
  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.project_title.toLowerCase().includes(search.toLowerCase());
  
  const matchesFilter =
    filter === "All"
      ? true
      : (p.status || "").toLowerCase() === (filter || "").toLowerCase();
    return matchesSearch,matchesFilter;
  });


useEffect(() => {
  fetchProjects();
}, [page, search]);

const fetchProjects = async () => {
  try {
    const response = await listProjectsApi({
      params: {
        page,
        query: search,
        page_size: 10,
      },
    });

    const projects = response.data.results || [];

    setProjectList(projects);
    setTotalPages(response.data.total_pages);

    // ✅ Total projects count
    setTotalProjects(response.data.total_count ?? projects.length);

  } catch (err) {
     showError(
      err?.response?.data?.message || "Failed to create project"
    );
  }
};


  // 🆕 Create Project
 const handleCreate = async (e) => {
  e.preventDefault();

  try {
    await createProjectApi(formData);

    showSuccess("Project created successfully");

    fetchProjects();
    setShowModal(null);
    setFormData({ project_title: "", description: "", tags: "" });

  } catch (err) {
    showError(
      err?.response?.data?.message || "Failed to create project"
    );
  }
};


  // 🆕 Edit Project
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProject) return;

    try {
      await updateProjectApi(selectedProject.id, formData); // send id + updated data
       showSuccess("Project updated successfully");
       setProjectList(prev =>
      prev.map(p =>
        p.id === selectedProject.id ? { ...p, ...formData } : p
      )
    );
    } catch (err) {
      showError(
      err?.response?.data?.message || "Failed to update project"
    );
    }

    setShowModal(null);
    setSelectedProject(null);
    setFormData({ project_title: '', description: '', tags: '' });
  };

  // 🆕 Delete Project
  const confirmDelete = async () => {
    if (!selectedProject) return;

    try {
      await deleteProjectApi({ project_id: selectedProject.id }); // delete by id
      showSuccess("project deleted successfully")
      setProjectList(prev => prev.filter(p => p.id !== selectedProject.id));
    } catch (err) {
      showError(
      err?.response?.data?.message || "Failed to delete project"
    );
    }

    setShowModal(null);
    setSelectedProject(null);
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
                  project_title: "",
                  description: "",
                  tags: "",
                });
                setShowModal("create");
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
              onChange={(e) => { setSearch(e.target.value); setPage(1);}}
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
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={{
              id: project.id,
              title: project.project_title,
              description: project.description,
              date: project.created_at,
              tags: project.tags,
              images: 0,
             classes: 0,
             status: "Pending",   
             accuracy: "N/A"
             }}
              onEdit={(p) => {
                setSelectedProject(p);
                setFormData({ project_title: p.title, description: p.description, tags: p.tags });
                setShowModal('edit');
              }}
              onDelete={(p) => {
                setSelectedProject(p);
                setShowModal('delete');
              }}
            />
          ))}

          {/* Empty state */}
          {filteredProjects.length === 0 && (
            <div className={styles.emptyState}>
              <img src={NoDataFound} alt="No results" className={styles.emptyStateimg}/>
              <p>No  projects found</p>
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

      {/* Create Modal */}
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

      {/* Edit Modal */}
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

      {/* Delete Modal */}
      {showModal === 'delete' && (
        <Modal title="Delete Project" onClose={() => setShowModal(null)}>
          <p className={styles.deleteMessage}>
            Are you sure you want to delete <strong>{selectedProject?.title}</strong>?
          </p>
          <div className={styles.modalActions}>
            <Button variant="secondary" onClick={() => setShowModal(null)}>Cancel</Button>
            <Button variant="danger" icon="fi-rr-trash" onClick={confirmDelete}>
              Delete Project
            </Button>
          </div>
        </Modal>
      )}
    </Layout>
  );
};

export default ProjectsHub;
