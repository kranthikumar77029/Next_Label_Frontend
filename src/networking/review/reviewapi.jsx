import * as endPoints from '@/networking/review/endpoints';
import { reviewApi } from '@/services/axios';

export const reviewImageStatusApi=async(payload)=>{
    return reviewApi.post(endPoints.reviewImageStatus,payload)
}

export const listReviewerTasksApi=async(reviewer_id,project_id,status)=>{
    return reviewApi.get(endPoints.listReviewerTasks,{
        params:{
            reviewer_id,project_id,status
        }
    })
}