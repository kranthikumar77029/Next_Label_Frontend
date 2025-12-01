import * as endPoints from '@/networking/project_hub/endpoints';
import { projectsApi } from '@/services/axios';

export const createProjectApi=async(data)=>
    Promise.resolve(projectsApi.post(endPoints.createProject, data));

export const deleteProjectApi = async ({ project_title, project_id }) => {
  Promise.resolve(projectsApi.delete(endPoints.deleteProject, {
    params: {
      project_title,
      project_id,
    },
  })) 
};

export const updateProjectApi = async (project_id, data) => {
    Promise.resolve(projectsApi.put(endPoints.updateProject, data, {
        params:{
          
            project_id,
        },
    }))
};
  
export const listProjectsApi  =async(params={})=>
  Promise.resolve(projectsApi.get(endPoints.listProject, params))