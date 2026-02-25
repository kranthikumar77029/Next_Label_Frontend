import * as endPoints from '@/networking/team_dashboard/endpoints';
import Team from '@/pages/team';
import TeamLabel from '@/pages/team-label';
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
// export const editMemberApi = (member_id, data) => {
//   return teamApi.put(endPoints.editMember, data, {
//     params: {
//       member_id,
//     },
//   });
// };
export const deleteMemberApi = ({ member_id, name }) => {
  return teamApi.delete(endPoints.deleteMember, {
    params: {
      member_id,
      name,
    },
  });
};

export const getAssigmnetStatsByProjectApi=(project_id)=>{
  return teamApi.get(endPoints.getAssigmnetStatsByProject,{
    params:{
      project_id
    }
  })
}

  
export const getAssignedRecordsByPersonApi=(member_id,project_id)=>{
  return teamApi.get(endPoints.getAssignedRecordsByPerson,{
    params:{
      member_id,project_id
    }
  })
}


export const editMemberApi=async(payload)=>{
  return teamApi.post(endPoints.editMember,payload)
}

export const getUnassignedRecordsApi=async(project_id)=>{
  return teamApi.get(endPoints.getUnassignedRecords,{
    params:{
      project_id
    }
  })
}