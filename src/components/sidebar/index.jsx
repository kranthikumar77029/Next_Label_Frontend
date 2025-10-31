import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { snrLogo } from '../../resources/index.jsx';
import { ROUTES } from '../../routes/constants.js';
import { Button } from '../button/index.jsx';
import styles from './styles.module.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navItems = [
    { path: ROUTES.HOME, icon: 'fi-rr-home', label: 'Projects Hub' },
    {
      path: ROUTES.UPLOAD,
      icon: 'fi-rr-cloud-upload',
      label: 'Upload & Manage Data',
    },
    {
      path: ROUTES.AUTO_LABEL,
      icon: 'fi-rr-magic-wand',
      label: 'Auto Labeling Studio',
    },
    {
      path: ROUTES.ANNOTATE,
      icon: 'fi-rr-picture',
      label: 'Annotation Viewer',
    },
    {
      path: ROUTES.CLASSES,
      icon: 'fi-rr-palette',
      label: 'Label Class Manager',
    },
    { path: ROUTES.EXPORT, icon: 'fi-rr-download', label: 'Export Center' },
  ];

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
    setShowLogoutModal(false);
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoContainer}>
          <img src={snrLogo} alt="SNR Logo" className={styles.logoImage} />
          <div className={styles.logoTextContainer}>
            <div className={styles.logoTitle}>NexLabel Craft</div>
            <div className={styles.logoSubtitle}>
              Intelligent Annotation Platform
            </div>
          </div>
        </div>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <i className={`fi ${item.icon} ${styles.navIcon}`}></i>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.logoutSection}>
        <button
          className={styles.logoutButton}
          onClick={() => setShowLogoutModal(true)}
        >
          <i className={`fi fi-rr-sign-out-alt ${styles.logoutIcon}`}></i>
          <span>Logout</span>
        </button>
      </div>

      <div className={styles.footer}>
        <div className={styles.footerText}>© 2025 NexLabel Craft</div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className={styles.modal} onClick={() => setShowLogoutModal(false)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div className={styles.modalIcon}>
                <i className="fi fi-rr-sign-out-alt"></i>
              </div>
              <h2 className={styles.modalTitle}>Confirm Logout</h2>
            </div>

            <p className={styles.modalMessage}>
              Are you sure you want to logout? You'll need to sign in again to
              access your account.
            </p>

            <div className={styles.modalActions}>
              <Button
                variant="secondary"
                type="button"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                type="button"
                onClick={handleLogout}
                icon="fi-rr-sign-out-alt"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export { Sidebar };
