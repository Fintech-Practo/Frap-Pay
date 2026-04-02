import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

const LoginPage = ({ type }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      navigate(type === "admin" ? "/admin" : "/client");
    }, 1200);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-1 gradient-primary items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-primary-foreground/20"
              style={{
                width: `${200 + i * 120}px`,
                height: `${200 + i * 120}px`,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center px-12">
          <div className="w-16 h-16 rounded-2xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl font-bold text-primary-foreground">
              F
            </span>
          </div>

          <h1 className="text-4xl font-bold text-primary-foreground mb-3">
            FinStack
          </h1>

          <p className="text-primary-foreground/70 text-lg max-w-md">
            {type === "admin"
              ? "Enterprise-grade payment infrastructure management."
              : "Seamless payment collection & disbursement platform."}
          </p>
        </div>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <span className="text-lg font-bold text-primary-foreground">
                F
              </span>
            </div>
            <span className="font-semibold text-xl">FinStack</span>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-1">
            {type === "admin" ? "Admin Login" : "Welcome back"}
          </h2>

          <p className="text-muted-foreground mb-8">
            {type === "admin"
              ? "Access your admin control panel."
              : "Sign in to your merchant dashboard."}
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Email
              </label>

              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="h-11 bg-muted/50 border-border/50 rounded-xl"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-foreground">
                  Password
                </label>

                <Link
                  to="#"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <Input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="••••••••"
                  className="h-11 bg-muted/50 border-border/50 rounded-xl pr-10"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPass ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-11 rounded-xl gradient-primary text-primary-foreground font-medium gap-2 hover:opacity-90 transition-opacity"
              disabled={loading}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            {type === "client" ? (
              <>
                Need admin access?{" "}
                <Link
                  to="/admin/login"
                  className="text-primary hover:underline"
                >
                  Admin Login
                </Link>
              </>
            ) : (
              <>
                Back to{" "}
                <Link
                  to="/client/login"
                  className="text-primary hover:underline"
                >
                  Client Login
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;