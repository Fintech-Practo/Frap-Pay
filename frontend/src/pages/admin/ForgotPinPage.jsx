import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  CheckCircle,
  KeyRound,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const AdminForgotPinPage = () => {
  const [step, setStep] = useState("verify");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!email) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);

    setStep("otp");
    toast({
      title: "OTP Sent",
      description: "Verification code sent to admin email.",
    });
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 6) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);

    setStep("reset");
  };

  const handleResetPin = async () => {
    if (newPin.length < 4 || newPin !== confirmPin) {
      toast({
        title: "Error",
        description: "PINs must match and be 4 digits.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);

    setStep("success");

    toast({
      title: "PIN Reset Successful",
      description: "Admin PIN has been updated.",
    });
  };

  const steps = ["verify", "otp", "reset", "success"];

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3">
        <Link
          to="/admin/settings"
          className="p-2 rounded-xl hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Forgot PIN
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Reset your admin transaction PIN.
          </p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                step === s
                  ? "gradient-primary text-primary-foreground"
                  : steps.indexOf(step) > i
                  ? "bg-success/20 text-success"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {steps.indexOf(step) > i ? "✓" : i + 1}
            </div>

            {i < 3 && (
              <div
                className={`flex-1 h-0.5 rounded-full transition-all ${
                  steps.indexOf(step) > i
                    ? "bg-success/40"
                    : "bg-border"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="card-modern p-6">
        {/* VERIFY */}
        {step === "verify" && (
          <div className="space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <KeyRound className="h-7 w-7 text-primary" />
            </div>

            <div>
              <h3 className="font-semibold text-foreground text-lg">
                Verify Admin Identity
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Enter your admin email for verification.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Admin Email
              </label>

              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@fintech.com"
                className="h-11 rounded-xl"
                type="email"
              />
            </div>

            <Button
              onClick={handleSendOtp}
              disabled={loading || !email}
              className="w-full h-11 rounded-xl gradient-primary text-primary-foreground"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                "Send OTP"
              )}
            </Button>
          </div>
        )}

        {/* OTP */}
        {step === "otp" && (
          <div className="space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="h-7 w-7 text-primary" />
            </div>

            <div>
              <h3 className="font-semibold text-foreground text-lg">
                Enter OTP
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Code sent to{" "}
                <span className="font-medium text-foreground">
                  {email}
                </span>
              </p>
            </div>

            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={setOtp}
              >
                <InputOTPGroup>
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <InputOTPSlot key={i} index={i} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              onClick={handleVerifyOtp}
              disabled={loading || otp.length < 6}
              className="w-full h-11 rounded-xl gradient-primary text-primary-foreground"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                "Verify OTP"
              )}
            </Button>

            <button
              onClick={handleSendOtp}
              className="text-sm text-primary hover:underline w-full text-center"
            >
              Resend OTP
            </button>
          </div>
        )}

        {/* RESET */}
        {step === "reset" && (
          <div className="space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <KeyRound className="h-7 w-7 text-primary" />
            </div>

            <div>
              <h3 className="font-semibold text-foreground text-lg">
                Set New PIN
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Create a new 4-digit admin PIN.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                New PIN
              </label>

              <Input
                value={newPin}
                onChange={(e) =>
                  setNewPin(
                    e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 4)
                  )
                }
                placeholder="••••"
                className="h-11 rounded-xl text-center tracking-[0.5em] text-lg"
                type="password"
                maxLength={4}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Confirm PIN
              </label>

              <Input
                value={confirmPin}
                onChange={(e) =>
                  setConfirmPin(
                    e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 4)
                  )
                }
                placeholder="••••"
                className="h-11 rounded-xl text-center tracking-[0.5em] text-lg"
                type="password"
                maxLength={4}
              />
            </div>

            <Button
              onClick={handleResetPin}
              disabled={loading || newPin.length < 4}
              className="w-full h-11 rounded-xl gradient-primary text-primary-foreground"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                "Reset PIN"
              )}
            </Button>
          </div>
        )}

        {/* SUCCESS */}
        {step === "success" && (
          <div className="flex flex-col items-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>

            <h3 className="font-semibold text-foreground text-lg">
              PIN Reset Complete!
            </h3>

            <p className="text-sm text-muted-foreground text-center">
              Admin PIN has been updated successfully.
            </p>

            <Link to="/admin/settings">
              <Button variant="outline" className="rounded-xl">
                Back to Settings
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminForgotPinPage;