import { Button } from '@/components/ui/button';
import { Layout } from '@/components/common/layout';
import { Dropdown } from '@/components/ui/dropdown';
import { useEffect, useRef, useState, useCallback,useMemo } from 'react';
import { loadAnnotationApi, saveAnnotationApi,listAssignedImagesApi,currentImageIndexApi,listSpecifiedImagesApi,getCurrentImageIndexApi} from '@/networking/annotations/annotationsapi';
import { deleteImageWithLabelApi } from '@/networking/upload/uploadapi';
import styles from './styles.module.css';
import {
  getMousePos as getMousePosUtil,
  getResizeHandle as getResizeHandleUtil,
} from '@/utils/annotation';
import { useProjectImages } from '@/context/ProjectImagesContext';
import { useProjects } from "@/context/ProjectContext";
import { useToast } from '@/hooks/use-toast';
import { useTeamMembers } from '@/context/TeamMembers';
import { useParams } from 'react-router-dom';

const Annotate = () => {
  // const [searchParams] = useSearchParams();
  const { projectId } = useParams();
  const { annotators } = useTeamMembers();
  const [selectedAnnotator, setSelectedAnnotator] = useState("");
  const [isEdit, setIsEdit] = useState(false); //For if any edit is there automatically save triggered
  const [zoom, setZoom] = useState(1);
  

  const scaleRef = useRef(1);
  const [labelPoints, setLabelPoints] = useState()
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedClassId, setSelectedClassId] = useState(null);
  // const [editMode, setEditMode] = useState(false);
  const [drawMode, setDrawMode] = useState(false);
  // const [selectedClass, setSelectedClass] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const [showDeleteClassModal, setShowDeleteClassModal] = useState(false);
  const [boundingBoxes, setBoundingBoxes] = useState([]);
  const [selectedBoxes, setSelectedBoxes] = useState(new Set());
  const [selectedBox, setSelectedBox] = useState(null); // For single box operations
  const [isDrawing, setIsDrawing] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [resizeHandle, setResizeHandle] = useState(null);
  const [ctrlPressed, setCtrlPressed] = useState(false);
  const { showSuccess, showError } = useToast();
  const { selectedProject, setSelectedProject, projects } = useProjects();
  // History for undo/redo
  const [history, setHistory] = useState([]); // array of boundingBoxes snapshots
  const [redoStack, setRedoStack] = useState([]);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const deleteButtonRef = useRef(null); // { index, x, y, size } or null
  const [imageLoaded, setImageLoaded] = useState(false);
  const { images, setImages,fetchImagesByProject } = useProjectImages();
  const storageKey = `imageIndex_${selectedProject?.id || "default"}`;
 
// const [currentImageIndex, setCurrentImageIndex] = useState(() => {
//   const saved = localStorage.getItem(storageKey);
//   return saved ? Number(saved) : 0;
// });
const [inputIndex, setInputIndex] = useState(1);


useEffect(() => {
  setInputIndex(currentImageIndex + 1);
}, [currentImageIndex]);


const updateIndex = async () => {
  if (!images.length) return; // prevent early call

  const payload = {
    member_id: selectedAnnotator,
    project_id: selectedProject?.id,
    current_index: currentImageIndex + 1 // convert to 1-based
  };

  try {
    await currentImageIndexApi(payload);
  } catch (err) {
    console.error("API Error:", err);
  }
};

useEffect(() => {
  if (!selectedAnnotator || !selectedProject?.id || !images.length) return;
  updateIndex();
}, [currentImageIndex]);



// useEffect(() => {
//   if (selectedProject?.id != null) {
//     localStorage.setItem(storageKey, currentImageIndex);
//   }
// }, [currentImageIndex, storageKey, selectedProject?.id]);


  // Sample image - using a placeholder that will work
  const sampleImageUrl =
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80';

 const classes = useMemo(() => {
  return selectedProject?.classes.map(cls => ({
    id: cls.id,
    name: cls.class_name,
    color: cls.color,
  })) || [];
}, [selectedProject?.id]);

  const selectedClassData =
    classes.find((c) => c.id === selectedClassId) || classes[0];

const handleSave = async () => {
  const canvas = canvasRef.current;
  if (!canvas) return false;

  const formattedLabels = boundingBoxes
    .map((box) => {
      const points = boxToPoints(box);
      const normalized = normalizePoints(points, canvas.width, canvas.height);

      const classObj =
        classes.find(c => c.id === box.classId) ||
        classes.find(c => c.name === box.className);

      if (!classObj) return null;

      return {
        id: classObj.id,
        name: classObj.name,
        color: classObj.color,
        coordinates: [
          normalized[0].x, normalized[0].y,
          normalized[1].x, normalized[1].y,
          normalized[2].x, normalized[2].y,
          normalized[3].x, normalized[3].y
        ]
      };
    })
    .filter(Boolean);

  const payload = {
    project_id: selectedProject.id,
    image_id: selectedImage.id,
    image_name: selectedImage.filename,
    image_url: selectedImage.image_url,
    labels: formattedLabels
  };

  try {
    const response = await saveAnnotationApi(payload);

    if (response?.status === 200) {
      showSuccess("Annotations Saved Successfully");
      setLabelPoints(formattedLabels);
      setHistory([boundingBoxes.map(b => ({ ...b }))]);
      setRedoStack([]);
      setIsEdit(false);

      return true; 
    } else {
     showError(error.detail);
      return false;
    }
  } catch (err) {
   showError(err.detail);
    return false;
  }
};

useEffect(() => {
  setIsEdit(false);
}, [selectedImage]);
 
   const handleDelete = async (img) => {
      const confirmDelete = confirm("Are you sure you want to delete this image?");
      if (!confirmDelete) return;
  
      const payload = {
        filename: selectedImage.filename,
        project_title: selectedProject,
        project_id: selectedProject?.id,
      };
  
      try {
        await deleteImageWithLabelApi(payload);
        showSuccess("Image deleted successfully");
        setSelectedImage(null)
  
       
  
      } catch (error) {
        showError(
          error?.response?.data?.message || "Failed to delete image"
        );
      }
    };
   const setupCanvas = () => {
  const canvas = canvasRef.current;
  const img = imageRef.current;
  if (!canvas || !img) return;

  const wrapper = canvas.parentElement;

  // Fit image inside container
  const scaleX = wrapper.clientWidth / img.naturalWidth;
  const scaleY = wrapper.clientHeight / img.naturalHeight;
  const baseScale = Math.min(scaleX, scaleY);

  // Apply zoom multiplier
  const finalScale = baseScale * zoom;

  scaleRef.current = finalScale;

  // Canvas internal resolution (actual drawing pixels)
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  // Display size (visual zoomed size)
  canvas.style.width = `${img.naturalWidth * finalScale}px`;
  canvas.style.height = `${img.naturalHeight * finalScale}px`;

  drawCanvas();
   };

    const zoomIn = () => setZoom(z => Math.min(z + 0.1, 5));
    const zoomOut = () => setZoom(z => Math.max(z - 0.1, 0.2));
    const resetZoom = () => {
      setZoom(1);
    };


  // -------------------------
  // History helpers
  // -------------------------
  const pushSnapshot = useCallback(() => {
    // push a deep-ish copy of current boundingBoxes to history and clear redo
    setHistory((prev) => [...prev, boundingBoxes.map((b) => ({ ...b }))]);
    setRedoStack([]);
  }, [boundingBoxes]);

  const undo = useCallback(() => {
    setHistory((h) => {
      if (h.length === 0) return h;
      const previous = h[h.length - 1];
      setRedoStack((r) => [boundingBoxes.map((b) => ({ ...b })), ...r]);
      setBoundingBoxes(previous.map((b) => ({ ...b })));
      // clear selection after undo
      setSelectedBoxes(new Set());
      setSelectedBox(null);
      return h.slice(0, -1);
    });
  }, [boundingBoxes]);

  const redo = useCallback(() => {
    setRedoStack((r) => {
      if (r.length === 0) return r;
      const next = r[0];
      setHistory((h) => [...h, boundingBoxes.map((b) => ({ ...b }))]);
      setBoundingBoxes(next.map((b) => ({ ...b })));
      // clear selection after redo
      setSelectedBoxes(new Set());
      setSelectedBox(null);
      return r.slice(1);
    });
  }, [boundingBoxes]);

  const boxToPoints = (box) => {
    return [
      { x: box.x, y: box.y },                               // TL
      { x: box.x + box.width, y: box.y },                   // TR
      { x: box.x + box.width, y: box.y + box.height },      // BR
      { x: box.x, y: box.y + box.height },                  // BL
    ];
  };
  const normalizePoints = (points, canvasWidth, canvasHeight) =>

    points.map(p => ({
      x: p.x / canvasWidth,
      y: p.y / canvasHeight,
    }));


    useEffect(() => {
  if (!projectId || selectedProject?.id === projectId) return;

  const found = projects?.find(p => String(p.id) === String(projectId));

  if (found) {
    setSelectedProject(found);
  }
}, [projectId, projects]);
 //For assigned images using project_id and annotator_id   
useEffect(() => {
  if (!selectedProject?.id || !selectedAnnotator) return;

  fetchAssignedImages();
}, [selectedProject?.id, selectedAnnotator]);


   // load images on project selection 
useEffect(() => {
  if (!selectedProject?.id) return;

  // reset viewer state
  setSelectedImage(null);
  setImageLoaded(false);
  setBoundingBoxes([]);
  setLabelPoints([]);

  // treat empty annotator as "all"
  if (!selectedAnnotator || selectedAnnotator === "all") {
    fetchImagesByProject(selectedProject.id);
  } else {
    fetchImagesByProject(selectedProject.id, selectedAnnotator);
  }

}, [selectedProject?.id, selectedAnnotator]);

 

  //Automatically select a default class when the project changes.
  useEffect(() => {
    if (classes.length > 0) {
      setSelectedClassId(classes[0].id);
    }
  }, [selectedProject?.id]);
  //Whenever the project or image changes, reset the canvas state and load annotations for the new image.
   useEffect(() => {
    if (!selectedProject?.id || !selectedImage) return;

    setBoundingBoxes([]);
    setSelectedBoxes(new Set());
    setSelectedBox(null);
    fetchAnnotations(selectedImage);
  }, [selectedImage?.filename, selectedProject?.id]);

  const fetchAnnotations = async () => {
    try {
      const res = await loadAnnotationApi(
        selectedProject.id,
        selectedImage.id
      );
      if (res.status === 200) {
         
        // showSuccess("Annotations load Successfully")
        const labelPoints = res.data?.labels || [];
       
        setLabelPoints(labelPoints);
      }
    } catch (err) {
       showError(err?.response?.data?.detail || "Failed to load Annotations");
    }
  };
  //fetcth assigned Images
const fetchAssignedImages = async () => {
  if (!selectedProject?.id || !selectedAnnotator) return;

  try {
    const res = await listAssignedImagesApi(
      selectedProject.id,
      selectedAnnotator
    );

    if (res.status === 200) {
      const imgs = res.data.images || [];

      setImages(imgs);

      // get backend index
      const idxRes = await getCurrentImageIndexApi(
        selectedProject.id,
        selectedAnnotator
      );

      const backendIndex = idxRes.data?.current_index || 1;

      // convert to 0-based
      const zeroIndex = backendIndex - 1;

      setCurrentImageIndex(zeroIndex);
      setInputIndex(backendIndex);

      // set selected image
      setSelectedImage(imgs[zeroIndex] || imgs[0] || null);

      setBoundingBoxes([]);
      setLabelPoints([]);
    }
  } catch (err) {
      showError(err?.response?.data?.detail || "Failed to Fetch Images");
  }
};

// const fetchSpecifiedImages = async () => {
//   if (!selectedProject?.id) return;

//   const memberParam = selectedAnnotator || "all";

//   const res = await listSpecifiedImagesApi({
//     member_id: memberParam,
//     project_id: selectedProject.id,
//     start_index: currentIndex
//   });

//   if (res.status === 200) {
//     setImages(res.data.images);
//     setNextIndex(res.data.next_index);
//   }
// };
// useEffect(() => {
//   fetchSpecifiedImages();
// }, [selectedAnnotator, selectedProject]);


  // -------------------------
  // Effects: redraw when boxes or mode changes
  // -------------------------
  useEffect(() => {
    if (imageLoaded && selectedImage) {
    setupCanvas();
  }

  }, [boundingBoxes, imageLoaded, selectedBoxes, selectedBox, drawMode,zoom]);

  // Handle Ctrl key pressed (for multi-select and draw)
useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === 'Control' || e.key === 'Meta') {
      setCtrlPressed(true);
    }

    // Undo
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      undo();
    }

    // Redo
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
      e.preventDefault();
      redo();
    }

    // Ctrl+Shift+Z → Redo
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Z') {
      e.preventDefault();
      redo();
    }

    // Delete selected boxes
    if (
      e.key === 'Delete' &&
      !drawMode &&
      (selectedBoxes.size > 0 || selectedBox !== null)
    ) {
      e.preventDefault();
      pushSnapshot();
      deleteSelectedBoxes();
    }
  };

  const handleKeyUp = (e) => {
    if (e.key === 'Control' || e.key === 'Meta') {
      setCtrlPressed(false);
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
  };
}, [drawMode, selectedBoxes, selectedBox, undo, redo, pushSnapshot]);

 //Convert annotations from the backend format into drawable bounding boxes once the image is ready.
 useEffect(() => {
  if (!imageLoaded || !labelPoints?.length) return;

  const img = imageRef.current;
  if (!img) return;

  const boxes = labelPoints.map(label =>
    labelToBox(
      label,
      img.naturalWidth,
      img.naturalHeight,
      classes
    )
  );

  setBoundingBoxes(boxes);
}, [labelPoints, imageLoaded, classes]);

 
  //clear canvas when image deleted 
  useEffect(() => {
  if (!selectedImage && canvasRef.current) {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height); 

    setImageLoaded(false);
    deleteButtonRef.current = null;
  }
}, [selectedImage]);
 //auto-selecting the first image when images load
  useEffect(() => {
    if (images.length > 0 && !selectedImage) {
      setCurrentImageIndex(0);
      setSelectedImage(images[0]);
    }
  }, [images]);
 
//for Shift key functionality
useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === "Shift" && !e.repeat) {
      setDrawMode(prev => !prev); // 🔥 toggle
      setEditMode(false);
    }
  };

  document.addEventListener("keydown", handleKeyDown);

  return () => {
    document.removeEventListener("keydown", handleKeyDown);
  };
}, []);

 const labelToBox = (label, imgWidth, imgHeight, classes) => {
  const coords = label.coordinates; //use coordinates directly

  const xs = [];
  const ys = [];

  for (let i = 0; i < coords.length; i += 2) {
    xs.push(coords[i] * imgWidth);
    ys.push(coords[i + 1] * imgHeight);
  }

  const xMin = Math.min(...xs);
  const yMin = Math.min(...ys);
  const xMax = Math.max(...xs);
  const yMax = Math.max(...ys);

  const cls =
    classes.find(c => c.id === label.id || c.name === label.name) ||
    classes[0];

  return {
    x: xMin,
    y: yMin,
    width: xMax - xMin,
    height: yMax - yMin,
    classId: label.id,
    // className: cls.name,
    color: label.color,
    // confidence: 100
  };
};

  // -------------------------
  // drawCanvas - renders image + boxes + delete button
  // -------------------------
const drawCanvas = () => {
  const canvas = canvasRef.current;
  const img = imageRef.current;

  if (!canvas || !img || !imageLoaded) return;

  const ctx = canvas.getContext('2d');

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw image
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  deleteButtonRef.current = null;

  boundingBoxes.forEach((box, index) => {
    const classData =
      classes.find(c => c.name === box.className) || classes[0];

    const isSelected = selectedBoxes.has(index) || selectedBox === index;
    const isMultiSelected =
      selectedBoxes.size > 1 && selectedBoxes.has(index);

    // Box
    ctx.strokeStyle = classData.color;
    ctx.lineWidth = 1;
    ctx.setLineDash([]);

    if (isMultiSelected) {
      ctx.fillStyle = 'rgba(6, 182, 212, 0.1)';
      ctx.fillRect(
        box.x - 2,
        box.y - 2,
        box.width + 4,
        box.height + 4
      );
    }

    ctx.strokeRect(box.x, box.y, box.width, box.height);

    // Label
    ctx.fillStyle = classData.color;
    // ctx.fillRect(
    //   box.x,
    //   box.y - 20,
    //   Math.min(140, box.width),
    //   20
    // );

    ctx.fillStyle = '#fff';
    ctx.font = '12px Inter';
    // ctx.fillText(
    //   `${box.className} ${box.confidence ?? 0}%`,
    //   box.x + 5,
    //   box.y - 5
    // );

    // Resize handles
          if (
        isSelected &&
        !drawMode &&
        (selectedBoxes.size <= 1 ||
          index === [...selectedBoxes][0])
      )
      {
      ctx.fillStyle = classData.color;

      [
        [box.x, box.y],
        [box.x + box.width, box.y],
        [box.x, box.y + box.height],
        [box.x + box.width, box.y + box.height],
      ].forEach(([x, y]) => {
        ctx.fillRect(x - 4, y - 4, 8, 8);
      });
    }

    // Delete button (single selected box)
   if (isSelected && selectedBoxes.size <= 1 && !drawMode) {
      const btnSize = 20;
      const btnX = box.x + box.width + 8;
      const btnY = box.y - btnSize - 8;

      ctx.beginPath();
      ctx.fillStyle = '#f3e4e4';
      ctx.arc(
        btnX + btnSize / 2,
        btnY + btnSize / 2,
        btnSize / 2,
        0,
        Math.PI * 2
      );
      ctx.fill();

      ctx.fillStyle = '#111';
      ctx.font = 'bold 12px Inter';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        '×',
        btnX + btnSize / 2,
        btnY + btnSize / 2
      );

      deleteButtonRef.current = {
        index,
        x: btnX,
        y: btnY,
        width: btnSize,
        height: btnSize,
      };
    }
  });

  // Drawing preview
  if (isDrawing && dragStart) {
    const x = Math.min(dragStart.startX, dragStart.currentX);
    const y = Math.min(dragStart.startY, dragStart.currentY);
    const w = Math.abs(dragStart.currentX - dragStart.startX);
    const h = Math.abs(dragStart.currentY - dragStart.startY);

    ctx.strokeStyle = selectedClassData.color;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(x, y, w, h);
    ctx.setLineDash([]);
  }
};

  const getMousePos = (e) => getMousePosUtil(canvasRef.current, e);
  const getResizeHandle = (x, y, box) => getResizeHandleUtil(x, y, box);

  // -------------------------
  // Mouse handlers
  // -------------------------
const handleMouseDown = (e) => {
  if (!imageLoaded) return;
  const pos = getMousePos(e);

  /* ---------- DELETE BUTTON ---------- */
  if (deleteButtonRef.current) {
    const d = deleteButtonRef.current;
    if (
      pos.x >= d.x &&
      pos.x <= d.x + d.width &&
      pos.y >= d.y &&
      pos.y <= d.y + d.height
    ) {
      pushSnapshot();
      deleteSelectedBoxes();
      drawCanvas();
      return;
    }
  }

  /* ---------- DRAW MODE ---------- */
  if (drawMode) {
    if (!selectedClassData) {
      showError("No class selected");
      return;
    }

    pushSnapshot();
    setIsDrawing(true);

    setDragStart({
      startX: pos.x,
      startY: pos.y,
      currentX: pos.x,
      currentY: pos.y,
      classId: selectedClassData.id,
      className: selectedClassData.name,
      color: selectedClassData.color,
    });

    return;
  }

  /* ---------- SELECTION / EDIT MODE (AUTO) ---------- */

  // check resize handle
  if (selectedBoxes.size === 1 && selectedBox !== null) {
    const selectedIndex = Array.from(selectedBoxes)[0];
    const box = boundingBoxes[selectedIndex];
    const handle = getResizeHandle(pos.x, pos.y, box);

    if (handle) {
      pushSnapshot();
      setResizeHandle(handle);

      setDragStart({
        startX: pos.x,
        startY: pos.y,
        boxX: box.x,
        boxY: box.y,
        boxWidth: box.width,
        boxHeight: box.height,
      });

      return;
    }
  }

  // click existing box (topmost first)
  for (let i = boundingBoxes.length - 1; i >= 0; i--) {
    const box = boundingBoxes[i];

    if (
      pos.x >= box.x &&
      pos.x <= box.x + box.width &&
      pos.y >= box.y &&
      pos.y <= box.y + box.height
    ) {
      if (ctrlPressed) {
        const newSelected = new Set(selectedBoxes);

        if (newSelected.has(i)) newSelected.delete(i);
        else newSelected.add(i);

        setSelectedBoxes(newSelected);
        setSelectedBox(newSelected.size === 1 ? [...newSelected][0] : null);
      } else {
        setSelectedBoxes(new Set([i]));
        setSelectedBox(i);
      }

      const selectedIndex = ctrlPressed
        ? [...selectedBoxes][0]
        : i;

      const selectedBoxObj = boundingBoxes[selectedIndex];

      setDragStart({
        startX: pos.x,
        startY: pos.y,
        boxX: selectedBoxObj.x,
        boxY: selectedBoxObj.y,
        selectedBoxes: new Set([selectedIndex]),
      });

      return;
    }
  }

  // clicked empty space → deselect
  setSelectedBoxes(new Set());
  setSelectedBox(null);
};


const handleMouseMove = (e) => {
  if (!imageLoaded) return;
  const pos = getMousePos(e);

  /* ---------- DRAWING ---------- */
  if (isDrawing && dragStart) {
    setDragStart(prev => ({
      ...prev,
      currentX: pos.x,
      currentY: pos.y
    }));
    drawCanvas();
    return;
  }

  /* ---------- RESIZE ---------- */
  if (resizeHandle && dragStart && selectedBoxes.size === 1) {
    const selectedIndex = [...selectedBoxes][0];
    const box = boundingBoxes[selectedIndex];

    const deltaX = pos.x - dragStart.startX;
    const deltaY = pos.y - dragStart.startY;

    let newBox = { ...box };

    switch (resizeHandle) {
      case "tl":
        newBox.x = Math.min(dragStart.boxX + dragStart.boxWidth, dragStart.boxX + deltaX);
        newBox.y = Math.min(dragStart.boxY + dragStart.boxHeight, dragStart.boxY + deltaY);
        newBox.width = dragStart.boxWidth - deltaX;
        newBox.height = dragStart.boxHeight - deltaY;
        break;

      case "tr":
        newBox.y = Math.min(dragStart.boxY + dragStart.boxHeight, dragStart.boxY + deltaY);
        newBox.width = dragStart.boxWidth + deltaX;
        newBox.height = dragStart.boxHeight - deltaY;
        break;

      case "bl":
        newBox.x = Math.min(dragStart.boxX + dragStart.boxWidth, dragStart.boxX + deltaX);
        newBox.width = dragStart.boxWidth - deltaX;
        newBox.height = dragStart.boxHeight + deltaY;
        break;

      case "br":
        newBox.width = dragStart.boxWidth + deltaX;
        newBox.height = dragStart.boxHeight + deltaY;
        break;
    }

    if (newBox.width > 10 && newBox.height > 10) {
      const updated = [...boundingBoxes];
      updated[selectedIndex] = newBox;
      setBoundingBoxes(updated);
      setIsEdit(true);
    }
    return;
  }

  /* ---------- MOVE MULTIPLE ---------- */
  if ( dragStart && selectedBoxes.size > 0 && !resizeHandle) {
    const deltaX = pos.x - dragStart.startX;
    const deltaY = pos.y - dragStart.startY;

    const updated = [...boundingBoxes];
    const firstIndex = [...selectedBoxes][0];
    const firstBox = boundingBoxes[firstIndex];

    selectedBoxes.forEach(index => {
      const box = boundingBoxes[index];

      updated[index] = {
        ...box,
        x: Math.max(
          0,
          Math.min(
            dragStart.boxX + deltaX + (box.x - firstBox.x),
            canvasRef.current.width - box.width
          )
        ),
        y: Math.max(
          0,
          Math.min(
            dragStart.boxY + deltaY + (box.y - firstBox.y),
            canvasRef.current.height - box.height
          )
        )
      };
    });

    setBoundingBoxes(updated);
    setIsEdit(true);
  }
};


 const handleMouseUp = (e) => {
  const pos = getMousePos(e);

  /* ---------- FINISH DRAW ---------- */
  if (isDrawing && dragStart) {
    const startX = dragStart.startX;
    const startY = dragStart.startY;

    const x = Math.min(startX, pos.x);
    const y = Math.min(startY, pos.y);
    const width = Math.abs(pos.x - startX);
    const height = Math.abs(pos.y - startY);

    if (width > 10 && height > 10) {
      const newBox = {
        x,
        y,
        width,
        height,
        classId: dragStart.classId,
        className: dragStart.className,
        color: dragStart.color,
      };

      setBoundingBoxes(prev => [...prev, newBox]);
      setIsEdit(true)
    }

    // allow continuous drawing with CTRL
    if (!ctrlPressed) {
      setIsDrawing(false);
    }
  }

  /* ---------- FINISH EDIT / MOVE / RESIZE ---------- */
  setResizeHandle(null);
  setDragStart(null);
};

const handleIndexChange = async () => {
  let num = Number(inputIndex);

  if (isNaN(num) || images.length === 0) return;

  const clamped = Math.min(images.length, Math.max(1, num));
  console.log("clamped",clamped);
  const newIndex = clamped-1;
  console.log("num",num)
  console.log("index",newIndex)
  // prevent unnecessary API call
  if (newIndex === currentImageIndex) return;

  if (isEdit) {
    const saved = await handleSave();
    if (!saved) return;
  }

  try {
    setImageLoaded(false);

    const res = await listSpecifiedImagesApi(
      selectedAnnotator || "all",
      selectedProject.id,
      newIndex +1
    );

    const data = res.data;

    // update list
    setImages(data.images);

    // backend index (safe fallback)
 

  setCurrentImageIndex(newIndex);


    const selected =
  data.images[newIndex] || data.images[0];

setSelectedImage(selected);
setInputIndex(newIndex + 1);


  } catch (err) {
    console.error("Index fetch failed", err);
  }
};




  // -------------------------
  // Delete helpers
  // -------------------------
  const deleteSelectedBoxes = useCallback(() => {
    if (selectedBoxes.size > 0) {
      // Delete multiple boxes
      const indicesToDelete = Array.from(selectedBoxes);
      const updatedBoxes = boundingBoxes.filter((_, i) => !indicesToDelete.includes(i));
      setBoundingBoxes(updatedBoxes);
      setIsEdit(true);
      setSelectedBoxes(new Set());
      setSelectedBox(null);
    } else if (selectedBox !== null) {
      // Delete single box
      const updatedBoxes = boundingBoxes.filter((_, i) => i !== selectedBox);
      setBoundingBoxes(updatedBoxes);
      setIsEdit(true);
      setSelectedBox(null);
    }
  }, [boundingBoxes, selectedBoxes, selectedBox]);

  const handleDeleteClass = (className) => {
    setSelectedClass(className);
    setShowDeleteClassModal(true);
  };

  const confirmDeleteClass = () => {
    pushSnapshot();
    setBoundingBoxes(boundingBoxes.filter((box) => box.className !== selectedClass));
    setShowDeleteClassModal(false);
    setSelectedClass(null);
  };
  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      const newIndex = currentImageIndex - 1;
      setCurrentImageIndex(newIndex);
      setImageLoaded(false);
      setSelectedImage(images[newIndex]);
    }
  };

  const handleNextImage = () => {
    if (currentImageIndex < images.length - 1) {
      const newIndex = currentImageIndex + 1;
      setCurrentImageIndex(newIndex);
      setImageLoaded(false);
      setSelectedImage(images[newIndex]);
    }
  };

  const handleNextClick = async () => {
  if (isEdit) {
    const saved = await handleSave();
    if (!saved) return;
  }

  handleNextImage();
};

const handlePrevClick = async () => {
  if (isEdit) {
    const saved = await handleSave();
    if (!saved) return;
  }

  handlePrevImage();
};


  return (
    <Layout
      pageTitle="Annotation Viewer"
      headerActions={
        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
          <Button
            variant={drawMode ? 'primary' : 'secondary'}
            icon="fi-rr-pencil"
          >
            {drawMode ? 'Drawing (Shift Held)' : 'Hold Shift to Draw'}
          </Button>
        </div>
      }
    >
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <div className={styles.sidebarSection}>
        <Dropdown
          label="Annotator"
          placeholder="Select Annotator"
          value={selectedAnnotator ?? "all"}
          options={[
            { label: "All", value: "all" },
            ...annotators.map(a => ({
              label: a.name,
              value: a.id
            }))
          ]}
          onChange={(value) => {
            console.log("Selected Annotator ID:", value);
            setSelectedAnnotator(value);
          }}
        />



        <h3 className={styles.sidebarTitle}>Classes</h3>
            <div className={styles.classSelector}>
              {classes.map((cls) => {
                const isActive = selectedClassId === cls.id;

                return (
                  <div
                    key={cls.id}
                    className={`${styles.classItem} ${isActive ? styles.classItemActive : ''
                      }`}
                    onClick={() => setSelectedClassId(cls.id)}
                    style={{ borderLeftColor: cls.color }}
                  >
                    <div
                      className={styles.classColor}
                      style={{ backgroundColor: cls.color }}
                    />

                    <span className={styles.className}>{cls.name}</span>

                    <button
                      className={styles.deleteClassButton}
                      onClick={(e) => {
                        e.stopPropagation(); // prevent selecting class
                        handleDeleteClass(cls.id);
                      }}
                      title="Delete class"
                    >
                      <i className="fi fi-rr-trash"></i>
                    </button>
                  </div>
                );
              })}
            </div>

          </div>

          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>Image Info</h3>
            {selectedImage && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Imagename:</span>
                <span className={styles.infoValue}>{selectedImage.filename}</span>
              </div>
            )}

            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Objects:</span>
              <span className={styles.infoValue}>{boundingBoxes.length}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Confidence:</span>
              {/* <span className={styles.infoValue}>{currentImage.confidence}%</span> */}
            </div>
          </div>

          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>Tools</h3>
            <div className={styles.toolInfo}>
              <p className={styles.toolText}>
                <strong>Draw Mode:</strong> Hold Shift Button then drag to create boxes
              </p>
              <p className={styles.toolText}>
                <i className="fi fi-rr-info" style={{ marginRight: '4px' }}></i>
                <strong>Ctrl + Draw:</strong> Draw multiple boxes continuously
              </p>
              <p className={styles.toolText}>
                <strong>Edit Mode:</strong> Click boxes to select
              </p>
              <p className={styles.toolText}>
                <i className="fi fi-rr-info" style={{ marginRight: '4px' }}></i>
                <strong>Ctrl + Click:</strong> Multi-select boxes
              </p>
              <p className={styles.toolText}>
                <strong>Drag:</strong> Move selected boxes
              </p>
              <p className={styles.toolText}>
                <strong>Resize:</strong> Drag corners (single box only)
              </p>
              <p className={styles.toolText}>
                <strong>Delete:</strong> Press Delete key (works with multiple) or click the red × on a selected box
              </p>
              <p className={styles.toolText}>
                <strong>Undo / Redo:</strong> Ctrl+Z / Ctrl+Y (or Ctrl+Shift+Z)
              </p>
            </div>
          </div>

          {selectedBoxes.size > 1 && (
            <div className={styles.sidebarSection}>
              <div className={styles.multiSelectInfo}>
                <i className="fi fi-rr-check-circle" style={{ color: 'var(--color-primary)' }}></i>
                <span>{selectedBoxes.size} boxes selected</span>
                <Button
                  variant="danger"
                  size="small"
                  icon="fi-rr-trash"
                  onClick={() => {
                    pushSnapshot();
                    deleteSelectedBoxes();
                  }}
                  style={{ marginTop: 'var(--spacing-sm)' }}
                >
                  Delete Selected
                </Button>
              </div>
            </div>
          )}

          <Button variant="danger" icon="fi-rr-trash" onClick={handleDelete} style={{ width: '100%' }}>
            Delete Image
          </Button>
        </div>
        <div className={styles.mainContent}>
          <div className={styles.canvas}>
            <div
              className={styles.canvasWrapper}
              data-mode={drawMode ? "draw": selectedBoxes.size > 0 ? "edit": "view"}

            >
              <img
                ref={imageRef}
                src={selectedImage?.url}
                // crossOrigin="anonymous"
                onLoad={()=>setImageLoaded(true)}
                style={{ display: 'none' }}
              />

              <div className={styles.canvasStage}>
              <canvas
                ref={canvasRef}
                className={styles.annotationCanvas}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              />
               <div className={styles.zoomControls}>
                <button onClick={zoomIn}>+</button>
                <button onClick={zoomOut}>−</button>
                <button onClick={resetZoom}>
                <i className="fi fi-rr-refresh"></i>
                </button>

               </div>
              </div>
              {!imageLoaded && (
                <div className={styles.imageLoader}>
                  <i className="fi fi-rr-picture" style={{ fontSize: '48px' }}></i>
                  <p>Loading image...</p>
                </div>
              )}
            </div>
          </div>

          <div className={styles.navigation}>
        <Button
          variant="secondary"
          icon="fi-rr-angle-left"
          onClick={handlePrevClick}
          disabled={currentImageIndex === 0}
        >
          Previous
        </Button>


            {images.length > 0 && (
        <div className={styles.imageCounter}>
          <input
            type="number"
            min={1}
            max={images.length}
            value={inputIndex}
            onChange={(e) => setInputIndex(e.target.value)}
            onBlur={handleIndexChange}
            onKeyDown={(e) => e.key === "Enter" && handleIndexChange()}
            className={styles.indexInput}
          />
          <span> / {images.length}</span>
        </div>
      )}


        <Button
          variant="secondary"
          icon="fi-rr-angle-right"
          onClick={handleNextClick}
          disabled={currentImageIndex === images.length - 1}
        >
          Next
        </Button>

        </div>
       </div>
      </div>
      {showDeleteClassModal && (
        <div className={styles.modal} onClick={() => setShowDeleteClassModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Delete Class</h2>
              <button className={styles.closeButton} onClick={() => setShowDeleteClassModal(false)}>
                <i className="fi fi-rr-cross"></i>
              </button>
            </div>

            <p className={styles.deleteMessage}>
              Are you sure you want to delete the class <strong>{selectedClass}</strong>? This will remove all annotations with this class.
            </p>

            <div className={styles.modalActions}>
              <Button variant="secondary" type="button" onClick={() => setShowDeleteClassModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" type="button" onClick={confirmDeleteClass} icon="fi-rr-trash">
                Delete Class
              </Button>
            </div>
          </div>
        </div>
      )}
     
    </Layout>
  );
};

export default Annotate;
