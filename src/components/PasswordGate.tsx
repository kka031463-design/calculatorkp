import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";

const DEFAULT_PASS = "vbm125";

export function getPassword(): string {
  return localStorage.getItem("pipe_password") || DEFAULT_PASS;
}

export function setPassword(newPass: string) {
  localStorage.setItem("pipe_password", newPass);
}

const PasswordGate = ({ children }: { children: React.ReactNode }) => {
  const [authorized, setAuthorized] = useState(() => sessionStorage.getItem("pipe_auth") === "1");
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  if (authorized) return <>{children}</>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value === getPassword()) {
      sessionStorage.setItem("pipe_auth", "1");
      setAuthorized(true);
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="card-soft p-8 w-full max-w-sm space-y-4 text-center">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-lg font-bold text-foreground">Введите пароль</h2>
        <Input
          type="password"
          placeholder="Пароль"
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(false); }}
          className="bg-muted border-0 rounded-xl text-center"
          autoFocus
        />
        {error && <p className="text-sm text-destructive">Неверный пароль</p>}
        <Button type="submit" className="w-full rounded-xl">Войти</Button>
      </form>
    </div>
  );
};

export default PasswordGate;
