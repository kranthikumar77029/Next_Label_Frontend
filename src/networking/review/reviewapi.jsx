import * as endPoints from '@/networking/review/endpoints';
import { reviewApi } from '@/services/axios';

export const reviewImageStatusApi=async(payload)=>{
    return reviewApi.post(endPoints.reviewImageStatus,payload)
}

export const listReviewerTasksApi=async(reviewer_id,project_id,status,annotator_id)=>{
    return reviewApi.get(endPoints.listReviewerTasks,{
        params:{
            reviewer_id,project_id,status,annotator_id
        }
    })
}

export const approveAllImagesApi=async(data)=>{
    return reviewApi.post(endPoints.approveAllImages,data)
}