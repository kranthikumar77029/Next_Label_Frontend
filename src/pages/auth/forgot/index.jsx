import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/components/authentication";
import { Mail } from "lucide-react";
import OtpInput from "react-otp-input";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/constants";
import styles from "./styles.module.css";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [errorMsg, setErrorMsg] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!email) {
      setErrorMsg({ email: "Email is required" });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
    }, 1000);
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 6) {
      setErrorMsg({ otp: "Enter valid 6 digit OTP" });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate(`${ROUTES.RESETPASSWORD}/sample-token`);
    }, 1000);
  };

  return (
    <AuthLayout
      title="Forgot Password"
      subTitle="Enter your registered email to receive OTP"
    >
      <>
        {!otpSent ? (
          <div className={styles.authForm}>
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMsg({});
              }}
              error={errorMsg.email}
              required
              icon={<Mail size={18} />}
            />

            <Button type="button" fullWidth onClick={handleSendOtp}>
              {isLoading ? "Sending..." : "Send OTP"}
            </Button>
          </div>
        ) : (
          <div className={styles.authForm}>
            <OtpInput
            value={otp}
            onChange={(val) => {
                setOtp(val);
                setErrorMsg({ ...errorMsg, otp: '' });
            }}
            numInputs={6}
            isInputNum
            renderSeparator={<span>-</span>}
            renderInput={(props) => <input {...props} />}
            containerStyle={styles.auth_otpContainer}
            inputStyle={styles.auth_otpInput}
            />


            {errorMsg.otp && <p className={styles.errorText}>{errorMsg.otp}</p>}

            <Button type="button" fullWidth onClick={handleVerifyOtp}>
              {isLoading ? "Verifying..." : "Verify OTP"}
            </Button>
          </div>
        )}
      </>
    </AuthLayout>
  );
};

export default ForgotPassword;
