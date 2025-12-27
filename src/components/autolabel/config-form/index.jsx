import { useState } from "react";
import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/text-area";
import { Dropdown } from "@/components/ui/dropdown";
import { Button } from "@/components/ui/button";

import styles from "./styles.module.css";

const ConfigForm = ({ onCancel, onStart }) => {
  const [modelType, setModelType] = useState("YOLOv8");
  const [classes, setClasses] = useState("helmet, person, vest");
  const [confidence, setConfidence] = useState(0);
  const [iou_confidence, setIou_Confidence] = useState(0);

  return (
    <>
      {/* Model Type */}
      <div className={styles.formGroup}>
        <Dropdown
          label="Model Type"
          value={modelType}
          onChange={setModelType}
          options={[
            { value: "YOLOv8", label: "YOLOv8" },
            { value: "Faster R-CNN", label: "Faster R-CNN" },
            { value: "Custom Model", label: "Custom Model" },
          ]}
        />
      </div>

      {/* Class Description */}
      <div className={styles.formGroup}>
        <TextArea
          label="Class Description"
          placeholder="e.g., helmet, person, vest"
          value={classes}
          onChange={(e) => setClasses(e.target.value)}
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
            value={confidence}
            onChange={(e) => setConfidence(e.target.value)}
            className={styles.slider}
          />

          <span className={styles.sliderValue}>{confidence}%</span>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>IOU_threshold</label>

        <div className={styles.sliderWrapper}>
          <Input
            type="range"
            min={0}
            max={1}
            step={0.01}              // important
            value={iou_confidence}
            onChange={(e) =>
              setIou_Confidence(Number(e.target.value))
            }
            className={styles.slider}
          />


          <span className={styles.sliderValue}>{iou_confidence}%</span>
        </div>
      </div>

      {/* Actions */}
      <div className={styles.modalActions}>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>

        <Button
          variant="primary"
          icon="fi-rr-play"
          // onClick={() =>
          //   onStart({
          //     modelType,
          //     classes,
          //     confidence,
          //   })
          // }
          fullWidth
        >
          Start Processing
        </Button>
      </div>
    </>
  );
};

export  {ConfigForm};
