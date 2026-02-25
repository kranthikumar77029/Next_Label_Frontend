import * as endPoints from '@/networking/export/endpoints';
import { exportApi } from '@/services/axios';

export const exportapi = (payload) => {
  return exportApi.post(endPoints.exportdata, payload, {
    responseType: "blob",
  });
};
