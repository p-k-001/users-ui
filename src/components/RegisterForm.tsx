import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

type RegisterFormProps = {
  clearMessage: () => void;
  clearErrorMessage: () => void;
  showRegistration: boolean;
  setShowRegistration: (x: boolean) => void;
  closeLoginForm: () => void;
};

export default function RegisterForm({
  clearMessage,
  clearErrorMessage,
  showRegistration,
  setShowRegistration,
  closeLoginForm,
}: RegisterFormProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [registrationMessage, setRegistrationMessage] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  // const [showRegistration, setShowRegistration] = useState<boolean>(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${apiUrl}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setError(false);
        setRegistrationMessage(data.message);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setRegistrationMessage(data.message || "Registration failed.");
        setError(true);
      }
    } catch (error: unknown) {
      setError(true);
      if (error instanceof Error) {
        setRegistrationMessage(error.message);
      } else {
        setRegistrationMessage("An unexpected error occurred.");
      }
    }
    setEmail("");
    setPassword("");
  };

  return (
    <div className="popup-wrapper">
      <button
        type="button"
        onClick={() => {
          clearMessage();
          clearErrorMessage();
          setRegistrationMessage("");
          setShowRegistration(true);
          closeLoginForm();
        }}
        className="popup-button"
      >
        Register
      </button>
      {showRegistration && (
        <div className="popup-popover">
          <button
            className="popup-close-button"
            onClick={() => setShowRegistration(false)}
          >
            &times;
          </button>

          <form className="popup-form" onSubmit={handleSubmit}>
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

            <button type="submit" className="register-button">
              Register
            </button>
            {registrationMessage && (
              <p className={error ? "message error" : "message success"}>
                {registrationMessage}
              </p>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
