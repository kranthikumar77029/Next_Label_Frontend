import { useEffect } from "react";
import { Layout } from '@/components/common/layout';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { StatsCard } from '@/components/projects/stats-card';
import { ProjectCard } from '@/components/projects/project-card';
import { Modal } from '@/components/common/modal';
import { Form } from '@/components/common/form';
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
  

  const stats = [
    { label: 'Total Projects', value: '12', icon: 'fi-rr-folder' },
    { label: 'Images Labeled', value: '3,547', icon: 'fi-rr-picture' },
    { label: 'Active Projects', value: '5', icon: 'fi-rr-chart-line-up' },
    { label: 'Models Trained', value: '8', icon: 'fi-rr-brain' },
  ];

  const projects = projectList;

  // 🔍 Filtering logic
  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.project_title.toLowerCase().includes(search.toLowerCase());
    // const matchesFilter = filter === 'All' ? true : p.status.toLowerCase() === filter.toLowerCase();
    return matchesSearch;
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
    console.log("response",response)
    setProjectList(response.data.results);  
    setTotalPages(response.data.total_pages);
    console.log("projectsList",projectList);

  } catch (err) {
    console.error(err);
  }
};

  // 🆕 Create Project
  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      await createProjectApi(formData); // send form data to API
      alert('Project created successfully!');
      fetchProjects()
    } catch (err) {
      console.error(err);
      alert('Failed to create project');
    }

    setShowModal(null);
    setFormData({ project_title: '', description:'', tags: '' });
  };

  // 🆕 Edit Project
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProject) return;

    try {
      await updateProjectApi(selectedProject.id, formData); // send id + updated data
      alert('Project updated successfully!');
       setProjectList(prev =>
      prev.map(p =>
        p.id === selectedProject.id ? { ...p, ...formData } : p
      )
    );
    } catch (err) {
      console.error(err);
      alert('Failed to update project');
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
      alert('Project deleted successfully!');
       setProjectList(prev => prev.filter(p => p.id !== selectedProject.id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete project');
    }

    setShowModal(null);
    setSelectedProject(null);
  };

  return (
    <Layout
      pageTitle="Projects Hub"
      showProjectSelector={false}
      headerActions={
        <Button icon="fi-rr-plus" onClick={() => setShowModal('create')}>
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
              <option value="Auto-Labeled">Auto-Labeled</option>
              <option value="In-Progress">In-Progress</option>
              <option value="Pending">Pending</option>
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
                setFormData({ project_title: p.project_title, description: p.description, tags: p.tags });
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
              <img src="/empty-search.svg" alt="No results" />
              <p>No matching projects found</p>
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
