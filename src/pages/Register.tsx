import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";
import { errorMessage } from "@/services/api";
import { AuthCard } from "@/components/common/AuthCard";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const set =
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm({ ...form, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm)
      return toast({ title: "Passwords do not match", variant: "destructive" });
    if (form.password.length < 8)
      return toast({
        title: "Password must be at least 8 characters",
        variant: "destructive",
      });
    setLoading(true);
    try {
      await authService.register({
        username: form.username,
        email: form.email,
        password: form.password,
      });
      toast({ title: "Account created", description: "You can now sign in." });
      navigate("/login");
    } catch (err) {
      setError(errorMessage(err));
      toast({
        title: "Registration failed",
        description: errorMessage(err),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      footer={
        <>
          Have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <Input
          aria-label="Username"
          placeholder="Username"
          value={form.username}
          onChange={set("username")}
          required
          autoComplete="username"
        />
        <Input
          type="email"
          aria-label="E-mail address"
          placeholder="E-mail address"
          value={form.email}
          onChange={set("email")}
          required
          autoComplete="email"
        />
        <Input
          type="password"
          aria-label="Password"
          placeholder="Password"
          minLength={8}
          aria-describedby="password-help"
          value={form.password}
          onChange={set("password")}
          required
          autoComplete="new-password"
        />
        <p id="password-help" className="text-xs text-muted-foreground">
          Use at least 8 characters. Avoid common or entirely numeric passwords
          and passwords similar to your account details.
        </p>
        <Input
          type="password"
          aria-label="Confirm password"
          placeholder="Confirm password"
          value={form.confirm}
          onChange={set("confirm")}
          required
          autoComplete="new-password"
        />
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Sign Up
        </Button>
      </form>
    </AuthCard>
  );
}
