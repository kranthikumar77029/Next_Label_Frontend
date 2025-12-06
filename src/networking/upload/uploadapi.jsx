import * as endPoints from '@/networking/upload/endpoints';
import {  uploadAndManageImagesApi } from '@/services/axios';

export const uploadImagesApi=async(data)=>
    Promise.resolve(uploadAndManageImagesApi.post(endPoints.uploadImages, data,{
          headers: { "Content-Type": "multipart/form-data" }
    }));



export const listImagesApi = async (params = {}) => {
  return uploadAndManageImagesApi.get(endPoints.listImages, {
    params,
  });
};

export const deleteImageApi= async (params = {})=>{
  return uploadAndManageImagesApi.delete(endPoints.deleteImage,{
    params,
  });
};