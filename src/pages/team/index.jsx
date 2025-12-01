import { Button } from '@/components/ui/button';
import { Layout } from '@/components/common/layout';
import { useState } from 'react';
import styles from './styles.module.css';

const Team = () => {
  const [project, setProject] = useState('Helmet Detection');
  const projects = ['Helmet Detection', 'Traffic Signs'];

  // Members state
  const [members, setMembers] = useState([
    {
      id: 1,
      name: 'John Doe',
      role: 'Annotator',
      assigned: 50,
      completed: 30,
      status: 'In Progress',
    },
    {
      id: 2,
      name: 'Priya S',
      role: 'Reviewer',
      assigned: 0,
      completed: 0,
      status: 'Active',
    },
  ]);

  // Create member state
  const [newMember, setNewMember] = useState({
    name: '',
    password: '',
    role: 'Annotator',
  });

  // Modals
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selected, setSelected] = useState(null);

  // Assign tasks
  const [assign, setAssign] = useState({
    project: 'Helmet Detection',
    name: '',
    batch: '',
  });

  const addMember = () => {
    if (!newMember.name || !newMember.password) return;
    const id = Date.now();
    setMembers((m) => [
      ...m,
      {
        id,
        name: newMember.name,
        role: newMember.role,
        assigned: 0,
        completed: 0,
        status: 'Active',
      },
    ]);
    setNewMember({ name: '', password: '', role: 'Annotator' });
  };

  const saveMember = () => {
    if (!selected) return;
    setMembers((m) => m.map((x) => (x.id === selected.id ? selected : x)));
    setShowEdit(false);
  };

  const removeMember = () => {
    if (!selected) return;
    setMembers((m) => m.filter((x) => x.id !== selected.id));
    setShowDelete(false);
  };

  const applyAssignment = () => {
    // Parse batch as count: supports "start-end" or single number
    const parseCount = (value) => {
      if (!value) return 0;
      const parts = value.split('-').map((v) => Number(v.trim()));
      if (parts.length === 2 && parts.every((n) => Number.isFinite(n))) {
        const [a, b] = parts;
        if (b >= a) return b - a + 1;
      }
      const num = Number(value);
      return Number.isFinite(num) ? num : 0;
    };

    const count = parseCount(assign.batch);
    const targetName = (assign.name || '').toLowerCase();
    if (!targetName || !count) return;

    setMembers((m) =>
      m.map((x) =>
        x.name.toLowerCase() === targetName && x.role === 'Annotator'
          ? { ...x, assigned: count }
          : x
      )
    );
  };

  return (
    <Layout
      pageTitle="Team Labelling"
      headerActions={
        <div className={styles.headerBar}>
          <select
            className={styles.select}
            value={project}
            onChange={(e) => setProject(e.target.value)}
          >
            {projects.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>
      }
    >
      <div className={styles.container}>
        {/* Member creation */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>Create Team Member</div>
          <div className={styles.formGrid}>
            <div>
              <label className={styles.label}>Name</label>
              <input
                className={styles.input}
                value={newMember.name}
                onChange={(e) =>
                  setNewMember({ ...newMember, name: e.target.value })
                }
                placeholder="Enter member name"
              />
            </div>
            <div>
              <label className={styles.label}>Password</label>
              <input
                className={styles.input}
                type="password"
                value={newMember.password}
                onChange={(e) =>
                  setNewMember({ ...newMember, password: e.target.value })
                }
                placeholder="Set password"
              />
            </div>
            <div>
              <label className={styles.label}>Role</label>
              <select
                className={styles.select}
                value={newMember.role}
                onChange={(e) =>
                  setNewMember({ ...newMember, role: e.target.value })
                }
              >
                <option>Annotator</option>
                <option>Reviewer</option>
              </select>
            </div>
          </div>
          <div className={styles.actionsRow}>
            <Button variant="primary" icon="fi-rr-user-add" onClick={addMember}>
              Create Member
            </Button>
          </div>
        </div>

        {/* Assign tasks */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>Assign Tasks to Labellers</div>
          <div className={styles.formGrid}>
            <div className={styles.selectBox}>
              <label className={styles.label}>Project</label>
              <select
                className={styles.select}
                value={assign.project}
                onChange={(e) =>
                  setAssign({ ...assign, project: e.target.value })
                }
              >
                {projects.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={styles.label}>Name</label>
              <input
                className={styles.input}
                placeholder="Annotator name"
                value={assign.name}
                onChange={(e) => setAssign({ ...assign, name: e.target.value })}
              />
            </div>
            <div>
              <label className={styles.label}>Images to label (batch)</label>
              <input
                className={styles.input}
                placeholder="e.g., 1-50 (optional)"
                value={assign.batch}
                onChange={(e) =>
                  setAssign({ ...assign, batch: e.target.value })
                }
              />
            </div>
          </div>
          <div className={styles.actionsRow}>
            <Button
              variant="primary"
              icon="fi-rr-share"
              onClick={applyAssignment}
            >
              Assign
            </Button>
          </div>
        </div>

        {/* Members table */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>Team Members</div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Assigned</th>
                  <th>Completed</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.id}>
                    <td>{m.name}</td>
                    <td>{m.role}</td>
                    <td>{m.assigned}</td>
                    <td>{m.completed}</td>
                    <td>
                      <span
                        className={`${styles.status} ${
                          styles[m.status.replace(/\s/g, '').toLowerCase()]
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className={styles.rowActions}>
                      <button
                        className={styles.iconBtn}
                        title="Edit"
                        onClick={() => {
                          setSelected(m);
                          setShowEdit(true);
                        }}
                      >
                        <i className="fi fi-rr-pencil" />
                      </button>
                      <button
                        className={styles.iconBtnDanger}
                        title="Delete"
                        onClick={() => {
                          setSelected(m);
                          setShowDelete(true);
                        }}
                      >
                        <i className="fi fi-rr-trash" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEdit && (
        <div className={styles.modal} onClick={() => setShowEdit(false)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Edit Member</h2>
              <button
                className={styles.closeButton}
                onClick={() => setShowEdit(false)}
              >
                <i className="fi fi-rr-cross" />
              </button>
            </div>
            <div className={styles.formGrid}>
              <div>
                <label className={styles.label}>Name</label>
                <input
                  className={styles.input}
                  value={selected?.name || ''}
                  onChange={(e) =>
                    setSelected({ ...selected, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className={styles.label}>Role</label>
                <select
                  className={styles.select}
                  value={selected?.role || 'Annotator'}
                  onChange={(e) =>
                    setSelected({ ...selected, role: e.target.value })
                  }
                >
                  <option>Annotator</option>
                  <option>Reviewer</option>
                </select>
              </div>
              <div>
                <label className={styles.label}>Assigned</label>
                <input
                  className={styles.input}
                  type="number"
                  value={selected?.assigned ?? 0}
                  onChange={(e) =>
                    setSelected({
                      ...selected,
                      assigned: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <div className={styles.actionsRow}>
              <Button variant="secondary" onClick={() => setShowEdit(false)}>
                Cancel
              </Button>
              <Button variant="primary" icon="fi-rr-disk" onClick={saveMember}>
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDelete && (
        <div className={styles.modal} onClick={() => setShowDelete(false)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Delete Member</h2>
              <button
                className={styles.closeButton}
                onClick={() => setShowDelete(false)}
              >
                <i className="fi fi-rr-cross" />
              </button>
            </div>
            <p>
              Are you sure you want to delete <strong>{selected?.name}</strong>?
            </p>
            <div className={styles.actionsRow}>
              <Button variant="secondary" onClick={() => setShowDelete(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                icon="fi-rr-trash"
                onClick={removeMember}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Team;
