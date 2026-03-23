import { useEffect, useState } from "react";
import { Layout } from "@/components/common/layout";
import { Button } from "@/components/ui/button";
// import { listMembersApi } from "@/networking/team_dashboard/teamapi";
// import { listReviewerTasksApi } from "@/networking/review/reviewapi";
import { reviewImageStatusApi,approveAllImagesApi } from "@/networking/review/reviewapi";
import { useTeamMembers } from '@/context/TeamMembers';
import { useProjects } from '@/context/ProjectContext';
import { useToast } from '@/hooks/use-toast';
import { useAnnotationImages } from "@/context/AnnotationImagesContext";
import styles from "./styles.module.css";

const Review = () => {
  const {
    canvasRef,
    imageRef,
    images,
    selectedImage,
    currentImageIndex,
    inputIndex,
    imageLoaded,
    boundingBoxes,
    selectedAnnotator,
    selectedReviewer,
    status,
    setStatus,

    setSelectedReviewer,
    setSelectedAnnotator,
    setInputIndex,
    setImageLoaded,
    setSelectedImage,
    next,
    prev,
    handleIndexChange
  } = useAnnotationImages();

  const {reviewers,annotators} =useTeamMembers();
    const { selectedProject} = useProjects();
 console.log("annotator",selectedAnnotator);
 const { showSuccess, showError } = useToast();
  // const [members, setMembers] = useState([]);
  // const [selectedStatus, setSelectedStatus] = useState("");
  const [zoom, _setZoom] = useState(1);
  console.log("nmn",selectedProject);
  
const handleReviewAction = async (action) => {
  if (!selectedImage || !selectedReviewer) return;

  try {
    const comment =
      action === "reject"
        ? prompt("Enter rejection reason") || ""
        : "";

    await reviewImageStatusApi({
      project_id: selectedProject.id,
      image_id: selectedImage.id,
      reviewer_id: selectedReviewer,
      action: action,
      comment: comment
    });

    // update UI instantly
    setSelectedImage(prev => ({
      ...prev,
      status: action,
      rejection_comment: comment
    }));

  } catch (err) {
    console.error("Review failed", err);
  }
};
const handleApproveAll = async () => {
  if (!selectedReviewer || !selectedProject?.id) return;

  try {
    await approveAllImagesApi({
      project_id: selectedProject.id,
      reviewer_id: selectedReviewer
    });

    showSuccess("All images approved successfully");

    // Optional: update UI locally
    setSelectedImage(prev => ({
      ...prev,
      status: "approved"
    }));

  } catch (error) {
    showError(error.detail);
  }
};

// const fetchReviewerTasks = async () => {
//   if (!selectedReviewer || !selectedProject?.id || !selectedAnnotator) return;

//   try {
//     const res = await listReviewerTasksApi(
//       selectedReviewer,
//       selectedProject.id,
//       status || "all",
//       selectedAnnotator
//     );

//     const imagesData = res?.data?.images ?? [];

//     if (imagesData.length) {
//       setImages(imagesData);

//       // Reset navigation
//       setCurrentImageIndex(0);
//       setInputIndex(1);

//       setSelectedImage(imagesData[0]);
//       setImageLoaded(false);
//     } else {
//       // Clear everything if no tasks
//       setImages([]);
//       setSelectedImage(null);
//       setCurrentImageIndex(0);
//       setInputIndex("");
//     }

//   } catch (error) {
//     console.error("Failed to load reviewer tasks:", error);
//   }
// };
// useEffect(() => {
//   fetchReviewerTasks();
// }, [selectedReviewer, selectedProject?.id, status,selectedAnnotator]);
  /* ---------------- reviewers ---------------- */
  // const fetchMembers = async () => {
  //   try {
  //     const res = await listMembersApi();
  //     const data =
  //       res?.data?.data ||
  //       res?.data?.members ||
  //       res?.data ||
  //       [];
  //     setMembers(Array.isArray(data) ? data : []);
  //   } catch {
  //     setMembers([]);
  //   }
  // };

  // useEffect(() => {
  //   fetchMembers();
  // }, []);

  // const reviewers = members.filter(
  //   m => m.role?.trim().toLowerCase() === "reviewer"
  // );

  /* ---------------- draw image + boxes ---------------- */
  useEffect(() => {
    if (!imageLoaded || !selectedImage) return;

    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    boundingBoxes.forEach(box => {
      ctx.strokeStyle = box.color || "red";
      ctx.lineWidth = 1;
      ctx.strokeRect(box.x, box.y, box.width, box.height);
    });
  }, [boundingBoxes, imageLoaded, selectedImage]);

  // /* ---------------- zoom controls ---------------- */
  // const zoomIn = () => setZoom(z => Math.min(3, z + 0.2));
  // const zoomOut = () => setZoom(z => Math.max(0.5, z - 0.2));
  // const resetZoom = () => setZoom(1);

  return (
    <Layout
      pageTitle="Reviewer Panel"
      headerActions={
  <>
    <select
      className={styles.select}
      value={selectedReviewer}
      onChange={(e) => setSelectedReviewer(e.target.value)}
    >
      <option value="">Select Reviewer</option>
      {reviewers.map(r => (
        <option key={r.id} value={r.id}>
          {r.name}
        </option>
      ))}
    </select>
     <select
      className={styles.select}
      value={selectedAnnotator}
      onChange={(e) => setSelectedAnnotator(e.target.value)}
    >
      <option value="">Select Annotator</option>
      {annotators.map(a => (
        <option key={a.id} value={a.id}>
          {a.name}
        </option>
      ))}
    </select>

    <select
      className={styles.select}
      value={status}
      onChange={(e) => setStatus(e.target.value)}
    >
      <option value="">All Status</option>
      <option value="labeled">Labeled</option>
      
      <option value="pending">Pending</option>
      <option value="rejected">Rejected</option>
      <option value="approved">Approved</option>
    </select>
  </>
}
    >
      <div className={styles.container}>
        {/* ---------- header ---------- */}
        <div className={styles.headerBar}>
         <div className={styles.metaChips}>
              <span className={styles.chip}>
                <i className="fi fi-rr-picture" /> {selectedImage?.filename}
              </span>

              {selectedImage?.annotator_name && (
                <span className={styles.chip}>
                  <i className="fi fi-rr-user" /> {selectedImage.annotator_name}
                </span>
              )}

              {selectedImage?.status && (
                <span
                  className={`${styles.statusChip} ${
                    styles[selectedImage.status.toLowerCase()] || ""
                  }`}
                >
                  {selectedImage.status.toUpperCase()}
                </span>
              )}
            </div>
          <div className={styles.actionsRow}>
          <Button
            variant="primary"
            disabled={!selectedReviewer || images.length === 0}
            onClick={handleApproveAll}
          >
            Approve All
          </Button>
        </div>
        </div>

        {/* ---------- canvas ---------- */}
        <div className={styles.mainContent}>
          <div className={styles.canvas}>
            <div className={styles.canvasWrapper}>
              <img
                ref={imageRef}
                src={selectedImage?.url}
                onLoad={() => setImageLoaded(true)}
                style={{ display: "none" }}
                alt=""
              />

              <div
                className={styles.canvasStage}
                style={{ transform: `scale(${zoom})` }}
              >
                <canvas ref={canvasRef} className={styles.annotationCanvas} />

                {/* <div className={styles.zoomControls}>
                  <button onClick={zoomIn}>+</button>
                  <button onClick={zoomOut}>−</button>
                  <button onClick={resetZoom}>
                    <i className="fi fi-rr-refresh" />
                  </button>
                </div> */}
              </div>

               {!imageLoaded && (
                  <div className={styles.imageLoader}>
                  <i className="fi fi-rr-picture" style={{ fontSize: '48px' }}></i>
                  <p>Loading image...</p>
                  </div>
                )}
            </div>
          </div>

          {/* ---------- navigation ---------- */}
      <div className={styles.navigation}>

          {selectedImage?.status === "rejected" &&
            selectedImage?.rejection_comment?.trim() && (
              <div className={styles.rejectionInline}>
                {selectedImage.rejection_comment}
              </div>
          )}

          {/* CENTER CONTROLS */}
          <div className={styles.centerNav}>
            <Button
              variant="secondary"
              icon="fi-rr-angle-left"
              onClick={prev}
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
              onClick={next}
              disabled={currentImageIndex === images.length - 1}
            >
              Next
            </Button>
          </div>

          {/* RIGHT BUTTONS */}
          <div className={styles.reviewActions}>
            <Button
              variant="danger"
              disabled={!selectedReviewer}
              onClick={() => handleReviewAction("reject")}
            >
              Reject
            </Button>

            <Button
              variant="primary"
              disabled={!selectedReviewer}
              onClick={() => handleReviewAction("approve")}
            >
              Approve
            </Button>
          </div>

        </div>
        </div>
      </div>
    </Layout>
  );
};

export default Review;