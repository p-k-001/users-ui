import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Swagger from "./pages/Swagger";
import TestApiForm from "./pages/TestApiForm";

import { useEffect, useState } from "react";
import LoginHeader from "./components/LoginHeader";

interface ErrorMessage {
  msg?: string;
  message?: string;
}

export default function App() {
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
      <BrowserRouter>
        <LoginHeader
          isLoggedIn={isLoggedIn}
          email={email}
          handleLogout={handleLogout}
          handleLogin={handleLogin}
          clearMessage={() => setMessage(null)}
          clearErrorMessage={() => setError(null)}
        />

        <Routes>
          <Route
            index
            element={
              <TestApiForm
                isLoggedIn={isLoggedIn}
                message={message}
                setMessage={setMessage}
                error={error}
                setError={setError}
              />
            }
          />
          <Route path="swagger" element={<Swagger />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
