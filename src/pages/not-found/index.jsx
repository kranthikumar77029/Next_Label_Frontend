import { Button } from '@/components/ui/button';
import { Layout } from '@/components/common/layout';
import { ROUTES } from '@/routes/constants';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Layout pageTitle="404 - Page Not Found" showProjectSelector={false}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.iconWrapper}>
            <i className={`fi fi-rr-file-question ${styles.icon}`}></i>
          </div>
          <h1 className={styles.title}>404</h1>
          <h2 className={styles.subtitle}>Page Not Found</h2>
          <p className={styles.description}>
            The page you're looking for doesn't exist or has been moved.
            <br />
            Please check the URL or navigate back to the home page.
          </p>
          <div className={styles.actions}>
            <Button
              variant="primary"
              icon="fi-rr-home"
              onClick={() => navigate(ROUTES.HOME)}
            >
              Go to Home
            </Button>
            <Button
              variant="secondary"
              icon="fi-rr-arrow-left"
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
