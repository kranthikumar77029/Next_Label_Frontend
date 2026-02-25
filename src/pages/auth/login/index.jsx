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

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword,setShowPassword]= useState(false);
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
  if (!name) validationErrors.name = "User Name  is required";
  // else if (!/\S+@\S+\.\S+/.test(email)) validationErrors.email = "Invalid email";

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
  const handleNameChange = (e) => {
    setName(e.target.value);
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: null }));
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
      label="Name"
      name="name"
      type="text"
      placeholder="Enter your Name"
      value={name}
      onChange={handleNameChange}
      error={errors.name}
      required
     icon={<i className="fi fi-rr-user"></i>}

    />
    {/* {errors.name && <p style={{ color: "red", fontSize: "12px" }}>{errors.name}</p>} */}

   <Input
      label="Password"
      name="password"
      type={showPassword ? "text" : "password"}
      placeholder="Enter your password"
      value={password}
      onChange={handlePasswordChange}
      error={errors.password}
      required
      icon={<i className="fi fi-rr-lock"></i>}
         rightIcon={
          <i
            className={`fi ${
              showPassword ? "fi-rr-eye-crossed" : "fi-rr-eye"
            }`}
            onClick={() => setShowPassword((p) => !p)}
            style={{ cursor: "pointer" }}
          />
        }
    />
    {/* {errors.password && <p style={{ color: "red", fontSize: "12px" }}>{errors.password}</p>} */}

    <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
      {isLoading ? "Logging in..." : "Login"}
    </Button>

<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "10px",
  }}
>
  {/* Left side */}
  <div style={{ textAlign: "left" }}>
    <span style={{ fontSize: "15px", color: "#91e4f5ff" }}>
      New User?
    </span>
    <br />
    <Link
      to={ROUTES.REGISTER}
      style={{ color: "#1393eeff", fontSize: "16px" }}
    >
      Sign Up
    </Link>
  </div>

  {/* Right side */}
  <Link
    to={ROUTES.FORGOTPASSWORD}
    style={{ color: "#f60f0fff", fontSize: "15px" }}
  >
    Forgot Password?
  </Link>
</div>



  </>
</AuthLayout>

  );
};

export default Login;
