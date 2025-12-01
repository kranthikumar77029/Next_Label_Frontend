import * as endPoints from '@/networking/project_hub/endpoints';
import {  uploadAndManageImagesApi } from '@/services/axios';

export const uploadImagesApi=async(data)=>
    Promise.resolve(uploadAndManageImagesApi.post(endPoints.uploadImages, data));