import * as endPoints from '@/networking/psuedo_labels/endpoints';
import { generate_pseudo_labelsApi } from '@/services/axios';



export const psuedo_labelsApi= async (data)=>{
    return generate_pseudo_labelsApi.post(endPoints.pseudo_labels,data)
}
