import { Layout } from "@/components/common/layout";
import { useProjects } from "@/context/ProjectContext";
import { useEffect, useState } from "react";
import { KPIBox } from "@/components/common/kpi";
import { Modal } from '@/components/common/modal';
import { Button } from "@/components/ui/button";
import { Form } from '@/components/common/form';
import { useToast } from "@/hooks/use-toast";
import { get_pseudo_labels_analysisApi,compare_modalsApi } from "@/networking/psuedo_labels/psuedo_labelsapi";
import styles from './styles.module.css';
import ConfidenceChart from "@/components/graphs/ConfidenceChart";
import BoxAreaChart from "@/components/graphs/BoxAreaChart";
import DetectionsPerImageChart from "@/components/graphs/DetectionsPerImageChart";
import ThresholdChart from "@/components/graphs/ThresholdChart";
import HeatmapChart from "@/components/graphs/HeatMapChart";
import ConfVsAreaChart from "@/components/graphs/ConfVSAreaChart";
import DetectionDensityChart from "@/components/graphs/DetectionDensityChart";
import ConfidenceOverlapChart from "@/components/graphs/ConfidenceOverlapChart";
import IoUAgreementChart from "@/components/graphs/IouAgreementChart";
import DMSDistributionChart from "@/components/graphs/DMSDistributionChart";

const AnnotationInsights = () => {
  const [viewMode, setViewMode] = useState("pseudo");
  const [activeGraph, setActiveGraph] = useState("confidence");
  const [compareResult, setCompareResult] = useState(null);
  const [showModal, setShowModal] = useState(null);
  const { selectedProject } = useProjects();
    const { showSuccess,showError } = useToast();
  // console.log("vfgbnm",selectedProject);
  const [autoLabelResult, setAutoLabelResult] = useState(null);
 const [formData, setFormData] = useState({
  project_id: "",
  project_title: "",
  modelA: "",
  modelB: "",
  confidence: "",
  max_images: 50
});
const kpiItems =
  viewMode === "compare"
    ? [
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
      ]
    : [
        {
          icon: "fi-rr-picture",
          value: autoLabelResult?.data?.total_images ?? "—",
          label: "Total Images",
        },
        {
          icon: "fi-rr-search-alt",
          value: autoLabelResult?.data?.total_detections ?? "—",
          label: "Total Detections",
        },
        {
          icon: "fi-rr-chart-histogram",
          value:
            autoLabelResult?.data?.avg_detections_per_image?.toFixed(2) ?? "—",
          label: "Avg Detections/Image",
        },
        {
          icon: "fi-rr-badge-percent",
          value: autoLabelResult?.data?.avg_confidence
            ? (autoLabelResult.data.avg_confidence * 100).toFixed(1) + "%"
            : "—",
          label: "Avg Confidence",
        },
      ];
const fetch_psuedo_labels_analysis = async () => {
  try {

    const response = await get_pseudo_labels_analysisApi(
      selectedProject?.id,
      selectedProject?.project_title
    );

    console.log("Pseudo Label Analysis:", response.data);

    if (response?.status === 200) {
      setAutoLabelResult(
        response.data.pseudo_label_analysis
      );
    }

  } catch (error) {
    console.error("Pseudo Label Analysis Error:", error);
  }
};
  useEffect(() => {

    if (!selectedProject?.id) return;

    fetch_psuedo_labels_analysis(
      selectedProject.id,
      selectedProject.project_title
    );

  }, [selectedProject]);

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

    console.log("Compare Response:", response.data);

    if (response?.status === 200) {
      // handle result (graphs / comparison data)
      setShowModal(null);
      setCompareResult(response.data.summary);
      setActiveGraph("density"); 
      setViewMode("compare");
       showSuccess("Compare Models Successfully")
      
    }

  } catch (error) {
    showError(error.detail)
    console.error("Compare Models Error:", error);
  }
};

  return (
   <Layout
  pageTitle={
    viewMode === "compare"
      ? `Model Comparison: ${compareResult?.model_a?.name} vs ${compareResult?.model_b?.name}`
      : "Annotation Insights"
  }
  showProjectSelector={viewMode !== "compare"} 
headerActions={
  viewMode === "compare" ? (
    <Button
      icon="fi-rr-arrow-left"
      onClick={() => {
        setViewMode("pseudo");
        setActiveGraph("confidence");
        setCompareResult(null);
      }}
    >
      Back to Annotation Insights
    </Button>
  ) : (
    <Button
      icon="fi-rr-chart-line-up"
      onClick={() => {
        setFormData({
          project_id: "",
          project_title: "",
          modelA: "",
          modelB: "",
          confidence: "",
          max_images: 50
        });
        setShowModal("compare");
      }}
    >
      Compare Models
    </Button>
  )
}
    >
    <div className={styles.kpiRow}>
      <KPIBox
        customKpiWrapper={styles.kpiRow}
        customKpiCardStyles={styles.insightKpiCard}
        items={kpiItems}
      />
    </div>
 <div className={styles.graphContainer}>
  <div className={styles.graphTabs}>

    {viewMode === "pseudo" && (
      <>
        <button
          className={activeGraph === "confidence" ? styles.activeTab : ""}
          onClick={() => setActiveGraph("confidence")}
        >
          Confidence Dist.
        </button>

        <button
          className={activeGraph === "boxarea" ? styles.activeTab : ""}
          onClick={() => setActiveGraph("boxarea")}
        >
          Box Area Dist.
        </button>

        <button
          className={activeGraph === "detections" ? styles.activeTab : ""}
          onClick={() => setActiveGraph("detections")}
        >
          Det. per Image
        </button>

        <button
          className={activeGraph === "threshold" ? styles.activeTab : ""}
          onClick={() => setActiveGraph("threshold")}
        >
          Threshold Curve
        </button>

        <button
          className={activeGraph === "heatmap" ? styles.activeTab : ""}
          onClick={() => setActiveGraph("heatmap")}
        >
          Spatial Heatmap
        </button>

        <button
          className={activeGraph === "confarea" ? styles.activeTab : ""}
          onClick={() => setActiveGraph("confarea")}
        >
          Conf vs Area
        </button>
      </>
    )}

    {viewMode === "compare" && (
      <>
        <button
          className={activeGraph === "density" ? styles.activeTab : ""}
          onClick={() => setActiveGraph("density")}
        >
          Detection Density
        </button>

        <button
          className={activeGraph === "overlap" ? styles.activeTab : ""}
          onClick={() => setActiveGraph("overlap")}
        >
          Confidence Overlap
        </button>

        <button
          className={activeGraph === "iou" ? styles.activeTab : ""}
          onClick={() => setActiveGraph("iou")}
        >
          IoU Agreement
        </button>

        <button
          className={activeGraph === "dms" ? styles.activeTab : ""}
          onClick={() => setActiveGraph("dms")}
        >
          DMS Distribution
        </button>
      </>
    )}

  </div>
</div>
  <div className={styles.graphBox}>

  {viewMode === "pseudo" && (
    <>
      {activeGraph === "confidence" && (
        <ConfidenceChart graphData={autoLabelResult?.data?.graph_data} />
      )}

      {activeGraph === "boxarea" && (
        <BoxAreaChart graphData={autoLabelResult?.data?.graph_data} />
      )}

      {activeGraph === "detections" && (
        <DetectionsPerImageChart graphData={autoLabelResult?.data?.graph_data} />
      )}

      {activeGraph === "threshold" && (
        <ThresholdChart graphData={autoLabelResult?.data?.graph_data} />
      )}

      {activeGraph === "heatmap" && (
        <HeatmapChart graphData={autoLabelResult?.data?.graph_data} />
      )}

      {activeGraph === "confarea" && (
        <ConfVsAreaChart graphData={autoLabelResult?.data?.graph_data} />
      )}
    </>
  )}

  {viewMode === "compare" && (
    <>
      {activeGraph === "density" && (
        <DetectionDensityChart
          graphData={compareResult?.graph_data?.detection_density}
        />
      )}
      {activeGraph === "overlap" && (
        <ConfidenceOverlapChart
          graphData={compareResult?.graph_data?.confidence_overlap}
          modelAName={compareResult?.model_a?.name}
          modelBName={compareResult?.model_b?.name}
        />
      )}

      {activeGraph === "iou" && (
      <IoUAgreementChart
        graphData={compareResult?.graph_data?.iou_agreement}
        meanIoU={compareResult?.mean_iou_agreement}
      />
    )}

    {activeGraph === "dms" && (
  <DMSDistributionChart
    graphData={compareResult?.graph_data?.dms_distribution}
    meanDMS={compareResult?.mean_matching_score_dms}
  />
)}
    </>
  )}

</div>

 {/* {viewMode === "compare" && (
  <div className={styles.compareHeader}>
    <Button
      icon="fi-rr-arrow-left"
      onClick={() => {
         setActiveGraph("confidence"); 
        setViewMode("pseudo");
        setCompareResult(null);
      }}
    >
      Back to Annotation Insights
    </Button>
  </div>
)} */}
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

export default AnnotationInsights;