import { Button } from '@/components/ui/button';
import { Layout } from '@/components/common/layout';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import styles from './styles.module.css';
import {
  getMousePos as getMousePosUtil,
  getResizeHandle as getResizeHandleUtil,
} from '@/utils/annotation';

const Annotate = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const batchId = searchParams.get('batchId');
  const total = Number(searchParams.get('total')) || null;
  const done = Number(searchParams.get('done')) || null;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [drawMode, setDrawMode] = useState(false);
  const [selectedClass, setSelectedClass] = useState('Helmet');
  const [showDeleteClassModal, setShowDeleteClassModal] = useState(false);
  const [boundingBoxes, setBoundingBoxes] = useState([]);
  const [selectedBoxes, setSelectedBoxes] = useState(new Set());
  const [selectedBox, setSelectedBox] = useState(null); // For single box operations
  const [isDrawing, setIsDrawing] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [resizeHandle, setResizeHandle] = useState(null);
  const [ctrlPressed, setCtrlPressed] = useState(false);

  // History for undo/redo
  const [history, setHistory] = useState([]); // array of boundingBoxes snapshots
  const [redoStack, setRedoStack] = useState([]);

  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const deleteButtonRef = useRef(null); // { index, x, y, size } or null
  const [imageLoaded, setImageLoaded] = useState(false);

  // Sample image - using a placeholder that will work
  const sampleImageUrl =
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80';

  const images = [
    { id: 1, name: 'image_001.jpg', boxes: 3, confidence: 94 },
    { id: 2, name: 'image_002.jpg', boxes: 5, confidence: 87 },
    { id: 3, name: 'image_003.jpg', boxes: 2, confidence: 91 },
  ];

  const classes = [
    { name: 'Helmet', color: '#ef4444', count: 54 },
    { name: 'Person', color: '#06b6d4', count: 72 },
    { name: 'Vest', color: '#3b82f6', count: 31 },
  ];

  const currentImage = images[currentIndex];
  const selectedClassData =
    classes.find((c) => c.name === selectedClass) || classes[0];

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

  // -------------------------
  // Effects: redraw when boxes or mode changes
  // -------------------------
  useEffect(() => {
    if (imageLoaded) {
      drawCanvas();
    }
 
  }, [boundingBoxes, imageLoaded, selectedBoxes, selectedBox, drawMode, editMode]);

  // Handle Ctrl key pressed (for multi-select and draw)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Control' || e.key === 'Meta') {
        setCtrlPressed(true);
      }

      // Undo / Redo - unified keyboard handling
      // Note: use e.ctrlKey to support Cmd on Mac (Meta sometimes)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undo();
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      }

      // Ctrl+Shift+Z -> redo (some systems)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Z') {
        e.preventDefault();
        redo();
      }

      // Delete key handling
      if (e.key === 'Delete' && editMode && (selectedBoxes.size > 0 || selectedBox !== null)) {
        e.preventDefault();
        // push snapshot then delete
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
  }, [editMode, selectedBoxes, selectedBox, undo, redo, pushSnapshot]); // include deps

  // -------------------------
  // drawCanvas - renders image + boxes + delete button
  // -------------------------
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imageLoaded) return;

    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    canvas.width = img.naturalWidth || 800;
    canvas.height = img.naturalHeight || 600;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Reset delete button
    deleteButtonRef.current = null;

    // Draw bounding boxes
    boundingBoxes.forEach((box, index) => {
      const classData =
        classes.find((c) => c.name === box.className) || classes[0];
      const isSelected = selectedBoxes.has(index) || selectedBox === index;
      const isMultiSelected =
        selectedBoxes.size > 1 && selectedBoxes.has(index);

      ctx.strokeStyle = classData.color;
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.setLineDash([]);

      // Draw selection highlight if multi-selected
      if (isMultiSelected) {
        ctx.fillStyle = 'rgba(6, 182, 212, 0.1)';
        ctx.fillRect(box.x - 2, box.y - 2, box.width + 4, box.height + 4);
      }

      // Draw rectangle
      ctx.strokeRect(box.x, box.y, box.width, box.height);

      // Draw label background
      ctx.fillStyle = classData.color;
      ctx.fillRect(box.x, box.y - 20, Math.min(120, box.width), 20);

      // Draw label text
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Inter';
      ctx.fillText(`${box.className} ${box.confidence}%`, box.x + 5, box.y - 5);

      // Draw selection indicator for multi-select
      if (isMultiSelected) {
        ctx.fillStyle = '#06b6d4';
        ctx.fillRect(box.x - 6, box.y - 6, 12, 12);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px Inter';
        ctx.fillText('✓', box.x - 3, box.y + 4);
      }

      // Draw resize handles if selected (only for single box or first selected)
      if (
        isSelected &&
        editMode &&
        (selectedBoxes.size <= 1 || index === Array.from(selectedBoxes)[0])
      ) {
        ctx.fillStyle = classData.color;
        const handles = [
          { x: box.x, y: box.y }, // top-left
          { x: box.x + box.width, y: box.y }, // top-right
          { x: box.x, y: box.y + box.height }, // bottom-left
          { x: box.x + box.width, y: box.y + box.height }, // bottom-right
        ];
        handles.forEach((handle) => {
          ctx.fillRect(handle.x - 4, handle.y - 4, 8, 8);
        });
      }

      // Draw delete button when a single box is selected (top-right)
      if (isSelected && selectedBoxes.size <= 1 && editMode) {
        const btnSize = 20;
        const btnX = box.x + box.width + 8; // small offset
        const btnY = box.y - btnSize - 8;

        // Draw circular red button
        ctx.beginPath();
        ctx.fillStyle = '#ff4444';
        ctx.arc(btnX + btnSize / 2, btnY + btnSize / 2, btnSize / 2, 0, Math.PI * 2);
        ctx.fill();

        // Draw X
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px Inter';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('×', btnX + btnSize / 2, btnY + btnSize / 2);

        // Expose delete button position for click detection
        deleteButtonRef.current = {
          index,
          x: btnX,
          y: btnY,
          width: btnSize,
          height: btnSize,
        };
      }
    });

    // Draw current drawing box
    if (isDrawing && dragStart) {
      const currentX = dragStart.currentX;
      const currentY = dragStart.currentY;
      const startX = dragStart.startX;
      const startY = dragStart.startY;

      const x = Math.min(startX, currentX);
      const y = Math.min(startY, currentY);
      const width = Math.abs(currentX - startX);
      const height = Math.abs(currentY - startY);

      ctx.strokeStyle = selectedClassData.color;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(x, y, width, height);
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

    // If delete button is visible and clicked — handle it first
    if (deleteButtonRef.current) {
      const d = deleteButtonRef.current;
      if (
        pos.x >= d.x &&
        pos.x <= d.x + d.width &&
        pos.y >= d.y &&
        pos.y <= d.y + d.height
      ) {
        // push snapshot then delete
        pushSnapshot();
        deleteSelectedBoxes();
        drawCanvas();
        return;
      }
    }

    if (drawMode) {
      // Start drawing — snapshot current state for undo
      pushSnapshot();
      setIsDrawing(true);
      setDragStart({
        startX: pos.x,
        startY: pos.y,
        currentX: pos.x,
        currentY: pos.y,
      });
      return;
    }

    if (editMode) {
      // Check if clicking on resize handle (only for single selected box)
      if (selectedBoxes.size === 1 && selectedBox !== null) {
        const selectedIndex = Array.from(selectedBoxes)[0];
        const box = boundingBoxes[selectedIndex];
        const handle = getResizeHandle(pos.x, pos.y, box);
        if (handle) {
          // snapshot before user starts resizing
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

      // Check if clicking on existing box (topmost first)
      for (let i = boundingBoxes.length - 1; i >= 0; i--) {
        const box = boundingBoxes[i];
        if (
          pos.x >= box.x &&
          pos.x <= box.x + box.width &&
          pos.y >= box.y &&
          pos.y <= box.y + box.height
        ) {
          // snapshot before dragging
          pushSnapshot();

          if (ctrlPressed) {
            // Multi-select: toggle selection
            const newSelected = new Set(selectedBoxes);
            if (newSelected.has(i)) {
              newSelected.delete(i);
            } else {
              newSelected.add(i);
            }
            setSelectedBoxes(newSelected);
            setSelectedBox(newSelected.size === 1 ? Array.from(newSelected)[0] : null);

            // Prepare for dragging if at least one is selected
            if (newSelected.size > 0) {
              const firstIndex = Array.from(newSelected)[0];
              const firstBox = boundingBoxes[firstIndex];
              setDragStart({
                startX: pos.x,
                startY: pos.y,
                boxX: firstBox.x,
                boxY: firstBox.y,
                selectedBoxes: newSelected,
              });
            }
          } else {
            // Single select
            setSelectedBoxes(new Set([i]));
            setSelectedBox(i);
            setDragStart({
              startX: pos.x,
              startY: pos.y,
              boxX: box.x,
              boxY: box.y,
              selectedBoxes: new Set([i]),
            });
          }
          return;
        }
      }

      // Clicked on empty space
      if (!ctrlPressed) {
        setSelectedBoxes(new Set());
        setSelectedBox(null);
      }
    }
  };

  const handleMouseMove = (e) => {
    if (!imageLoaded) return;
    const pos = getMousePos(e);

    if (isDrawing && dragStart) {
      setDragStart({
        ...dragStart,
        currentX: pos.x,
        currentY: pos.y,
      });
      drawCanvas();
      return;
    }

    if (editMode && resizeHandle && dragStart && selectedBoxes.size === 1) {
      const selectedIndex = Array.from(selectedBoxes)[0];
      const box = boundingBoxes[selectedIndex];
      const deltaX = pos.x - dragStart.startX;
      const deltaY = pos.y - dragStart.startY;

      let newBox = { ...box };

      switch (resizeHandle) {
        case 'tl':
          newBox.x = Math.min(dragStart.boxX + dragStart.boxWidth, dragStart.boxX + deltaX);
          newBox.y = Math.min(dragStart.boxY + dragStart.boxHeight, dragStart.boxY + deltaY);
          newBox.width = dragStart.boxWidth - deltaX;
          newBox.height = dragStart.boxHeight - deltaY;
          break;
        case 'tr':
          newBox.y = Math.min(dragStart.boxY + dragStart.boxHeight, dragStart.boxY + deltaY);
          newBox.width = dragStart.boxWidth + deltaX;
          newBox.height = dragStart.boxHeight - deltaY;
          break;
        case 'bl':
          newBox.x = Math.min(dragStart.boxX + dragStart.boxWidth, dragStart.boxX + deltaX);
          newBox.width = dragStart.boxWidth - deltaX;
          newBox.height = dragStart.boxHeight + deltaY;
          break;
        case 'br':
          newBox.width = dragStart.boxWidth + deltaX;
          newBox.height = dragStart.boxHeight + deltaY;
          break;
      }

      if (newBox.width > 10 && newBox.height > 10) {
        const updatedBoxes = [...boundingBoxes];
        updatedBoxes[selectedIndex] = newBox;
        setBoundingBoxes(updatedBoxes);
      }
      return;
    }

    // Move multiple boxes
    if (
      editMode &&
      dragStart &&
      selectedBoxes.size > 0 &&
      !resizeHandle &&
      dragStart.selectedBoxes
    ) {
      const deltaX = pos.x - dragStart.startX;
      const deltaY = pos.y - dragStart.startY;

      const updatedBoxes = [...boundingBoxes];
      const firstBox = boundingBoxes[Array.from(selectedBoxes)[0]];
      const firstBoxOffsetX = firstBox.x - dragStart.boxX;
      const firstBoxOffsetY = firstBox.y - dragStart.boxY;

      selectedBoxes.forEach((index) => {
        const box = boundingBoxes[index];
        const relativeOffsetX = box.x - firstBox.x;
        const relativeOffsetY = box.y - firstBox.y;

        const newBox = {
          ...box,
          x: dragStart.boxX + deltaX + firstBoxOffsetX + relativeOffsetX,
          y: dragStart.boxY + deltaY + firstBoxOffsetY + relativeOffsetY,
        };

        // Keep box within canvas bounds
        newBox.x = Math.max(0, Math.min(newBox.x, canvasRef.current.width - newBox.width));
        newBox.y = Math.max(0, Math.min(newBox.y, canvasRef.current.height - newBox.height));

        updatedBoxes[index] = newBox;
      });

      setBoundingBoxes(updatedBoxes);
    } else if (editMode && dragStart && selectedBox !== null && !resizeHandle) {
      // Move single box (backward compatibility)
      const box = boundingBoxes[selectedBox];
      const deltaX = pos.x - dragStart.startX;
      const deltaY = pos.y - dragStart.startY;

      const newBox = {
        ...box,
        x: dragStart.boxX + deltaX,
        y: dragStart.boxY + deltaY,
      };

      // Keep box within canvas bounds
      newBox.x = Math.max(0, Math.min(newBox.x, canvasRef.current.width - newBox.width));
      newBox.y = Math.max(0, Math.min(newBox.y, canvasRef.current.height - newBox.height));

      const updatedBoxes = [...boundingBoxes];
      updatedBoxes[selectedBox] = newBox;
      setBoundingBoxes(updatedBoxes);
    }
  };

  const handleMouseUp = (e) => {
    if (isDrawing && dragStart) {
      const pos = getMousePos(e);
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
          className: selectedClass,
          confidence: 95,
          id: Date.now(),
        };
        setBoundingBoxes((prev) => [...prev, newBox]);

        // If Ctrl is pressed, stay in draw mode; otherwise exit
        if (!ctrlPressed) {
          setIsDrawing(false);
        }
      } else {
        setIsDrawing(false);
      }

      // Reset drag start for next box if Ctrl is held
      if (ctrlPressed) {
        setDragStart(null);
      } else {
        setIsDrawing(false);
        setDragStart(null);
      }
    } else {
      setResizeHandle(null);
      setDragStart(null);
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
      setSelectedBoxes(new Set());
      setSelectedBox(null);
    } else if (selectedBox !== null) {
      // Delete single box
      const updatedBoxes = boundingBoxes.filter((_, i) => i !== selectedBox);
      setBoundingBoxes(updatedBoxes);
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

  const handleImageLoad = () => {
    setImageLoaded(true);
    if (canvasRef.current && imageRef.current) {
      drawCanvas();
    }
  };

  return (
    <Layout
      pageTitle="Annotation Viewer"
      headerActions={
        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
          {(projectId || batchId) && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                marginRight: 'var(--spacing-md)',
              }}
            >
              {projectId && (
                <span
                  style={{
                    background: 'var(--color-background-tertiary)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '2px 8px',
                    fontSize: '12px',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  Project: {projectId}
                </span>
              )}
              {batchId && (
                <span
                  style={{
                    background: 'var(--color-background-tertiary)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '2px 8px',
                    fontSize: '12px',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  Batch: {batchId}
                </span>
              )}
              {total && done !== null && (
                <span
                  style={{
                    background: 'var(--color-primary-light)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '2px 8px',
                    fontSize: '12px',
                    color: 'var(--color-primary)',
                    border: '1px solid var(--color-primary)',
                  }}
                >
                  Progress: {done} / {total}
                </span>
              )}
            </div>
          )}
          <Button
            variant={drawMode ? 'primary' : 'secondary'}
            icon="fi-rr-pencil"
            onClick={() => {
              setDrawMode(!drawMode);
              setEditMode(false);
            }}
          >
            {drawMode ? 'Drawing' : 'Draw Mode'}
          </Button>
          <Button
            variant={editMode ? 'primary' : 'secondary'}
            icon="fi-rr-edit"
            onClick={() => {
              setEditMode(!editMode);
              setDrawMode(false);
            }}
          >
            {editMode ? 'Editing' : 'Edit Mode'}
          </Button>
          {(editMode || drawMode) && (
            <Button
              variant="primary"
              icon="fi-rr-disk"
              onClick={() => {
                console.log('Saving boxes:', boundingBoxes);
              }}
            >
              Save Changes
            </Button>
          )}
        </div>
      }
    >
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>Classes</h3>
            <div className={styles.classSelector}>
              {classes.map((cls) => (
                <button
                  key={cls.name}
                  className={`${styles.classItem} ${
                    selectedClass === cls.name ? styles.classItemActive : ''
                  }`}
                  onClick={() => setSelectedClass(cls.name)}
                  style={{ borderLeftColor: cls.color }}
                >
                  <div className={styles.classColor} style={{ background: cls.color }} />
                  <span className={styles.className}>{cls.name}</span>
                  <span className={styles.classCount}>{cls.count}</span>
                  <button
                    className={styles.deleteClassButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClass(cls.name);
                    }}
                    title="Delete class"
                  >
                    <i className="fi fi-rr-trash"></i>
                  </button>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>Image Info</h3>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Filename:</span>
              <span className={styles.infoValue}>{currentImage.name}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Objects:</span>
              <span className={styles.infoValue}>{boundingBoxes.length}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Confidence:</span>
              <span className={styles.infoValue}>{currentImage.confidence}%</span>
            </div>
          </div>

          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>Tools</h3>
            <div className={styles.toolInfo}>
              <p className={styles.toolText}>
                <strong>Draw Mode:</strong> Click and drag to create boxes
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

          <Button variant="danger" icon="fi-rr-trash" style={{ width: '100%' }}>
            Delete Image
          </Button>
        </div>

        <div className={styles.mainContent}>
          <div className={styles.canvas}>
            <div
              className={styles.canvasWrapper}
              data-mode={drawMode ? 'draw' : editMode ? 'edit' : 'view'}
            >
              <img
                ref={imageRef}
                src={sampleImageUrl}
                alt="Annotation target"
                className={styles.annotationImage}
                onLoad={handleImageLoad}
                style={{ display: 'none' }}
                crossOrigin="anonymous"
              />
              <canvas
                ref={canvasRef}
                className={styles.annotationCanvas}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              />
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
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
            >
              Previous
            </Button>

            <div className={styles.imageCounter}>
              {currentIndex + 1} / {images.length}
            </div>

            <Button
              variant="secondary"
              icon="fi-rr-angle-right"
              onClick={() => setCurrentIndex(Math.min(images.length - 1, currentIndex + 1))}
              disabled={currentIndex === images.length - 1}
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
