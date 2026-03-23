import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback
} from "react";

import {
  loadAnnotationApi,
  getCurrentImageIndexApi,
  currentImageIndexApi
} from "@/networking/annotations/annotationsapi";
import { listReviewerTasksApi } from "@/networking/review/reviewapi";
import { useToast } from "@/hooks/use-toast";
import { useProjectImages } from "@/context/ProjectImagesContext";
import { useProjects } from "@/context/ProjectContext";
import { useParams } from "react-router-dom";

const AnnotationImagesContext = createContext();

export const AnnotationImagesProvider = ({ children }) => {
  const [status, setStatus] = useState("");
  const { projectId } = useParams();

  const { selectedProject, setSelectedProject, projects } = useProjects();
  const { images = [], setImages = () => {} } = useProjectImages();
  const { showError } = useToast();

  /* ---------------- refs ---------------- */
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  /* ---------------- state ---------------- */
  const [selectedAnnotator, setSelectedAnnotator] = useState("");
  const [selectedReviewer, setSelectedReviewer] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [inputIndex, setInputIndex] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);

  const [boundingBoxes, setBoundingBoxes] = useState([]);
  const [labelPoints, setLabelPoints] = useState([]);

  /* ---------------- helpers ---------------- */
  const clearCanvasState = () => {
    setImages([]);
    setSelectedImage(null);
    setBoundingBoxes([]);
    setLabelPoints([]);
    setCurrentImageIndex(0);
  };

  /* ---------------- project sync ---------------- */
  useEffect(() => {
    if (!projectId || selectedProject?.id === projectId) return;

    const found = projects?.find(p => String(p.id) === String(projectId));
    if (found) setSelectedProject(found);
  }, [projectId, projects, selectedProject?.id]);

  /* ---------------- fetch reviewer tasks ---------------- */
  const fetchReviewerTasks = useCallback(async () => {
    if (!selectedProject?.id || !selectedReviewer) return;

    try {
      const memberId = selectedReviewer || selectedAnnotator;

      const res = await listReviewerTasksApi(
        selectedReviewer,
        selectedProject.id,
        status || "all",
        selectedAnnotator
      );

      const imgs = res?.data?.images || [];

      if (imgs.length === 0) {
        showError("No images available");
        clearCanvasState();
        return;
      }

      setImages(imgs);

      const idxRes = await getCurrentImageIndexApi(
        selectedProject.id,
        memberId
      );

      const backendIndex = idxRes?.data?.current_index || 1;
      const zeroIndex = Math.min(imgs.length - 1, backendIndex - 1);

      setCurrentImageIndex(zeroIndex);
      setInputIndex(zeroIndex + 1);
      setSelectedImage(imgs[zeroIndex]);

    } catch (err) {
      console.error("Assigned image fetch error", err);
      clearCanvasState();
    }
  }, [
    selectedProject?.id,
    selectedReviewer,
    selectedAnnotator,
    status
  ]);

  useEffect(() => {
    fetchReviewerTasks();
  }, [fetchReviewerTasks]);

  /* ---------------- fetch annotations ---------------- */
  const fetchAnnotations = useCallback(async (image) => {
    if (!selectedProject?.id || !image) return;

    try {
      const res = await loadAnnotationApi(selectedProject.id, image.id);
      const data = res.data || {};

      setLabelPoints(data.labels || []);

      setSelectedImage(prev => ({
        ...prev,
        status: data.status ?? null,
        rejection_comment: data.rejection_comment ?? ""
      }));

    } catch (err) {
      console.error("Annotation load failed", err);
    }
  }, [selectedProject?.id]);

  useEffect(() => {
    if (!selectedImage) return;

    setBoundingBoxes([]);
    fetchAnnotations(selectedImage);
  }, [selectedImage?.id, fetchAnnotations]);

  /* ---------------- label → box ---------------- */
  const labelToBox = (label, imgWidth, imgHeight) => {
    const coords = label.coordinates;
    const xs = [];
    const ys = [];

    for (let i = 0; i < coords.length; i += 2) {
      xs.push(coords[i] * imgWidth);
      ys.push(coords[i + 1] * imgHeight);
    }

    return {
      x: Math.min(...xs),
      y: Math.min(...ys),
      width: Math.max(...xs) - Math.min(...xs),
      height: Math.max(...ys) - Math.min(...ys),
      classId: label.id,
      color: label.color || "red"
    };
  };

  /* ---------------- convert labels to boxes ---------------- */
  useEffect(() => {
    if (!imageLoaded || !labelPoints?.length) return;

    const img = imageRef.current;
    if (!img) return;

    const boxes = labelPoints.map(label =>
      labelToBox(label, img.naturalWidth, img.naturalHeight)
    );

    setBoundingBoxes(boxes);
  }, [labelPoints, imageLoaded]);

  /* ---------------- auto select first image ---------------- */
  useEffect(() => {
    if (images.length > 0 && !selectedImage) {
      setSelectedImage(images[0]);
      setCurrentImageIndex(0);
    }
  }, [images, selectedImage]);

  /* ---------------- navigation ---------------- */
  const goToIndex = async (index) => {
    if (!images.length) return;

    const newIndex = Math.max(0, Math.min(images.length - 1, index));

    setCurrentImageIndex(newIndex);
    setSelectedImage(images[newIndex]);
    setInputIndex(newIndex + 1);

    try {
      await currentImageIndexApi({
        member_id: selectedReviewer || selectedAnnotator,
        project_id: selectedProject?.id,
        current_index: newIndex + 1
      });
    } catch (err) {
      console.error("Index update failed", err);
    }
  };

  const next = () => goToIndex(currentImageIndex + 1);
  const prev = () => goToIndex(currentImageIndex - 1);

  const handleIndexChange = () => {
    const num = Number(inputIndex);
    if (!num) return;
    goToIndex(num - 1);
  };

  /* ---------------- context value ---------------- */
  const value = {
    canvasRef,
    imageRef,

    images,
    selectedImage,
    currentImageIndex,
    inputIndex,
    imageLoaded,
    boundingBoxes,
    labelPoints,

    selectedAnnotator,
    selectedReviewer,
    status,

    setStatus,
    setSelectedAnnotator,
    setSelectedReviewer,
    setInputIndex,
    setImageLoaded,
    setBoundingBoxes,
    setLabelPoints,
    setSelectedImage,

    next,
    prev,
    goToIndex,
    handleIndexChange
  };

  return (
    <AnnotationImagesContext.Provider value={value}>
      {children}
    </AnnotationImagesContext.Provider>
  );
};

export const useAnnotationImages = () =>
  useContext(AnnotationImagesContext);