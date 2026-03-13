import { Layout } from "@/components/common/layout";
import { useProjects } from "@/context/ProjectContext";
import { useEffect, useState } from "react";
import { KPIBox } from "@/components/common/kpi";
import { get_pseudo_labels_labels_analysisApi } from "@/networking/psuedo_labels/psuedo_labelsapi";
import ConfidenceChart from "@/components/graphs/ConfidenceChart";
import BoxAreaChart from "@/components/graphs/BoxAreaChart";
import DetectionsPerImageChart from "@/components/graphs/DetectionsPerImageChart";
import ThresholdChart from "@/components/graphs/ThresholdChart";
import HeatmapChart from "@/components/graphs/HeatMapChart";
import styles from './styles.module.css';
import ConfVsAreaChart from "@/components/graphs/ConfVSAreaChart";

const AnnotationInsights = () => {
const [activeGraph, setActiveGraph] = useState("confidence");
  const { selectedProject } = useProjects();
  console.log("vfgbnm",selectedProject);
  const [autoLabelResult, setAutoLabelResult] = useState(null);
const fetch_psuedo_labels_analysis = async () => {
  try {

    const response = await get_pseudo_labels_labels_analysisApi(
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

  return (
    <Layout pageTitle="Annotation Insights">
    <div className={styles.kpiRow}>
      <KPIBox
  customKpiWrapper={styles.kpiRow}
  customKpiCardStyles={styles.insightKpiCard}
  items={[
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
      value: autoLabelResult?.data?.avg_detections_per_image?.toFixed(2) ?? "—",
      label: "Avg Detections/Image",
    },
    {
      icon: "fi-rr-badge-percent",
      value: autoLabelResult?.data?.avg_confidence
        ? (autoLabelResult.data.avg_confidence * 100).toFixed(1) + "%"
        : "—",
      label: "Avg Confidence",
    },
  ]}
/>
    </div>
    <div className={styles.graphContainer}>

  <div className={styles.graphTabs}>
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
  </div>

</div>
<div className={styles.graphBox}>

 {activeGraph === "confidence" && (
  <ConfidenceChart graphData={autoLabelResult?.data?.graph_data} />
)}

  {activeGraph === "boxarea" && (
    <BoxAreaChart graphData={autoLabelResult?.data?.graph_data} />
  )}

  {activeGraph === "detections" && (
    <DetectionsPerImageChart
    graphData={autoLabelResult?.data?.graph_data}
  />
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

</div>
    </Layout>
  );
};

export default AnnotationInsights;