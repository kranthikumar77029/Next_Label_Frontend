import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/text-area";
import { Dropdown } from "@/components/ui/dropdown";
import { useProjects } from '@/context/ProjectContext';
import { Button } from "@/components/ui/button";

import styles from "./styles.module.css";

const ConfigForm = ({ formData,setFormData }) => {
  const {  selectedProject } = useProjects();
//   const [formData, setFormData] = useState({
//   modelType: "YOLOv8",
//   project_id: null,        
//   project_title: "",  
//   imageFolder: "",
//   outputFolder: "",
//   classes: "",
//   confidence: 0,
//   iou_confidence: 0,
//   dbscan_eps: 0,
//   dbscan_min_samples: 0,
// });
useEffect(() => {
  // console.log("Classes effect fired:", selectedProject);

  if (selectedProject?.classes?.length > 0) {
    const classNames = selectedProject.classes.map(
      (cls) => cls.class_name
    );

    setFormData(prev => ({
      ...prev,
      classes: classNames, // ✅ ARRAY
      project_id: selectedProject.id,
      project_title: selectedProject.project_title,
    }));
  } else {
    setFormData(prev => ({
      ...prev,
      classes: [], // ✅ empty array
    }));
  }
}, [selectedProject]);
 
const classOptions = selectedProject?.classes?.map(cls => ({
  label: cls.class_name,
  value: cls.class_name,
})) || [];


// useEffect(() => {
//   console.log("📝 Form Data:", formData);
// }, [formData]);

const MODEL_OPTIONS = [
  { value: "yolo", label: "YOLO" },
  { value: "custom", label: "Custom" }
];

const VERSION_OPTIONS = [
  { value: "v8", label: "v8" },
  { value: "v11", label: "v11" },
  { value: "v26", label: "v26"}
];

const MODEL_SIZE_OPTIONS = [
  { value: "n", label: "Nano (n)" },
  { value: "s", label: "Small (s)" },
  { value: "m", label: "Medium (m)" },
  { value: "l", label: "Large (l)" },
  
];


useEffect(() => {

  if (formData.model === "yolo") {
    const modelName = `yolo${formData.version }${formData.size }.pt`;

    setFormData(prev => ({
      ...prev,
      modelType: modelName
    }));
  }

  if (formData.model === "custom" && formData.customModel) {
    const modelName = `${formData.customModel.toLowerCase().replace(/\.pt$/, "")}.pt`;

    setFormData(prev => ({
      ...prev,
      modelType: modelName
    }));
  }

}, [formData.model, formData.version, formData.size, formData.customModel]);
  return (
    <>
  <div className={styles.modelRow}>
  
  <div className={styles.formGroup}>
    <Dropdown
      label="Model"
      required
      value={formData.model}
      options={MODEL_OPTIONS}
      onChange={(value) =>
        setFormData(prev => ({
          ...prev,
          model: value
        }))
      }
    />
  </div>

  {formData.model !== "custom" && (
    <div className={styles.formGroup}>
      <Dropdown
        label="Version"
        required
        value={formData.version }
        options={VERSION_OPTIONS}
        onChange={(value) =>
          setFormData(prev => ({
            ...prev,
            version: value
          }))
        }
      />
    </div>
  )}

  {formData.model !== "custom" && (
    <div className={styles.formGroup}>
      <Dropdown
        label="Model Size"
        required
        value={formData.size}
        options={MODEL_SIZE_OPTIONS}
        onChange={(value) =>
          setFormData(prev => ({
            ...prev,
            size: value
          }))
        }
      />
    </div>
  )}

  </div>
    {/* Custom Modal*/}
   {formData.model === "custom" && (
  <div className={styles.formGroup}>
    <Input
      label="Custom Model Name"
      placeholder="Enter model name"
      value={formData.customModel || ""}
      onChange={(e) =>
        setFormData(prev => ({
          ...prev,
          customModel: e.target.value
        }))
      }
    />
  </div>
)}
     
      {/* Class Description */}
    <div className={styles.formGroup}>
      <Dropdown
        label="Class Description"
        placeholder="Select Classes"
        options={classOptions} // [{label, value}]
        value={formData.classes} // ["helmet", "person"]
        multiple={true}
        onChange={(values) =>
          setFormData(prev => ({
            ...prev,
            classes: values,
          }))
        }
      />

      </div>

      
      {/* <div className={styles.formGroup}>
      <TextArea
        label="Class Description"
        placeholder="e.g., helmet, person, vest"
        value={formData.classes}
        onChange={(e) =>
          setFormData(prev => ({
            ...prev,
            classes: e.target.value,
          }))
        }
      />
    </div> */}


    <div className={styles.sliderGrid}>
  {/* Confidence Threshold */}
  <div className={styles.formGroup}>
    <label className={styles.label}>Confidence Threshold</label>
    <div className={styles.sliderWrapper}>
      <Input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={formData.confidence}
        onChange={(e) =>
          setFormData(prev => ({
            ...prev,
            confidence: Number(e.target.value),
          }))
        }
        className={styles.slider}
      />
      <span className={styles.sliderValue}>{formData.confidence}</span>
    </div>
  </div>

  {/* IOU Threshold */}
  <div className={styles.formGroup}>
    <label className={styles.label}>IOU Threshold</label>
    <div className={styles.sliderWrapper}>
      <Input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={formData.iou_confidence}
        onChange={(e) =>
          setFormData(prev => ({
            ...prev,
            iou_confidence: Number(e.target.value),
          }))
        }
        className={styles.slider}
      />
      <span className={styles.sliderValue}>{formData.iou_confidence}</span>
    </div>
  </div>

  {/* DBScan EPS */}
  <div className={styles.formGroup}>
    <label className={styles.label}>DBScan EPS</label>
    <div className={styles.sliderWrapper}>
      <Input
        type="range"
        min={0}
        max={1}
        step={0.1}
        value={formData.dbscan_eps}
        onChange={(e) =>
          setFormData(prev => ({
            ...prev,
            dbscan_eps: Number(e.target.value),
          }))
        }
        className={styles.slider}
      />
      <span className={styles.sliderValue}>{formData.dbscan_eps}</span>
    </div>
  </div>

  {/* DBScan Min Samples */}
  <div className={styles.formGroup}>
    <label className={styles.label}>DBScan Min Samples</label>
    <div className={styles.sliderWrapper}>
      <Input
        type="range"
        min={0}
        max={10}
        step={1}
        value={formData.dbscan_min_samples}
        onChange={(e) =>
          setFormData(prev => ({
            ...prev,
            dbscan_min_samples: Number(e.target.value),
          }))
        }
        className={styles.slider}
      />
      <span className={styles.sliderValue}>
        {formData.dbscan_min_samples}
      </span>
    </div>
  </div>
</div>

     
      {/* Actions */}
      {/* <div className={styles.modalActions}>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>

        <Button
          variant="primary"
          icon="fi-rr-play"
          onClick={() =>
            onStart({
              modelType,
              classes,
              confidence,
            })
          }
          fullWidth
        >
          Start Processing
        </Button>
      </div> */}
    </>
  );
};

export  {ConfigForm};
