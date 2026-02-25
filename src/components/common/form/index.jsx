import {Input} from "@/components/ui/input";
import {TextArea} from "@/components/ui/text-area";
import { Button } from "@/components/ui/button";
import { ColorPalette } from "@/components/ui/color-palette";
import { Dropdown } from "@/components/ui/dropdown";
import { useState } from 'react';
import { useProjects } from '@/context/ProjectContext';
import styles from "./styles.module.css";

// const Form = ({  onSubmit, onCancel, submitLabel }) => {
//   const [formData, setFormData] = useState({
//     project_title: "",
//     description: "",
//     tags: "",
//   });
const Form = ({ 
  formData, 
  setFormData, 
  onSubmit, 
  onCancel, 
  submitLabel,
  mode = "project"   
}) => {

  const [errors, setErrors] = useState({});
  const { projects } = useProjects();
  const [selectedProject, setSelectedProject] = useState("");


  const validateForm = () => {
    let newErrors = {};

    if (mode === "project" && !formData.project_title?.trim()) {
      newErrors.project_title = "Project title is required";
    }

    if (mode === "class" && !formData.name?.trim()) {
      newErrors.name = "Class name is required";
    }

    if (mode !== "member" && !formData.description?.trim()) {
      newErrors.description = "Description is required";
    }
    if (mode === "class" && !formData.color) {
      newErrors.color = "Please select a color";
    }
    if (mode === "member" && !formData.name?.trim()) {
        newErrors.name = "Name is required";
      }

      if (mode === "member" && !formData.role) {
        newErrors.role = "Role is required";
      }

      if (mode === "member" && (!formData.assigned || formData.assigned <= 0)) {
        newErrors.assigned = "Assigned value is required";
      }


    return newErrors;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = (e) => {
    
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>

      {/* ---------------- PROJECT TITLE ---------------- */}
      {mode === "project" && (
        <Input
          label="Project Title"
          required
          name="project_title"
          placeholder="e.g., Vehicle Detection System"
          value={formData.project_title}
          onChange={(e) => handleChange("project_title", e.target.value)}
          error={errors.project_title}
        />
      )}

      {/* ---------------- CLASS NAME ---------------- */}
      {mode === "class" && (
        <Input
          label="Class Name"
          required
          name="name"
          placeholder="Helmet"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          error={errors.name}
        />
      )}

      {/* ---------------- COLOR PICKER ---------------- */}
      {mode === "class" && (
        <ColorPalette
          label="Color"
          required
          value={formData.color}
          onChange={(color) => handleChange("color", color)}
          error={errors.color}
        />
      )}
{/*       
    {mode === "class" && (
      <Dropdown
        label="Project"
        required
        placeholder="Select Project"
        value={formData.project}
        options={projects.map((p) => ({
          label: p.project_title,
          value: p.id,
        }))}
        onChange={(value) => {
          const selectedProject = projects.find(p => p.id === value);

          console.log("Selected project:", selectedProject);

          setFormData(prev => ({
            ...prev,
            project: value,
            project_title: selectedProject?.project_title || "",
          }));
        }}
      />
    )} */}



      {/* ---------------- DESCRIPTION ---------------- */}
      {mode !== "member" && (
        <TextArea
          label="Description"
          required
          name="description"
          placeholder="Describe..."
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          error={errors.description}
        />
      )}

      {/* ---------------- TAGS (PROJECT ONLY) ---------------- */}
      {mode === "project" && (
        <Input
          label="Tags / Domain"
          name="tags"
          placeholder="e.g., Manufacturing, Automotive"
          value={formData.tags}
          onChange={(e) => handleChange("tags", e.target.value)}
        />
      )}

      {/* ---------------- MEMBER NAME ---------------- */}
      {mode === "member" && (
        <Input
          label="Name"
          required
          name="name"
          placeholder="Enter Member Name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          error={errors.name}
        />
      )}

      {/* ---------------- MEMBER ROLE ---------------- */}
     {mode === "member" && (
      <Dropdown
        label="Role"
        required
        placeholder="Select Role"
        value={formData.role || ""}
        options={[
          { label: "Annotator", value: "Annotator" },
          { label: "Reviewer", value: "Reviewer" },
        ]}
        onChange={(value) => handleChange("role", value)}
      />
      )}
      {/* ---------------- ASSIGNED ---------------- */}
      {mode === "member" && (
      <Input
        label="Assigned"
        required
        name="image_range"
        type="number"
        placeholder="50"
        value={formData.image_range}
        onChange={(e) =>
          handleChange("image_range", e.target.value)
        }
        error={errors.image_range}
      />
    )}
 {/* ---------------- UNASSIGNED ---------------- */}
      {mode === "member" && (
      <Input
        label="UnAssigned"
        name="Unassigned"
        type="number"
        placeholder="Unassigned images Data"
        value={formData.unassigned_count}
        onChange={(e) =>
          handleChange("Unassigned", e.target.value)
        }
        error={errors.image_range}
      />
    )}

      {/*----------------Edited Count---------*/}
      {mode === "member" && (
      <Input
        label="Edited Count"
        name="edited_count"
        type="number"
        placeholder="Enter Edited Count"
        value={formData.edited_count ?? ""}
        // min={1}
        // max={tasksData?.length || 0}
        onChange={(e) =>
          handleChange("edited_count", e.target.value)
        }
      />
    )}
     {/* ---------------- ACTIONS ---------------- */}
      <div className={styles.modalActions}>
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>

        <Button variant="primary" type="submit" icon="fi-rr-check" onClick={onSubmit}>
          {submitLabel}
        </Button>
      </div>

    </form>
  );
};

export { Form };
