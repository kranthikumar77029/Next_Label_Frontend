import {Input} from "@/components/ui/input";
import {TextArea} from "@/components/ui/text-area";
import { Button } from "@/components/ui/button";
import { useState } from 'react';
import styles from "./styles.module.css";

// const Form = ({  onSubmit, onCancel, submitLabel }) => {
//   const [formData, setFormData] = useState({
//     project_title: "",
//     description: "",
//     tags: "",
//   });
const Form = ({ formData, setFormData, onSubmit, onCancel, submitLabel }) => {

   const [errors, setErrors] = useState({});
  
   const validateForm = () => {
    let newErrors = {};

    if (!formData.project_title.trim()) {
      newErrors.project_title = "Project title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    return newErrors;
  };
  //  const handleChange = (field, value) => {
  //   setFormData({ ...formData, [field]: value });
const handleChange = (field, value) => {
  setFormData((prev) => ({
    ...prev,
    [field]: value,
  }));


    // Clear error dynamically when user types
    setErrors((prev) => ({ ...prev, [field]: "" }));
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
       <Input
        label="Project Title"
        required
        name="project_title"
        placeholder="e.g., Vehicle Detection System"
        value={formData.title}
        onChange={(e) => handleChange("project_title", e.target.value)}
        error={errors.project_title}
      />

      <TextArea
        label="Description"
        required
        name="description"
        placeholder="Describe your project goals..."
        value={formData.description}
        onChange={(e) => handleChange("description", e.target.value)}
        error={errors.description}
      />

      <Input
        label="Tags / Domain"
        name="tags"
        placeholder="e.g., Manufacturing, Automotive"
        value={formData.tags}
        onChange={(e) => handleChange("tags", e.target.value)}
      />

      <div className={styles.modalActions}>
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>

        <Button variant="primary" type="submit" icon="fi-rr-check">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export { Form };
