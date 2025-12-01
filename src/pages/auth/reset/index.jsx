import { useState } from "react";
import { AuthLayout } from "@/components/authentication";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "@/routes/constants";
import styles from "./styles.module.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { resetToken } = useParams(); // token from URL

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    let validationErrors = {};

    if (!password) validationErrors.password = "Password is required";
    else if (password.length < 6)
      validationErrors.password = "Password must be 6+ characters";

    if (!confirmPassword)
      validationErrors.confirmPassword = "Confirm Password is required";
    else if (password !== confirmPassword)
      validationErrors.confirmPassword = "Passwords do not match";

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setIsSaving(true);

    // Mock API call
    setTimeout(() => {
      setIsSaving(false);
      navigate(ROUTES.LOGIN);
    }, 1000);
  };

  return (
    <AuthLayout
      title="Reset Password"
      subTitle="Create your new password"
      onSubmit={handleSubmit}
    >
      <>
        <div className={styles.inputWithIcon}>
          <Input
            label="New Password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            error={errors.password}
            icon={<Lock size={18} />}
          />
          <span
            className={styles.eyeIcon}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

        <div className={styles.inputWithIcon}>
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            error={errors.confirmPassword}
            icon={<Lock size={18} />}
          />
          <span
            className={styles.eyeIcon}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

        <Button type="submit" variant="primary" fullWidth disabled={isSaving}>
          {isSaving ? "Saving..." : "Reset Password"}
        </Button>
      </>
    </AuthLayout>
  );
};

export  {ResetPassword};
