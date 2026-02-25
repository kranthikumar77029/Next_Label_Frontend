import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Dropdown } from "@/components/ui/dropdown";
import { Layout } from '@/components/common/layout';
import { Modal } from '@/components/common/modal';
import { Form } from '@/components/common/form';
import { useProjects } from '@/context/ProjectContext';
import { useEffect, useState } from 'react';
import { createMemberApi,listMembersApi,assignTaskApi,
         listTasksApi,editMemberApi,deleteMemberApi,getAssignedRecordsByPersonApi,
         getUnassignedRecordsApi} from "@/networking/team_dashboard/teamapi";
import { useProjectImages } from '@/context/ProjectImagesContext';
import styles from './styles.module.css';
import { useToast } from '@/hooks/use-toast';
import { useMemo } from 'react';
import { useFormState } from 'react-dom';
 



const Team = () => {
  const { projects, selectedProject, setSelectedProject } = useProjects();
  const {  totalImagesByProject,assignmentStatsByProject,fetchAssignmentStats } = useProjectImages();
  const [tasksData,setTasksData]=useState([]);
  const[unAssignedData,setUnAssignedData]=useState([]);
  const [editedCount,setEditedCount]=useState(null);
  const [editedTasks,setEditedTasks]=useState([]);
  const [assign, setAssign] = useState({
  project_id: '',
  member_id: '',
  image_range: '',
});
const stats = assignmentStatsByProject[assign.project_id];


  const [members, setMembers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [filters, setFilters] = useState({
  project: "all",
  role: "all",
  status: "all",
});
  const {showSuccess,showError} =useToast();
    
  // Form data for editing
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    image_range: '',
    edited_count: '',
    unassigned_count:''
  });

  // Modal states
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selected, setSelected] = useState(null);

  const getRangeCount = (range) => {
    if (!range) return 0;

    return range.split(",").reduce((total, part) => {
      const [start, end] = part.trim().split("-").map(Number);

      if (isNaN(start) || isNaN(end)) return total;

      return total + (end - start + 1);
    }, 0);
  };

const tableMembers = useMemo(() => {
  return members.map(member => {
    const memberTasks = assignments.filter(
      a => a.member_id === member.id
    );

    const assigned = memberTasks.reduce(
      (sum, t) => sum + getRangeCount(t.image_range),
      0
    );

    return {
      id: member.id,
      member_id: member.id,
      name: member.name,
      role: member.role,
      project_title:
        memberTasks.length > 0
          ? memberTasks.map(t => t.project_title).join(", ")
          : "Unassigned",
      
      project_id:
        memberTasks.length > 0
          ? memberTasks[0].project_id
          : null,
      assigned,
      completed: 0,
      status: "Active"
    };
  });
}, [members, assignments]);



useEffect(() => {
  if (assign.project_id) {
    fetchAssignmentStats(assign.project_id);
  }
}, [assign.project_id]);

//filters
const filteredMembers = tableMembers.filter((m) => {
  const projectFilter = filters.project?.toLowerCase() ?? "all";
  const roleFilter = filters.role?.toLowerCase() ?? "all";
  const statusFilter = filters.status?.toLowerCase() ?? "all";

  const projectMatch =
    projectFilter === "all" ||
    (m.project_title ?? "").trim().toLowerCase() === projectFilter;

  const roleMatch =
    roleFilter === "all" ||
    (m.role ?? "").trim().toLowerCase() === roleFilter;

  const statusMatch =
    statusFilter === "all" ||
    (m.status ?? "Active").trim().toLowerCase() === statusFilter;

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
    role: '',
    name: '',
    password: '',
  
  });


// Handle edit submit
// const handleEditSubmit = async (e) => {
//   e.preventDefault();

//   if (!selected?.member_id || !formData.name) return;

//   try {
//     await editMemberApi(selected.member_id,formData);

//     // update all rows for this member
//     // setMembers((prev) =>
//     //   prev.map((m) =>
//     //     m.member_id === selected.member_id
//     //       ? { ...m, formData}
//     //       : m
//     //   )
//     // );
//     await fetchTasks();
//     setShowEdit(false);
//     setSelected(null);
//     setFormData({
//       name: "",
//       role: "",
//       image_range: "",
//       edited_count: ""
//     });
//   } catch (err) {
//     console.error(
//       "Edit member failed:",
//       err.response?.data || err
//     );
//   }
// };
// Add new member
const addMember = async () => {
  if (!newMember.name || !newMember.password) return;

  try {
    const payload = {
      name: newMember.name,
      password: newMember.password,
      role: newMember.role,
    };

    const res = await createMemberApi(payload);

    if (res.status === 200 || res.status === 201) {
      showSuccess("Member Created Successfully");

      const member_id = res.data.member_id;

      // ✅ update members state
      setMembers(prev => [
        ...prev,
        {
          id: member_id,
          name: newMember.name,
          role: newMember.role.toLowerCase(),
        }
      ]);

      setNewMember({
        name: "",
        password: "",
        role: "Annotator",
      });
    }
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

    setAssignments(prev => {
      const map = new Map();

      [...prev, ...taskData].forEach(a => {
        map.set(a.id, a);
      });

      return Array.from(map.values());
    });

    return taskData;
  } catch (err) {
    console.error("Failed to fetch tasks:", err);
    return [];
  }
};


useEffect(()=>{
  fetchMembers();
  fetchTasks();
 },[])

  // Delete member
const removeMember = async () => {
  if (!selected?.member_id) return;

  try {
    const response = await deleteMemberApi({
      member_id: selected.member_id,
      name: selected.name,
    });

    if (response.status === 200) {
      // remove from members
      setMembers(prev =>
        prev.filter(m => m.id !== selected.member_id)
      );

      // remove assignments
      setAssignments(prev =>
        prev.filter(a => a.member_id !== selected.member_id)
      );

      showSuccess("Member Deleted Successfully");
      setShowDelete(false);
      setSelected(null);
    }
  } catch (err) {
    showError(err?.response?.data?.message || "Delete member failed");
  }
};

//assignTasks
const applyAssignment = async () => {
  const { project_id, member_id, image_range } = assign;

  if (!project_id || !member_id || !image_range) {
    showError("Please select project, member and range");
    return;
  }

  try {
    const newCount = getRangeCount(image_range);

    // get latest assignments
    const latestAssignments = await fetchTasks();

    // find existing assignment
    const existing = latestAssignments.find(
      x => x.member_id === member_id && x.project_id === project_id
    );

    let finalRange = image_range;
    let totalCount = newCount;

    if (existing) {
      // merge ranges
      finalRange = mergeRanges(existing.image_range, image_range);

      totalCount =
        getRangeCount(existing.image_range) +
        newCount;
    }

    await assignTaskApi({
      project_id,
      member_id,
      image_range: finalRange,
      total_images: totalCount,
    });

    showSuccess(existing ? "Range Updated Successfully" : "Tasks Assigned Successfully");

    await fetchTasks();
    await fetchAssignmentStats(project_id);

    setAssign({
      project_id: "",
      member_id: "",
      image_range: "",
      max: 1,
    });

  } catch (err) {
    showError(err?.response?.data?.message || "Task assignment failed");
  }
};
const mergeRanges = (oldRange, newRange) => {
  const parse = r => {
    const [start, end] = r.split("-").map(Number);
    return { start, end };
  };

  const a = parse(oldRange);
  const b = parse(newRange);

  const start = Math.min(a.start, b.start);
  const end = Math.max(a.end, b.end);

  return `${start}-${end}`;
};
 
const handleEditClick = async (m) => {
  if (!m) return;

  setSelected(m);

  setFormData({
    name: m.name ?? "",
    role: m.role ?? "",
    edited_count: "",
    image_range: 0,
    unassigned_count: 0,
  });

  setShowEdit(true);

  if (!m.project_id) {
    setTasksData([]);
    setUnAssignedData([]);
    return;
  }

  try {
    const assignedRes = await getAssignedRecordsByPersonApi(m.id, m.project_id);
    const assignedImages = assignedRes?.data?.images || [];
    setTasksData(assignedImages);

    const unassignedRes = await getUnassignedRecordsApi(m.project_id);
    const unassignedImages = unassignedRes?.data?.images || [];
    setUnAssignedData(unassignedImages);

    setFormData(prev => ({
      ...prev,
      image_range: assignedImages.length,
      unassigned_count: unassignedImages.length,
    }));

  } catch (err) {
    console.error("API Error:", err);
  }
};
const handleApplyEditCount = async (e) => {
  e.preventDefault();

  const requested = Number(formData.edited_count) || 0;
  const currentAssigned = tasksData.length;

  if (requested < 0) return;

  let finalTasks = [];

  // ---------- INCREASE ----------
  if (requested > currentAssigned) {
    const needed = requested - currentAssigned;

    const safeCount = Math.min(needed, unAssignedData.length);
    const newImages = unAssignedData.slice(0, safeCount);

    finalTasks = [...tasksData, ...newImages];
  }

  // ---------- DECREASE ----------
  else if (requested < currentAssigned) {
    finalTasks = tasksData.slice(0, requested);
  }

  // ---------- SAME ----------
  else {
    finalTasks = tasksData;
  }

  setEditedTasks(finalTasks);

  try {
    const payload = {
      member_id: selected.id,
      project_id: selected.project_id,
      name: formData.name,
      role: formData.role,
      requested_count: requested,
      tasks: finalTasks,
    };

    await editMemberApi(payload);
      await fetchTasks();
    await fetchMembers();

    setShowEdit(false);

  } catch (err) {
    console.error("API error:", err);
  }
};
return (
    <Layout
      pageTitle="Team Labelling"
    >
      <div className={styles.container}>
      <div className={styles.topRow}>
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
                value={String(assign.member_id || "")}
                options={members
                  .filter(m => m.role?.toLowerCase() === "annotator")
                  .map(m => ({
                    label: m.name,
                    value: m.id,   // IMPORTANT: use id from API
                  }))
                }
                onChange={(value) => {
                  setAssign(prev => ({
                    ...prev,
                    member_id: String(value),
                  }));
                }}
              />



                {/* IMAGE RANGE */}
             <div className={styles.rangeContainer}>
                  <label className={styles.rangeLabel}>Images to label</label>

                  <input
                    type="range"
                    min={stats?.next_start_index ?? 1}
                    max={stats?.total_images ?? 1}
                    value={assign.max ?? stats?.next_start_index ?? 1}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      const start = stats?.next_start_index ?? 1;

                      setAssign(prev => ({
                        ...prev,
                        max: val,
                        image_range: `${start}-${val}`  // always use latest next_start_index
                      }));
                    }}
                    className={styles.rangeSlider}
                    disabled={!stats}
                  />

                  <div className={styles.rangeValue}>
                    Selected:
                    <b>
                      {stats?.next_start_index ?? 1} - {assign.max ?? stats?.next_start_index ?? 1}
                    </b>
                  </div>
                </div>


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
                  <div className={styles.thWithfilter}>
                    <span>Role</span>

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
                  </div>
                </th>
                 <th>
                  <div className={styles.thWithfilter}>
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
                  </div>
          
                </th>
                <th>Assigned</th>
                <th>Completed</th>
               <th>
                <div className={styles.thWithfilter}>
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
                </div>
               </th>
               <th>Actions</th>
              </tr>
              </thead>
               <tbody>
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan="7">No members found</td>
                </tr>
              ) : (
                filteredMembers.map((m) => (
                  <tr key={m.id}>
                    <td>{m.name}</td>
                    <td>{m.role}</td>
                    <td>{m.project_title ?? "-"}</td>
                    <td>{m.assigned}</td>
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
                        console.log("Row data:", m);
                        handleEditClick(m);
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
       onSubmit={handleApplyEditCount}
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
