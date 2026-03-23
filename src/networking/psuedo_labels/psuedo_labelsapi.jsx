import * as endPoints from '@/networking/psuedo_labels/endpoints';
import { generate_pseudo_labelsApi } from '@/services/axios';



export const psuedo_labelsApi= async (data)=>{
    return generate_pseudo_labelsApi.post(endPoints.pseudo_labels,data)
}


export const analyse_psuedo_labelsApi=async(data)=>{
    return generate_pseudo_labelsApi.post(endPoints.analyse_psuedo_labels,data)
}

export const get_pseudo_labels_analysisApi = async (project_id, project_title) => {
  return generate_pseudo_labelsApi.get(
    endPoints.get_pseudo_labels_labels_analysis,
    {
      params: {
        project_id: project_id,
        project_title: project_title
      }
    }
  );
};

export const compare_modalsApi=async(data)=>{
  return generate_pseudo_labelsApi.post(endPoints.compare_modals,data)
}