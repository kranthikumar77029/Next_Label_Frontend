import { Button } from '@/components/button';
import { Layout } from '@/components/layout';
import { useState } from 'react';
import styles from './styles.module.css';

const ProjectsHub = () => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
  });

  const stats = [
    { label: 'Total Projects', value: '12', icon: 'fi-rr-folder' },
    { label: 'Images Labeled', value: '3,547', icon: 'fi-rr-picture' },
    { label: 'Active Projects', value: '5', icon: 'fi-rr-chart-line-up' },
    { label: 'Models Trained', value: '8', icon: 'fi-rr-brain' },
  ];

  const projects = [
    {
      id: 1,
      title: 'Helmet Detection',
      description:
        'Detect safety helmets on construction workers for workplace safety compliance monitoring.',
      date: '30 Oct 2025',
      images: 250,
      classes: 3,
      status: 'Auto-Labeled',
      accuracy: '94%',
    },
    {
      id: 2,
      title: 'Traffic Signs Classification',
      description:
        'Multi-class classification system for autonomous vehicle navigation and road sign recognition.',
      date: '28 Oct 2025',
      images: 180,
      classes: 12,
      status: 'In Progress',
      accuracy: '87%',
    },
    {
      id: 3,
      title: 'Manufacturing Defect Detection',
      description:
        'Quality control system for identifying defects in manufacturing production lines.',
      date: '25 Oct 2025',
      images: 420,
      classes: 5,
      status: 'Auto-Labeled',
      accuracy: '91%',
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Creating project:', formData);
    setShowModal(false);
    setFormData({ title: '', description: '', tags: '' });
  };

  const handleEdit = (project) => {
    setSelectedProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      tags: '',
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    console.log('Updating project:', selectedProject.id, formData);
    setShowEditModal(false);
    setSelectedProject(null);
    setFormData({ title: '', description: '', tags: '' });
  };

  const handleDelete = (project) => {
    setSelectedProject(project);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    console.log('Deleting project:', selectedProject.id);
    setShowDeleteModal(false);
    setSelectedProject(null);
  };

  return (
    <Layout
      pageTitle="Projects Hub"
      showProjectSelector={false}
      headerActions={
        <Button icon="fi-rr-plus" onClick={() => setShowModal(true)}>
          Create New Project
        </Button>
      }
    >
      <div className={styles.container}>
        <div className={styles.stats}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statCard}>
              <div className={styles.statIcon}>
                <i className={`fi ${stat.icon}`}></i>
              </div>
              <div className={styles.statContent}>
                <div className={styles.statLabel}>{stat.label}</div>
                <div className={styles.statValue}>{stat.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.projectsGrid}>
          {projects.map((project) => (
            <div key={project.id} className={styles.projectCard}>
              <div className={styles.projectCardContent}>
                <div className={styles.projectHeader}>
                  <div className={styles.projectTitleSection}>
                    <h3 className={styles.projectTitle}>{project.title}</h3>
                    <div className={styles.projectDate}>
                      <i
                        className="fi fi-rr-calendar"
                        style={{ fontSize: '11px', opacity: 0.7 }}
                      ></i>
                      <span>{project.date}</span>
                    </div>
                  </div>
                  <span
                    className={`${styles.statusBadge} ${
                      project.status === 'Auto-Labeled'
                        ? styles.active
                        : styles.pending
                    }`}
                  >
                    {project.status}
                  </span>
                </div>

                <p className={styles.projectDescription}>
                  {project.description}
                </p>

                <div className={styles.projectStats}>
                  <div className={styles.projectStat}>
                    <div className={styles.projectStatIconWrapper}>
                      <i
                        className={`fi fi-rr-picture ${styles.projectStatIcon}`}
                      ></i>
                    </div>
                    <div className={styles.projectStatValue}>
                      {project.images}
                    </div>
                    <div className={styles.projectStatLabel}>Images</div>
                  </div>
                  <div className={styles.projectStat}>
                    <div className={styles.projectStatIconWrapper}>
                      <i
                        className={`fi fi-rr-palette ${styles.projectStatIcon}`}
                      ></i>
                    </div>
                    <div className={styles.projectStatValue}>
                      {project.classes}
                    </div>
                    <div className={styles.projectStatLabel}>Classes</div>
                  </div>
                  <div className={styles.projectStat}>
                    <div className={styles.projectStatIconWrapper}>
                      <i
                        className={`fi fi-rr-check ${styles.projectStatIcon}`}
                      ></i>
                    </div>
                    <div className={styles.projectStatValue}>
                      {project.accuracy}
                    </div>
                    <div className={styles.projectStatLabel}>Accuracy</div>
                  </div>
                </div>

                <div className={styles.projectActions}>
                  <button
                    className={styles.iconButton}
                    onClick={() => handleEdit(project)}
                    title="Edit"
                  >
                    <i className="fi fi-rr-edit"></i>
                  </button>
                  <button
                    className={`${styles.iconButton} ${styles.deleteIcon}`}
                    onClick={() => handleDelete(project)}
                    title="Delete"
                  >
                    <i className="fi fi-rr-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className={styles.modal} onClick={() => setShowModal(false)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Create New Project</h2>
              <button
                className={styles.closeButton}
                onClick={() => setShowModal(false)}
              >
                <i className="fi fi-rr-cross"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Project Title *</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g., Vehicle Detection System"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Description *</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Describe your project goals and requirements..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Tags / Domain</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g., Manufacturing, Safety, Automotive"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                />
              </div>

              <div className={styles.modalActions}>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary" type="submit" icon="fi-rr-check">
                  Create Project
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className={styles.modal} onClick={() => setShowEditModal(false)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Edit Project</h2>
              <button
                className={styles.closeButton}
                onClick={() => setShowEditModal(false)}
              >
                <i className="fi fi-rr-cross"></i>
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Project Title *</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g., Vehicle Detection System"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Description *</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Describe your project goals and requirements..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Tags / Domain</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g., Manufacturing, Safety, Automotive"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                />
              </div>

              <div className={styles.modalActions}>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary" type="submit" icon="fi-rr-check">
                  Update Project
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className={styles.modal} onClick={() => setShowDeleteModal(false)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Delete Project</h2>
              <button
                className={styles.closeButton}
                onClick={() => setShowDeleteModal(false)}
              >
                <i className="fi fi-rr-cross"></i>
              </button>
            </div>

            <p className={styles.deleteMessage}>
              Are you sure you want to delete{' '}
              <strong>{selectedProject?.title}</strong>? This action cannot be
              undone and will remove all associated data.
            </p>

            <div className={styles.modalActions}>
              <Button
                variant="secondary"
                type="button"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                type="button"
                onClick={confirmDelete}
                icon="fi-rr-trash"
              >
                Delete Project
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ProjectsHub;
