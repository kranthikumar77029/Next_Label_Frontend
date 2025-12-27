import * as endPoints from '@/networking/team_dashboard/endpoints';
import { teamApi } from '@/services/axios';


export const createMemberApi = async (payload) => {
  return teamApi.post(endPoints.createMember, payload);
};

export const listMembersApi = async () => {
  return teamApi.get(endPoints.listMembers);
};


export const assignTaskApi= async (payload) =>{
    return teamApi.post(endPoints.assignTask,payload);
};

export const listTasksApi = async()=>{
    return teamApi.get(endPoints.listTasks)
} 
export const editMemberApi = (member_id, data) => {
  return teamApi.put(endPoints.editMember, data, {
    params: {
      member_id,
    },
  });
};
export const deleteMemberApi = ({ member_id, name }) => {
  return teamApi.delete(endPoints.deleteMember, {
    params: {
      member_id,
      name,
    },
  });
};



  



