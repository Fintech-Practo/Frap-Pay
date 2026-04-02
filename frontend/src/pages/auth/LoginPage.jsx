import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

const LoginPage = ({ type }) => {
  const brandName = "Frap Pay";
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
    <div className="min-h-screen flex bg-background gradient-surface">
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden border-r border-primary-foreground/10 gradient-primary">
        <div className="absolute inset-0 opacity-15">
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

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.22),_transparent_35%)]" />

        <div className="relative z-10 text-center px-12">
          <img src="/Logo.png" alt={`${brandName} logo`} className="mx-auto mb-6 h-44 w-44 scale-110 object-contain drop-shadow-[0_18px_40px_rgba(15,23,42,0.25)]" />

          <h1 className="mb-3 text-4xl font-bold text-primary-foreground">
            {brandName}
          </h1>

          <p className="max-w-md text-lg text-primary-foreground/80">
            {type === "admin"
              ? "Enterprise-grade payment infrastructure management."
              : "Seamless payment collection and disbursement platform."}
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-[2rem] border border-border/70 bg-card/80 p-8 shadow-lg backdrop-blur-sm">
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <img src="/Logo.png" alt={`${brandName} logo`} className="h-18 w-18 scale-125 object-contain" />
            <span className="text-xl font-semibold text-foreground">{brandName}</span>
          </div>

          <h2 className="mb-1 text-2xl font-bold text-foreground">
            {type === "admin" ? "Admin Login" : "Welcome back"}
          </h2>

          <p className="mb-8 text-muted-foreground">
            {type === "admin"
              ? "Access your admin control panel."
              : "Sign in to your merchant dashboard."}
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Email
              </label>

              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="h-11 rounded-xl border-border/70 bg-card/70 shadow-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                  Password
                </label>

                <Link to="#" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <Input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="........"
                  className="h-11 rounded-xl border-border/70 bg-card/70 pr-10 shadow-sm"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPass ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="h-11 w-full gap-2 rounded-xl gradient-primary font-medium text-primary-foreground shadow-md transition-opacity hover:opacity-95"
              disabled={loading}
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
              ) : (
                <>
                  Sign In <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {type === "client" ? (
              <>
                Need admin access?{" "}
                <Link to="/admin/login" className="text-primary hover:underline">
                  Admin Login
                </Link>
              </>
            ) : (
              <>
                Back to{" "}
                <Link to="/client/login" className="text-primary hover:underline">
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




