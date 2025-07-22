import TestApiForm from "../components/TestApiForm";
import LoginHeader from "../components/LoginHeader";

import { useEffect, useState } from "react";
import Info from "../components/Info";

interface ErrorMessage {
  msg?: string;
  message?: string;
}

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    !!localStorage.getItem("token")
  );
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<ErrorMessage | ErrorMessage[] | null>(
    null
  );

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    setEmail(storedEmail || "");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    const storedEmail = localStorage.getItem("userEmail");
    setEmail(storedEmail || "");
  };
  return (
    <div>
      <Info />
      <LoginHeader
        isLoggedIn={isLoggedIn}
        email={email}
        handleLogout={handleLogout}
        handleLogin={handleLogin}
        clearMessage={() => setMessage(null)}
        clearErrorMessage={() => setError(null)}
      />

      <TestApiForm
        isLoggedIn={isLoggedIn}
        message={message}
        setMessage={setMessage}
        error={error}
        setError={setError}
      />
    </div>
  );
}
