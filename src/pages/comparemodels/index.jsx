import { useState } from "react";
import { Layout } from "@/components/common/layout";
import { Modal } from '@/components/common/modal';
import { Button } from "@/components/ui/button";
import { Form } from '@/components/common/form';
import { KPIBox } from "@/components/common/kpi";
import { compare_modalsApi } from "@/networking/psuedo_labels/psuedo_labelsapi";
// import { useProjects } from "@/context/ProjectContext";
import { useToast } from '@/hooks/use-toast';
import styles from './styles.module.css';


const CompareModels = () => {
   const [showModal, setShowModal] = useState(null);
   const { showSuccess, showError } = useToast();

   const [compareResult, setCompareResult] = useState(null);
  //  const { selectedProject } = useProjects();
    const [formData, setFormData] = useState({
     project_id: "",
     project_title: "",
     modelA: "",
     modelB: "",
     confidence: "",
     max_images: 50
   });
const handleCompareSubmit = async (e) => {
  e.preventDefault();

 const payload = {
  project_id: formData.project_id,
  project_title: formData.project_title,
  model_a:
    formData.modelA === "custom"
      ? formData.customModelA
      : formData.modelA,
  model_b:
    formData.modelB === "custom"
      ? formData.customModelB
      : formData.modelB,
  conf_threshold: formData.confidence,
  max_images: formData.max_images
};

  try {
    console.log("Compare Payload:", payload);

    const response = await compare_modalsApi(payload);
   
     
    if (response?.status === 200) {
      // handle result (graphs / comparison data)
      setCompareResult(response.data.summary);
      showSuccess("Compare Models Successfully")
      setShowModal(null);
    }

  } catch (error) {
    showError(error.detail)
    console.error("Compare Models Error:", error);
  }
};
  return (
    <Layout pageTitle="Compare Models"
    headerActions={
    <Button
      icon="fi-rr-chart-line-up"
      onClick={() => {
        setFormData({
          project_id: "",
          modelA: "",
          modelB: "",
          confidence: ""
        });
        setShowModal("compare");
      }}
    >
      Compare Models
    </Button>
      }>
        <div className={styles.kpiRow}>
          <KPIBox
            customKpiWrapper={styles.kpiRow}
            customKpiCardStyles={styles.insightKpiCard}
            items={[
              {
                icon: "fi-rr-search-alt",
                value: compareResult?.model_a?.total_detections ?? "—",
                label: `Model A (${compareResult?.model_a?.name}) Detections`,
              },
              {
                icon: "fi-rr-search",
                value: compareResult?.model_b?.total_detections ?? "—",
                label: `Model B (${compareResult?.model_b?.name}) Detections`,
              },
              {
                icon: "fi-rr-vector",
                value: compareResult?.mean_iou_agreement
                  ? compareResult.mean_iou_agreement.toFixed(3)
                  : "—",
                label: "Mean IoU Agreement",
              },
              {
                icon: "fi-rr-chart-scatter",
                value: compareResult?.mean_matching_score_dms
                  ? compareResult.mean_matching_score_dms.toFixed(3)
                  : "—",
                label: "Matching Score (DMS)",
              },
            ]}
          />
        </div>

    {showModal === "compare" && (
      <Modal
        title="Compare Models"
        onClose={() => {
      
          setShowModal(null);
        }}
      >
        <Form
          mode="compare"
          formData={formData}
          setFormData={setFormData}
          onCancel={() => {
            setShowModal(null);
          }}
             
          onSubmit={handleCompareSubmit}
          submitLabel="Compare"
        />
      </Modal>
    )}
      
    </Layout>
  );
};

export default CompareModels;