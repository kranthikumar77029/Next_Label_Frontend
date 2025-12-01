import { Button } from '@/components/ui/button';
import { Layout } from '@/components/common/layout';
import { useState } from 'react';
import styles from './styles.module.css';

const Classes = () => {
  const [classes, setClasses] = useState([
    {
      id: 1,
      name: 'Helmet',
      color: '#ef4444',
      description: 'Safety helmet worn by workers',
    },
    {
      id: 2,
      name: 'Person',
      color: '#06b6d4',
      description: 'Human detected in image',
    },
    {
      id: 3,
      name: 'Vest',
      color: '#3b82f6',
      description: 'Safety vest or high-visibility clothing',
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '#06b6d4',
    description: '',
  });

  const colors = [
    '#ef4444',
    '#06b6d4',
    '#3b82f6',
    '#f59e0b',
    '#8b5cf6',
    '#06b6d4',
    '#10b981',
    '#f97316',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setClasses([...classes, { id: Date.now(), ...formData }]);
    setShowModal(false);
    setFormData({ name: '', color: '#06b6d4', description: '' });
  };

  const handleEdit = (cls) => {
    setSelectedClass(cls);
    setFormData({
      name: cls.name,
      color: cls.color,
      description: cls.description,
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setClasses(
      classes.map((c) =>
        c.id === selectedClass?.id ? { ...c, ...formData } : c
      )
    );
    setShowEditModal(false);
    setSelectedClass(null);
    setFormData({ name: '', color: '#06b6d4', description: '' });
  };

  const handleDelete = (cls) => {
    setSelectedClass(cls);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setClasses(classes.filter((c) => c.id !== selectedClass?.id));
    setShowDeleteModal(false);
    setSelectedClass(null);
  };

  return (
    <Layout
      pageTitle="Label Class Manager"
      showProjectSelector={false}
      headerActions={
        <Button icon="fi-rr-plus" onClick={() => setShowModal(true)}>
          Add Class
        </Button>
      }
    >
      <div className={styles.container}>
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <div className={styles.tableCell}>Class Name</div>
            <div className={styles.tableCell}>Color</div>
            <div className={styles.tableCell}>Description</div>
            <div className={styles.tableCell}>Actions</div>
          </div>

          {classes.map((cls) => (
            <div key={cls.id} className={styles.tableRow}>
              <div className={styles.tableCell}>
                <div className={styles.classNameCell}>
                  <div
                    className={styles.colorDot}
                    style={{ background: cls.color }}
                  />
                  <span className={styles.className}>{cls.name}</span>
                </div>
              </div>
              <div className={styles.tableCell}>
                <div
                  className={styles.colorPreview}
                  style={{ background: cls.color }}
                >
                  {cls.color}
                </div>
              </div>
              <div className={styles.tableCell}>
                <span className={styles.description}>{cls.description}</span>
              </div>
              <div className={styles.tableCell}>
                <div className={styles.actions}>
                  <button
                    className={styles.actionButton}
                    onClick={() => handleEdit(cls)}
                  >
                    <i className="fi fi-rr-edit"></i>
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.delete}`}
                    onClick={() => handleDelete(cls)}
                  >
                    <i className="fi fi-rr-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div className={styles.modal} onClick={() => setShowModal(false)}>
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>Add New Class</h2>
                <button
                  className={styles.closeButton}
                  onClick={() => setShowModal(false)}
                >
                  <i className="fi fi-rr-cross"></i>
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Class Name *</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g., Hard Hat"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Color *</label>
                  <div className={styles.colorPicker}>
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`${styles.colorOption} ${
                          formData.color === color ? styles.selected : ''
                        }`}
                        style={{ background: color }}
                        onClick={() => setFormData({ ...formData, color })}
                      />
                    ))}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Description</label>
                  <textarea
                    className={styles.textarea}
                    placeholder="Describe what this class represents..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
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
                    Add Class
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
                <h2 className={styles.modalTitle}>Edit Class</h2>
                <button
                  className={styles.closeButton}
                  onClick={() => setShowEditModal(false)}
                >
                  <i className="fi fi-rr-cross"></i>
                </button>
              </div>

              <form onSubmit={handleEditSubmit}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Class Name *</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g., Hard Hat"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Color *</label>
                  <div className={styles.colorPicker}>
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`${styles.colorOption} ${
                          formData.color === color ? styles.selected : ''
                        }`}
                        style={{ background: color }}
                        onClick={() => setFormData({ ...formData, color })}
                      />
                    ))}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Description</label>
                  <textarea
                    className={styles.textarea}
                    placeholder="Describe what this class represents..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
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
                    Update Class
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showDeleteModal && (
          <div
            className={styles.modal}
            onClick={() => setShowDeleteModal(false)}
          >
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>Delete Class</h2>
                <button
                  className={styles.closeButton}
                  onClick={() => setShowDeleteModal(false)}
                >
                  <i className="fi fi-rr-cross"></i>
                </button>
              </div>

              <p className={styles.deleteMessage}>
                Are you sure you want to delete the class{' '}
                <strong>{selectedClass?.name}</strong>? This will remove all
                annotations with this class.
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
                  Delete Class
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Classes;
