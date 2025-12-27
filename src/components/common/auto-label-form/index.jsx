import { Input } from "@/components/ui/input";
import { Dropdown } from "@/components/ui/dropdown";
import { Button } from "@/components/ui/button";
import styles from "./styles.module.css";

const InferenceForm = ({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  submitLabel = "Run",
  modelOptions = [],
  imageFolderOptions = [],
  outputFolderOptions = [],
  classOptions = [],
}) => {

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...formData,
      filter_classes: Array.isArray(formData.filter_classes)
        ? formData.filter_classes
        : formData.filter_classes
        ? formData.filter_classes.split(",").map((c) => c.trim())
        : [],
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>

      {/* MODEL PATH */}
      <Dropdown
        label="Model Path"
        placeholder="Select model"
        value={formData.model_path}
        options={modelOptions}
        onChange={(value) => handleChange("model_path", value)}
      />

      {/* IMAGE FOLDER */}
      <Dropdown
        label="Image Folder"
        placeholder="Select image folder"
        value={formData.image_folder}
        options={imageFolderOptions}
        onChange={(value) => handleChange("image_folder", value)}
      />

      {/* OUTPUT FOLDER */}
      <Dropdown
        label="Output Folder"
        placeholder="Select output folder"
        value={formData.output_folder}
        options={outputFolderOptions}
        onChange={(value) => handleChange("output_folder", value)}
      />

      {/* CONF THRESHOLD */}
      <Input
        label={`Confidence Threshold (${formData.conf_threshold})`}
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={formData.conf_threshold}
        onChange={(e) =>
          handleChange("conf_threshold", Number(e.target.value))
        }
      />

      {/* IOU THRESHOLD */}
      <Input
        label={`IoU Threshold (${formData.iou_threshold})`}
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={formData.iou_threshold}
        onChange={(e) =>
          handleChange("iou_threshold", Number(e.target.value))
        }
      />

      {/* FILTER CLASSES */}
      <Dropdown
        label="Filter Classes"
        placeholder="Select classes"
        multiple
        value={formData.filter_classes}
        options={classOptions}
        onChange={(value) => handleChange("filter_classes", value)}
      />

      {/* DBSCAN EPS */}
      <Input
        label={`DBSCAN Epsilon (${formData.dbscan_eps})`}
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={formData.dbscan_eps}
        onChange={(e) =>
          handleChange("dbscan_eps", Number(e.target.value))
        }
      />

      {/* DBSCAN MIN SAMPLES */}
      <Input
        label={`DBSCAN Min Samples (${formData.dbscan_min_samples})`}
        type="range"
        min={1}
        max={20}
        step={1}
        value={formData.dbscan_min_samples}
        onChange={(e) =>
          handleChange("dbscan_min_samples", Number(e.target.value))
        }
      />

      {/* ACTIONS */}
      <div className={styles.modalActions}>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>

        <Button type="submit" variant="primary">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export { InferenceForm };
