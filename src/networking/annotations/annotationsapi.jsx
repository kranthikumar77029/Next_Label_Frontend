import * as endPoints from '@/networking/annotations/endpoints';
import { annotationsApi } from '@/services/axios';

export const loadAnnotationApi=async(project_id,image_id) => {
   return annotationsApi.get(endPoints.generate_labels, {
    params: { project_id,image_id},
  }); 
}

export const saveAnnotationApi = async (data) => {
  return annotationsApi.post(
    endPoints.save_label,
    data 
  );
};

export const listAssignedImagesApi= async(project_id,member_id)=>{
  return annotationsApi.get(endPoints.list_assigned_images,{
    params:{project_id,member_id}
  })
}

export const currentImageIndexApi=async(data)=>{
  return annotationsApi.post(endPoints.currentImageIndex,data);
};

export const getCurrentImageIndexApi=async(project_id,member_id)=>{
  return annotationsApi.get(endPoints.getCurrentImageIndex,{
    params:{project_id,member_id}
  })
}
export const listSpecifiedImageApi=async(member_id,project_id,start_index)=>{
  return annotationsApi.get(endPoints.list_specified_images,{
    params:{
      member_id,project_id,start_index
    }
  })
}

export const list_assigned_with_labelsApi=async(project_id,member_id,status,active_index)=>{
  return annotationsApi.get(endPoints.list_assigned_with_labels,{
    params:{
      project_id,member_id,status,active_index
    }
  })
}