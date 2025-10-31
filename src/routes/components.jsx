import { Suspense } from "react";

// Loading fallback component for Suspense
export const LoadingFallback = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      fontSize: "1.125rem",
      color: "#6b7280",
    }}
  >
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          width: "48px",
          height: "48px",
          border: "4px solid #e5e7eb",
          borderTop: "4px solid #667eea",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          margin: "0 auto 1rem",
        }}
      ></div>
      <p>Loading...</p>
    </div>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

// Wrapper component to handle Suspense for lazy-loaded routes
export const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
);


