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
// import { useFormState } from 'react-dom';
 



const Team = () => {
  const { projects} = useProjects();
  const {  assignmentStatsByProject,fetchAssignmentStats } = useProjectImages();
  const [tasksData,setTasksData]=useState([]);
  const[unAssignedData,setUnAssignedData]=useState([]);
  // const [editedCount,setEditedCount]=useState(null);
  const [_editedTasks,setEditedTasks]=useState([]);
  const [assign, setAssign] = useState({
  project_id: '',
  annotator_id: "",
  reviewer_id: "",
  image_range: '',
});
const stats = assignmentStatsByProject[assign.project_id];
const noImagesAvailable = !stats || stats.next_start_index === null;


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

  const rows = [];

  members.forEach(member => {

    const memberTasks = assignments.filter(
      a => String(a.member_id) === String(member.id)
    );

    // If no assignment → show unassigned row
    if (memberTasks.length === 0) {

      rows.push({
        id: member.id,
        member_id: member.id,
        name: member.name,
        role: member.role,
        project_title: "Unassigned",
        project_id: null,
        assigned: 0,
        completed: 0,
        status: "Active"
      });

    }

    // If assignments exist → create row per project
    else {

      memberTasks.forEach(task => {

        rows.push({
          id: task.id,
          member_id: member.id,
          name: member.name,
          role: member.role,
          project_title: task.project_title,
          project_id: task.project_id,
          assigned: getRangeCount(task.image_range),
          completed: 0,
          status: "Active"
        });

      });

    }

  });

  return rows;

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
    email: '',
    password: '',
  
  });

 
 
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
      id:selected.id,
    });

    if (response.status === 200) {
      // remove from members
      setMembers(prev =>
        prev.filter(m => m.id !== selected.id)
      );

      // remove only the selected assignment row
         setAssignments(prev =>
        prev.filter(a => a.id !== selected.id)
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
  const { project_id, annotator_id, reviewer_id, image_range } = assign;

  if (!project_id || !image_range || (!annotator_id && !reviewer_id)) {
    showError("Please select project, range and at least one role");
    return;
  }

  try {
    const latestAssignments = await fetchTasks();

    const assignToMember = async (memberId) => {
      const newCount = getRangeCount(image_range);

      // find assignment for same member + same project
      const existing = latestAssignments.find(
        (task) =>
          String(task.member_id) === String(memberId) &&
          String(task.project_id) === String(project_id)
      );

      if (existing) {
        // MERGE if same project
        const mergedRange = mergeRanges(existing.image_range, image_range);

        await assignTaskApi({
          project_id,
          member_id: memberId,
          image_range: mergedRange,
          total_images: getRangeCount(mergedRange),
        });

      } else {
        // CREATE NEW ROW if project is different
        await assignTaskApi({
          project_id,
          member_id: memberId,
          image_range,
          total_images: newCount,
        });
      }
    };

    if (annotator_id) {
      await assignToMember(annotator_id);
    }

    if (reviewer_id) {
      await assignToMember(reviewer_id);
    }

    showSuccess("Tasks Assigned Successfully");

    await fetchTasks();
    await fetchAssignmentStats(project_id);

    setAssign({
      project_id: "",
      annotator_id: "",
      reviewer_id: "",
      image_range: "",
      max: null,
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
    const assignedRes = await getAssignedRecordsByPersonApi(  m.member_id, m.project_id);
    console.log("fghjk",m.id);
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
      member_id: selected.member_id,
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
        showProjectSelector = {false}

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
               {/* Email*/}
                {/* <Input
                  label="Email"
                  name="email"
                  placeholder="Enter Member Email"
                  required
                  value={newMember.email}
                  onChange={(e) =>
                    setNewMember({ ...newMember, email: e.target.value })
                  }
                /> */}

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
                { label:"Admin",value:"Admin"}
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
                placeholder="Select Annotator"
               value={String(assign.annotator_id || "")}
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
                  annotator_id: String(value),
                }));
              }}
              />
              
              {/*Reviewer*/}
               <Dropdown
                label="Reviewer"
                placeholder="Select Reviewer"
               value={String(assign.reviewer_id || "")}
                options={members
                  .filter(m => m.role?.toLowerCase() === "reviewer")
                  .map(m => ({
                    label: m.name,
                    value: m.id,   // IMPORTANT: use id from API
                  }))
                }
                onChange={(value) => {
                  setAssign(prev => ({
                    ...prev,
                    reviewer_id: String(value),
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
                    disabled={noImagesAvailable}
                  />

              <div className={styles.rangeValue}>
                  {!stats ? null : stats.next_start_index ? (
                    <>
                      <div>
                        Selected:
                        <b>
                          {stats.next_start_index} - {assign.max ?? stats.next_start_index}
                        </b>
                      </div>

                      <div>
                        Balance:
                        <b style={{ marginLeft: "5px" }}>
                          {stats.total_images - stats.total_assigned}
                        </b>
                      </div>
                    </>
                  ) : (
                    <b style={{ color: "#c92c2c" }}>
                      No images available all are assigned
                    </b>
                  )}
                </div>
                </div>


              </div>

              <div className={styles.actionsRow}>
                <Button
                  variant="primary"
                  icon="fi-rr-share"
                 disabled={
                  !assign.project_id ||
                  !assign.image_range ||
                  (!assign.annotator_id && !assign.reviewer_id)
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
