import { snrLogo } from "@/resources";
import styles from "./styles.module.css";

const AuthLayout = ({ title, subTitle, children, onSubmit }) => {
  // Placeholder background image
  const sampleImageUrl =
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&q=80";

  return (
    <div className={styles.loginContainer}>
      {/* Background Image */}
      <div
        className={styles.backgroundImage}
        style={{ backgroundImage: `url(${sampleImageUrl})` }}
      ></div>
      <div className={styles.backgroundOverlay}></div>

      {/* Animated Shapes */}
      <div className={styles.geometricShapes}>
        {/* Hexagons */}
        <div className={styles.shape} style={{ top: "10%", left: "5%", animationDelay: "0s" }}>
          <svg width="80" height="80" viewBox="0 0 80 80">
            <polygon points="40,5 70,20 70,50 40,65 10,50 10,20" fill="#06b6d4" opacity="0.3" />
          </svg>
        </div>

        <div className={styles.shape} style={{ top: "60%", left: "8%", animationDelay: "1s" }}>
          <svg width="60" height="60" viewBox="0 0 60 60">
            <polygon points="30,5 55,17.5 55,42.5 30,55 5,42.5 5,17.5" fill="#06b6d4" opacity="0.25" />
          </svg>
        </div>

        {/* Triangles */}
        <div className={styles.shape} style={{ top: "15%", right: "10%", animationDelay: "0.5s" }}>
          <svg width="70" height="70" viewBox="0 0 70 70">
            <polygon points="35,5 65,60 5,60" fill="#06b6d4" opacity="0.2" />
          </svg>
        </div>

        <div className={styles.shape} style={{ top: "70%", right: "6%", animationDelay: "1.5s" }}>
          <svg width="50" height="50" viewBox="0 0 50 50">
            <polygon points="25,5 45,40 5,40" fill="#06b6d4" opacity="0.3" />
          </svg>
        </div>

        {/* Circles */}
        <div className={styles.shape} style={{ top: "30%", left: "12%", animationDelay: "0.8s" }}>
          <svg width="90" height="90" viewBox="0 0 90 90">
            <circle cx="45" cy="45" r="40" fill="#06b6d4" opacity="0.2" />
          </svg>
        </div>

        <div className={styles.shape} style={{ top: "50%", right: "15%", animationDelay: "1.2s" }}>
          <svg width="75" height="75" viewBox="0 0 75 75">
            <circle cx="37.5" cy="37.5" r="32" fill="#06b6d4" opacity="0.25" />
          </svg>
        </div>

        {/* Squares */}
        <div className={styles.shape} style={{ top: "25%", left: "50%", animationDelay: "0.3s" }}>
          <svg width="65" height="65" viewBox="0 0 65 65">
            <rect x="15" y="15" width="35" height="35" fill="#06b6d4" opacity="0.2" transform="rotate(45 32.5 32.5)" />
          </svg>
        </div>

        <div className={styles.shape} style={{ top: "80%", left: "20%", animationDelay: "1.8s" }}>
          <svg width="55" height="55" viewBox="0 0 55 55">
            <rect x="12.5" y="12.5" width="30" height="30" fill="#06b6d4" opacity="0.25" transform="rotate(45 27.5 27.5)" />
          </svg>
        </div>
      </div>

      {/* Login Section */}
      <div className={styles.loginSection}>
        <div className={styles.loginPanel}>
          <div className={styles.logoSpace}>
            <img src={snrLogo} alt="SNR Logo" className={styles.logoImage} />
          </div>

          <div className={styles.loginHeader}>
            <h2 className={styles.loginTitle}>{title}</h2>
            <p className={styles.loginSubtitle}>{subTitle}</p>
          </div>

          <form className={styles.loginForm} onSubmit={onSubmit}>
            {children} {/* Inputs inserted from outside */}
          </form>
        </div>
      </div>
    </div>
  );
};

export  {AuthLayout};
