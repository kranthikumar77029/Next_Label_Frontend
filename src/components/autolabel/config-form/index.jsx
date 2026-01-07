import { useState,useEffect } from "react";
import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/text-area";
import { Dropdown } from "@/components/ui/dropdown";
import { useProjects } from '@/context/ProjectContext';
import { Button } from "@/components/ui/button";

import styles from "./styles.module.css";

const ConfigForm = ({ formData,setFormData }) => {
  const { projects, selectedProject, setSelectedProject } = useProjects();
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
  console.log("Classes effect fired:", selectedProject);
  if (selectedProject?.classes?.length > 0) {
    const classNames = selectedProject.classes
      .map((cls) => cls.class_name)
      .join(", ");

    setFormData((prev) => ({
      ...prev,
      classes: classNames,
      project_id: selectedProject.id,              
      project_title: selectedProject.project_title,
    }));
  } else {
    setFormData((prev) => ({
      ...prev,
      classes: "",
    }));
  }
}, [selectedProject]);

useEffect(() => {
  console.log("📝 Form Data:", formData);
}, [formData]);

const MODEL_TYPE_OPTIONS=[
  { value:"yolov8n.pt",  label: "yolov8n"},
  { value:"yolov8s.pt",  label:"yolov8s"},
  { value:"yolov8m.pt",  label:"yolov8m"},
  { value:"yolov8l.pt",  label:"yolov8l"},
  { value:"yolov8x.pt",  label:"yolov8x"},
  { value:"yolo11n.pt",  label:"yolov11n"},
  { value:"yolo11s.pt",  label:"yolov11s"},
  { value:"yolo11m.pt",  label:"yolov11m"},
  { value:"yolo11l.pt",  label:"yolov11l"},
  { value:"yolo11x.pt",  label:"yolov11x"},
  { value: "custom", label: "Custom" }
]


  return (
    <>
      {/* Model Type */}
      <div className={styles.formGroup}>
        <Dropdown
          label="Model Type"
          value={formData.modelType}
           onChange={(value) =>
            setFormData(prev => ({
              ...prev,
              modelType: value,
              // clear custom model if not custom
              customModel: value === "custom" ? prev.customModel : "",
            }))
          }
           options={MODEL_TYPE_OPTIONS}
        />
        {formData.modelType === "custom" && (
        <div className={styles.formGroup}>
          <Input
            label="Custom Model Name"
            placeholder="Enter model name"
            value={formData.customModel || ""}
            onChange={(e) =>
              setFormData(prev => ({
                ...prev,
                customModel: e.target.value,
              }))
            }
          />
        </div>
      )}

      </div>

      {/*Image folder */}
      {/* <div className={styles.formGroup}>
        <Dropdown
          label="Image_folder"
          required
          placeholder="Select folder"
          value={formData.imageFolder}
          options={projects.map((p) => ({
            label: p.project_title,
            value: p.project_title,
          }))}
          onChange={(value) => {
            const project = projects.find(p => p.project_title === value);
            if (project) setSelectedProject(project);
            setFormData(prev => ({ ...prev, imageFolder: value }));
          }}
        />

      </div> */}
     
      {/*Output folder*/}
      {/* <div className={styles.formGroup}>
          <Dropdown
            label="Output_folder"
            required
            placeholder="Select folder"
            value={formData.outputFolder}
            options={projects.map((p) => ({
              label: p.project_title,
              value: p.project_title, 
            }))}
            onChange={(value) => {
            const project = projects.find(p => p.project_title === value);
            if (project) setSelectedProject(project);
            setFormData(prev => ({ ...prev, outputFolder: value }));
          }}
          />
        </div> */}

      {/* Class Description */}
      <div className={styles.formGroup}>
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
</div>


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

          <span className={styles.sliderValue}>
            {formData.confidence}
          </span>
        </div>
      </div>

       {/*IOU Threshold*/}
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

      <span className={styles.sliderValue}>
        {formData.iou_confidence}
      </span>
    </div>
       </div>

      {/*dbscan_eps*/}
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

    <span className={styles.sliderValue}>
      {formData.dbscan_eps}
    </span>
  </div>
     </div>

      {/*dbscan_min_samples*/}
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
