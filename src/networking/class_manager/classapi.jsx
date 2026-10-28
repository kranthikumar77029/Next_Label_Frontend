import * as endPoints from '@/networking/class_manager/endpoints';
import { classApi } from '@/services/axios';

export const createClassApi= async (data)=>{
    return classApi.post(endPoints.createClass,data)
}

export const listClassesApi = async (project_id) => {
  return classApi.get(endPoints.listClasses, {
    params: { project_id },
  });
};

export const updateClassApi = async ({ id,class_name, updates }) => {
  return classApi.put(
    endPoints.updateClass,
    updates,              
    { params: { id ,class_name} }   
  );
};

export const deleteClassApi= async ({id,class_name})=>{
  return classApi.delete(endPoints.deleteClass,{
    params:{
      id,
      class_name
    }
  })
}