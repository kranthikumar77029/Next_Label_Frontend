import { createContext, useContext, useState } from "react";
import {
  psuedo_labelsApi,
  analyse_psuedo_labelsApi
} from "@/networking/psuedo_labels/psuedo_labelsapi";

const AutoLabelContext = createContext();

export const AutoLabelProvider = ({ children }) => {

  const [analyseLabelResult, setAnalyseLabelResult] = useState(null);
  const [processing, setProcessing] = useState(false);

  //  Runs both APIs (AutoLabel page)
  const runAutoLabel = async (formData, selectedProject) => {

    if (!selectedProject?.id) return;

    const modelPath =
  formData.model === "custom"
    ? `${formData.customModel.toLowerCase().replace(/\.pt$/, "")}.pt`
    : formData.modelType;

    const payload = {
      model_path: modelPath,
      project_id: selectedProject.id,
      project_title: selectedProject.project_title,
      conf_threshold: formData.confidence,
      iou_threshold: formData.iou_confidence,
      filter_classes: formData.classes.map((_, index) => index),
      dbscan_eps: formData.dbscan_eps,
      dbscan_min_samples: formData.dbscan_min_samples,
    };

    const secondPayload = {
      project_title: selectedProject.project_title,
      model_path: modelPath,
      conf_threshold: formData.confidence,
    };

    try {

      setProcessing(true);

      const response = await psuedo_labelsApi(payload);

      if (response.status !== 200) {
        throw new Error("First API failed");
      }

      const secondResponse = await analyse_psuedo_labelsApi(secondPayload);

      if (secondResponse.status === 200) {
        setAnalyseLabelResult(secondResponse.data);
      }

      return secondResponse.data;

    } catch (error) {
      console.error("AutoLabel Error:", error);
      throw error;
    } finally {
      setProcessing(false);
    }
  };

  // 🔹 Only fetch insights (Insights page)
  // const fetchProjectInsights = async (selectedProject) => {

  //   if (!selectedProject?.project_title) return;

  //   try {

  //     const payload = {
  //       project_title: selectedProject.project_title,
  //       model_path: modelPath,
  //       conf_threshold: formData.confidence,
  //     };

  //     const response = await analyse_psuedo_labelsApi(payload);

  //     if (response.status === 200) {
  //       setAnalyseLabelResult(response.data);
  //     }

  //   } catch (error) {
  //     console.error("Insights API error:", error);
  //   }
  // };

  return (
    <AutoLabelContext.Provider
      value={{
        runAutoLabel,
        analyseLabelResult,
        processing
      }}
    >
      {children}
    </AutoLabelContext.Provider>
  );
};

export const useAutoLabel = () => useContext(AutoLabelContext);