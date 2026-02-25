import axios from 'axios';

const createAxiosInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
  });

  instance.interceptors.request.use(
    function (request) {
      const authToken = localStorage.getItem('accessToken');
      if (authToken) {
        request.headers.Authorization = `Bearer ${authToken}`;
      }
      request.headers['Cache-Control'] = 'no-cache';
      request.headers['Pragma'] = 'no-cache';
      return request;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

 instance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);


  return instance;
};

const baseURL = import.meta.env.VITE_API_BASE_URL ;
const imagesBaseURL = import.meta.env.VITE_IMAGES_API_BASE_URL;

const projectsApi = createAxiosInstance(baseURL);
const uploadAndManageImagesApi = createAxiosInstance(imagesBaseURL);
const teamApi=createAxiosInstance(baseURL);
const classApi=createAxiosInstance(baseURL);
const generate_pseudo_labelsApi=createAxiosInstance(baseURL)
const annotationsApi=createAxiosInstance(baseURL);
const exportApi=createAxiosInstance(baseURL)
export {
  projectsApi,
  uploadAndManageImagesApi,
  teamApi,
  classApi,
  generate_pseudo_labelsApi,
  annotationsApi,
  exportApi
};
