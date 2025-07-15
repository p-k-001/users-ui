import { FormEvent, useState } from "react";
import { jwtDecode } from "jwt-decode";

type LoginFormProps = {
  onLogin: () => void;
  clearMessage: () => void;
  clearErrorMessage: () => void;
  showLogin: boolean;
  setShowLogin: (x: boolean) => void;
  closeRegisterForm: () => void;
};

export default function LoginForm({
  onLogin,
  clearMessage,
  clearErrorMessage,
  showLogin,
  setShowLogin,
  closeRegisterForm,
}: LoginFormProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  // const [showLogin, setShowLogin] = useState<boolean>(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      const token = data.token;
      localStorage.setItem("token", token);

      const user: { email: string } = jwtDecode(token);
      localStorage.setItem("userEmail", user.email);

      clearMessage();
      setShowLogin(false);
      onLogin();
    } catch (err) {
      setError("Something went wrong.");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="popup-wrapper">
      <button
        type="button"
        onClick={() => {
          clearMessage();
          clearErrorMessage();
          setShowLogin(true);
          closeRegisterForm();
        }}
        className="popup-button"
      >
        Log in
      </button>
      {showLogin && (
        <div className="popup-popover">
          <button
            className="popup-close-button"
            onClick={() => setShowLogin(false)}
          >
            &times;
          </button>
          <form className="popup-form" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>

            {error && <p className="login-error">{error}</p>}
          </form>
        </div>
      )}
    </div>
  );
}
