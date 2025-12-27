import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Dropdown } from "@/components/ui/dropdown";
import { Layout } from '@/components/common/layout';
import { Modal } from '@/components/common/modal';
import { Form } from '@/components/common/form';
import { useProjects } from '@/context/ProjectContext';
import { useEffect, useState } from 'react';
import { createMemberApi,listMembersApi,assignTaskApi,listTasksApi,editMemberApi,deleteMemberApi} from "@/networking/team_dashboard/teamapi";
import styles from './styles.module.css';

const Team = () => {
  const { projects, selectedProject, setSelectedProject } = useProjects();
  const [members, setMembers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [filters, setFilters] = useState({
  project: "all",
  role: "all",
  status: "all",
});

    
  // Form data for editing
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    assigned: 0,
  });

  // Modal states
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selected, setSelected] = useState(null);
 


 //filters
 const filteredMembers = members.filter((m) => {
  const projectMatch =
    filters.project === "all" ||
    m.project_title === filters.project;

  const roleMatch =
    filters.role === "all" || m.role === filters.role;

  const statusMatch =
    filters.status === "all" ||
    (m.status ?? "Active").toLowerCase() === filters.status;

  return projectMatch && roleMatch && statusMatch;
});
const projectOptions = [
  "all",
  ...new Set(
    projects
      .map((p) => p.project_title)
      .filter(Boolean)
  ),
];

const roles = [
  "all",
  ...new Set(members.map((m) => m.role).filter(Boolean)),
];

const statuses = [ "active", "inactive"];


  // New member
  const [newMember, setNewMember] = useState({
    name: '',
    password: '',
    role: 'Annotator',
  });

  // Assign tasks
const [assign, setAssign] = useState({
  project_id: '',
  member_id: '',
  image_range: '',
});
// Handle edit submit
const handleEditSubmit = async (e) => {
  e.preventDefault();

  if (!selected?.id || !formData.name) return;

  try {
    await editMemberApi(selected.id, formData);

    // update UI instantly
    setMembers((prev) =>
      prev.map((m) =>
        m.id === selected.id ? { ...m, ...formData } : m
      )
    );

    await fetchMembers();

    setShowEdit(false);
    setSelected(null);
    setFormData({
      name: "",
      role: "",
      assigned: 0,
      image_range: "",
    });
  } catch (err) {
    console.error(
      "Edit member failed:",
      err.response?.data || err
    );
  }
};

// Add new member
  const addMember = async () => {
    if (!newMember.name || !newMember.password) return;

    try {
      const payload = {
        name: newMember.name,
        password: newMember.password,
        role: newMember.role,
        project:
          typeof selectedProject === "object"
            ? selectedProject?.project_title
            : selectedProject,
      };

    const res = await createMemberApi(payload);
    const createdMember = res?.data?.data ?? res?.data;

    if (!createdMember) throw new Error("Invalid API response");
    setMembers((prev) => [
        ...prev,
        {
          id: createdMember.id ?? Date.now(),
          name: createdMember.name ?? newMember.name,
          role: createdMember.role ?? newMember.role,
          assigned: 0,
          completed: 0,
          status: "Active",
        },
      ]);

      setNewMember({ name: "", password: "", role: "Annotator" });
    } catch (err) {
      console.error("Create member failed:", err);
    }
  };
//Fetch Members 
  const fetchMembers = async () => {
  try {
    
    const res = await listMembersApi();
    
    // ✅ safely handle backend response
    const membersData =
      res?.data?.data ||
      res?.data?.members ||
      res?.data ||
      [];

    setMembers(Array.isArray(membersData) ? membersData : []);
  } catch (err) {
    console.error("Error fetching members:", err);
     
    setMembers([]);
  } 
 
 };
 //Fetch tasks
const fetchTasks = async () => {
  try {
   
    const res = await listTasksApi();
    const taskData = res?.data ?? [];

    setAssignments(taskData);

    // 🔑 MERGE tasks into members
    setMembers((prevMembers) =>
      prevMembers.map((m) => {
        const memberTasks = taskData.filter(
          (t) => t.member_name === m.name
        );

        const totalAssigned = memberTasks.reduce(
          (sum, t) => sum + Number(t.image_range || 0),
          0
        );

        return {
          ...m,
          project_title: memberTasks.at(-1)?.project_title ?? m.project_title,
          assigned: totalAssigned,
          status: memberTasks.length ? "Active" : m.status,
        };
      })
    );
  } catch (err) {
    console.error("Failed to fetch tasks:", err);
  } 
   
};

useEffect(()=>{
  fetchMembers();
  fetchTasks();
 },[])

  // Delete member
const removeMember = async () => {
  if (!selected?.id) return;

  try {
   
    await deleteMemberApi({
      member_id: selected.id,
      name: selected.name, 
    });

    // ✅ Update UI only after backend success
    setMembers((m) => m.filter((x) => x.id !== selected.id));

    setShowDelete(false);
    setSelected(null);
  } catch (err) {
    console.error(
      "Delete member failed:",
      err.response?.data || err
    );
  }
   
};
//assignTasks
const applyAssignment = async () => {
  const { project_id, member_id, image_range } = assign;
  if (!project_id || !member_id || !image_range) return;

  try {
      await assignTaskApi({ project_id, member_id, image_range });

    // ✅ refresh tasks & members
    await fetchTasks();

    setAssign({
      project_id: '',
      member_id: '',
      image_range: '',
    });
  } catch (err) {
    console.error('Task assignment failed:', err);
  } 
  
};
return (
        <Layout
          pageTitle="Team Labelling"
        >
        <div className={styles.container}>
          {/* Create Member */}
        <div className={styles.card}>
              <div className={styles.cardHeader}>Create Team Member</div>

              <div className={styles.formGrid}>
                {/* NAME */}
                <Input
                  label="Name"
                  name="name"
                  placeholder="Enter member name"
                  required
                  value={newMember.name}
                  onChange={(e) =>
                    setNewMember({ ...newMember, name: e.target.value })
                  }
                />

                {/* PASSWORD */}
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="Set password"
                required
                value={newMember.password}
                onChange={(e) =>
                    setNewMember({ ...newMember, password: e.target.value })
                  }
                />

                {/* ROLE */}
              <Dropdown
              label="Role"
              required
              placeholder="Select Role"
              value={newMember.role}
              options={[
                { label: "Annotator", value: "Annotator" },
                { label: "Reviewer", value: "Reviewer" },
              ]}
              onChange={(value) =>
                setNewMember({ ...newMember, role: value })
              }
            />

              </div>

              <div className={styles.actionsRow}>
                <Button
                  type="button"
                  variant="primary"
                  icon="fi-rr-user-add"
                  onClick={addMember}
                >
                  Create Member
                </Button>
              </div>
          </div>
        {/* Assign tasks */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>Assign Tasks to Labellers</div>

              <div className={styles.formGrid}>
                {/* PROJECT */}
                <Dropdown
                  label="Project"
                  required
                  placeholder="Select Project"
                  value={assign.project_id || ''}   
                  options={projects.map((p) => ({
                    label: p.project_title, 
                    value: p.id,            
                  }))}
                  onChange={(value) =>
                    setAssign((prev) => ({ ...prev, project_id: value }))
                  }
                />

                {/* ANNOTATOR */}
                <Dropdown
                  label="Annotator"
                  required
                  placeholder="Select Annotator"
                  value={assign.member_id || ''}    
                  options={members
                    .filter((m) => m.role?.toLowerCase() === 'annotator')
                    .map((m) => ({
                      label: m.name, 
                      value: m.id,   
                    }))}
                  onChange={(value) =>
                    setAssign((prev) => ({ ...prev, member_id: value }))
                  }
                />

                {/* IMAGE RANGE */}
                <Input
                  label="Images to label"
                  placeholder="e.g., 1-50"
                  value={assign.image_range || ''}   
                  onChange={(e) =>
                    setAssign((prev) => ({
                      ...prev,
                      image_range: e.target.value,
                    }))
                  }
                />
              </div>

              <div className={styles.actionsRow}>
                <Button
                  variant="primary"
                  icon="fi-rr-share"
                  disabled={
                    !assign.project_id ||
                    !assign.member_id ||
                    !assign.image_range
                  }  
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
                 <th>
                 Role
                <select
                  className={styles.filterSelect}
                  value={filters.role}
                  onChange={(e) =>
                    setFilters({ ...filters, role: e.target.value })
                  }
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r === "all" ? "All" : r}
                    </option>
                  ))}
                </select>
                </th>
                <th>
            Project
            <select
              className={styles.filterSelect}
              value={filters.project}
              onChange={(e) =>
                setFilters({ ...filters, project: e.target.value })
              }
            >
              {projectOptions.map((p) => (
                <option key={p} value={p}>
                  {p === "all" ? "All" : p}
                </option>
              ))}
            </select>
                </th>
                <th>Assigned</th>
                <th>Completed</th>
               <th>
                Status
                <select
                  className={styles.filterSelect}
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s === "all" ? "All" : s}
                    </option>
                  ))}
                </select>
              </th>
               <th>Actions</th>
              </tr>
            </thead>

      <tbody>
        {members.length === 0 ? (
          <tr>
            <td colSpan="7">No members found</td>
          </tr>
        ) : (
          filteredMembers.map((m) => (
            <tr key={m.id}>
              <td>{m.name}</td>
              <td>{m.role}</td>
              <td>{m.project_title ?? "-"}</td>
              <td>{m.assigned ?? 0}</td>
              <td>{m.completed ?? 0}</td>
              <td>
                <span
                  className={`${styles.status} ${
                    styles[(m.status ?? "active").toLowerCase()]
                  }`}
                >
                  {m.status ?? "Active"}
                </span>
              </td>
              <td className={styles.rowActions}>
                <button
                  className={styles.iconBtn}
                  onClick={() => {
                    setSelected(m);
                    setFormData({
                      name: m.name,
                      role: m.role,
                      assigned: m.assigned ?? 0,
                    });
                    setShowEdit(true);
                  }}
                >
                  <i className="fi fi-rr-pencil" />
                </button>

                <button
                  className={styles.iconBtnDanger}
                  onClick={() => {
                    setSelected(m);
                    setShowDelete(true);
                  }}
                >
                  <i className="fi fi-rr-trash" />
                </button>
              </td>
            </tr>
          ))
        )}
     </tbody>

         </table>
       </div>
      </div>
    </div>
   {/* Edit Modal */}
     {showEdit && (
    <Modal
      title="Edit Member"
      onClose={() => setShowEdit(false)}
      >
     <Form
       mode="member"
       formData={formData}
       setFormData={setFormData}
       submitLabel="Edit Member"
       onSubmit={handleEditSubmit}
       onCancel={() => setShowEdit(false)}
      />
     </Modal>
        )}
    {/* Delete Modal */}
      {showDelete && (
        <Modal
          title="Delete Member"
          onClose={() => setShowDelete(false)}
        >
          <p>
            Are you sure you want to delete{' '}
            <strong>{selected?.name}</strong>?
          </p>

          <div className={styles.actionsRow}>
            <Button variant="secondary" onClick={() => setShowDelete(false)}>
              Cancel
            </Button>

            <Button variant="danger" icon="fi-rr-trash" onClick={removeMember}>
              Delete
            </Button>
          </div>
        </Modal>
      )}
    </Layout>
  );
};

export default Team;
