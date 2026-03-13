import * as endPoints from '@/networking/activity/endpoints';
import { activityApi } from '@/services/axios';

export const getTrackingStatsApi=async(project_id)=>{
    return activityApi.get(endPoints.getTrackingStats,{
        params:{
            project_id
        }
    })
}