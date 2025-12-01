import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/authentication";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/routes/constants";
import { Link } from "react-router-dom";
const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.HOME, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Reset errors
  let validationErrors = {};

  // Basic validations
  if (!email) validationErrors.email = "Email is required";
  else if (!/\S+@\S+\.\S+/.test(email)) validationErrors.email = "Invalid email";

  if (!password) validationErrors.password = "Password is required";
  else if (password.length < 6)
    validationErrors.password = "Password must be at least 6 characters";

  setErrors(validationErrors);

  // Stop if errors exist
  if (Object.keys(validationErrors).length > 0) return;

  // Otherwise continue login
  setIsLoading(true);
  setTimeout(() => {
    setIsLoading(false);
    login();
    navigate(ROUTES.HOME, { replace: true });
  }, 1000);
};


  // Clear specific error when user types
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: null }));
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: null }));
    }
  };

  return (
    <AuthLayout
  title="Welcome Back"
  subTitle="Sign in to your account"
  onSubmit={handleSubmit}
>
  <>
     <Input
      label="Email"
      name="email"
      type="email"
      placeholder="Enter your email"
      value={email}
      onChange={handleEmailChange}
      error={errors.email}
      required
     icon={<i className="fi fi-rr-envelope"></i>}
    />
    {errors.email && <p style={{ color: "red", fontSize: "12px" }}>{errors.email}</p>}

   <Input
      label="Password"
      name="password"
      type="password"
      placeholder="Enter your password"
      value={password}
      onChange={handlePasswordChange}
      error={errors.password}
      required
      icon={<i className="fi fi-rr-lock"></i>}
    />
    {errors.password && <p style={{ color: "red", fontSize: "12px" }}>{errors.password}</p>}

    <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
      {isLoading ? "Logging in..." : "Login"}
    </Button>

    <Link to={ROUTES.FORGOTPASSWORD} style={{ color: "#ff6666",textAlign: "right"}}>
  Forgot Password?
</Link>

  </>
</AuthLayout>

  );
};

export default Login;
