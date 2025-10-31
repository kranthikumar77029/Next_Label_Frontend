import { Button } from '@/components/button';
import { useAuth } from '@/context/AuthContext';
import { snrLogo } from '@/resources';
import { ROUTES } from '@/routes/constants';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Sample image - using a placeholder that will work
  const sampleImageUrl =
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&q=80';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.HOME, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login API call
    setTimeout(() => {
      setIsLoading(false);
      // Set authentication state
      login();
      // Navigate to projects hub after successful login
      navigate(ROUTES.HOME, { replace: true });
    }, 1000);
  };

  return (
    <div className={styles.loginContainer}>
      {/* Background Image */}
      <div
        className={styles.backgroundImage}
        style={{ backgroundImage: `url(${sampleImageUrl})` }}
      ></div>
      <div className={styles.backgroundOverlay}></div>

      {/* Scattered Geometric Shapes */}
      <div className={styles.geometricShapes}>
        {/* Hexagons */}
        <div
          className={styles.shape}
          style={{ top: '10%', left: '5%', animationDelay: '0s' }}
        >
          <svg width="80" height="80" viewBox="0 0 80 80">
            <polygon
              points="40,5 70,20 70,50 40,65 10,50 10,20"
              fill="#06b6d4"
              opacity="0.3"
            />
          </svg>
        </div>
        <div
          className={styles.shape}
          style={{ top: '60%', left: '8%', animationDelay: '1s' }}
        >
          <svg width="60" height="60" viewBox="0 0 60 60">
            <polygon
              points="30,5 55,17.5 55,42.5 30,55 5,42.5 5,17.5"
              fill="#06b6d4"
              opacity="0.25"
            />
          </svg>
        </div>

        {/* Triangles */}
        <div
          className={styles.shape}
          style={{ top: '15%', right: '10%', animationDelay: '0.5s' }}
        >
          <svg width="70" height="70" viewBox="0 0 70 70">
            <polygon points="35,5 65,60 5,60" fill="#06b6d4" opacity="0.2" />
          </svg>
        </div>
        <div
          className={styles.shape}
          style={{ top: '70%', right: '6%', animationDelay: '1.5s' }}
        >
          <svg width="50" height="50" viewBox="0 0 50 50">
            <polygon points="25,5 45,40 5,40" fill="#06b6d4" opacity="0.3" />
          </svg>
        </div>

        {/* Circles */}
        <div
          className={styles.shape}
          style={{ top: '30%', left: '12%', animationDelay: '0.8s' }}
        >
          <svg width="90" height="90" viewBox="0 0 90 90">
            <circle cx="45" cy="45" r="40" fill="#06b6d4" opacity="0.2" />
          </svg>
        </div>
        <div
          className={styles.shape}
          style={{ top: '50%', right: '15%', animationDelay: '1.2s' }}
        >
          <svg width="75" height="75" viewBox="0 0 75 75">
            <circle cx="37.5" cy="37.5" r="32" fill="#06b6d4" opacity="0.25" />
          </svg>
        </div>

        {/* Squares/Diamonds */}
        <div
          className={styles.shape}
          style={{ top: '25%', left: '50%', animationDelay: '0.3s' }}
        >
          <svg width="65" height="65" viewBox="0 0 65 65">
            <rect
              x="15"
              y="15"
              width="35"
              height="35"
              fill="#06b6d4"
              opacity="0.2"
              transform="rotate(45 32.5 32.5)"
            />
          </svg>
        </div>
        <div
          className={styles.shape}
          style={{ top: '80%', left: '20%', animationDelay: '1.8s' }}
        >
          <svg width="55" height="55" viewBox="0 0 55 55">
            <rect
              x="12.5"
              y="12.5"
              width="30"
              height="30"
              fill="#06b6d4"
              opacity="0.25"
              transform="rotate(45 27.5 27.5)"
            />
          </svg>
        </div>

        {/* Pentagons */}
        <div
          className={styles.shape}
          style={{ top: '20%', right: '40%', animationDelay: '1.7s' }}
        >
          <svg width="65" height="65" viewBox="0 0 65 65">
            <polygon
              points="32.5,5 55,20 55,45 32.5,58 10,45 10,20"
              fill="#06b6d4"
              opacity="0.2"
            />
          </svg>
        </div>
        <div
          className={styles.shape}
          style={{ top: '65%', left: '35%', animationDelay: '0.4s' }}
        >
          <svg width="55" height="55" viewBox="0 0 55 55">
            <polygon
              points="27.5,5 47,17.5 47,37.5 27.5,50 8,37.5 8,17.5"
              fill="#06b6d4"
              opacity="0.25"
            />
          </svg>
        </div>
      </div>

      {/* Centered Login Panel */}
      <div className={styles.loginSection}>
        <div className={styles.loginPanel}>
          {/* Logo Space */}
          <div className={styles.logoSpace}>
            <img src={snrLogo} alt="SNR Logo" className={styles.logoImage} />
          </div>

          <div className={styles.loginHeader}>
            <h2 className={styles.loginTitle}>Welcome Back</h2>
            <p className={styles.loginSubtitle}>
              Sign in to continue to NexLabel Craft
            </p>
          </div>

          <form className={styles.loginForm} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                <i className="fi fi-rr-envelope"></i>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className={styles.input}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>
                <i className="fi fi-rr-lock"></i>
                Password
              </label>
              <input
                id="password"
                type="password"
                className={styles.input}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="large"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i
                    className="fi fi-rr-spinner"
                    style={{ animation: 'spin 1s linear infinite' }}
                  ></i>
                  Signing in...
                </>
              ) : (
                <>
                  <i className="fi fi-rr-sign-in-alt"></i>
                  Sign In
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
