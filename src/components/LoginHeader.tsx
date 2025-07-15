import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

type LoginHeaderProps = {
  isLoggedIn: boolean;
  email: string;
  handleLogout: () => void;
  handleLogin: () => void;
  clearMessage: () => void;
  clearErrorMessage: () => void;
};

export default function LoginHeader({
  isLoggedIn,
  email,
  handleLogout,
  handleLogin,
  clearMessage,
  clearErrorMessage,
}: LoginHeaderProps) {
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [showRegistration, setShowRegistration] = useState<boolean>(false);

  return (
    <div>
      {isLoggedIn ? (
        <>
          <p>Logged in as: {email}</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <LoginForm
            onLogin={handleLogin}
            clearMessage={clearMessage}
            clearErrorMessage={clearErrorMessage}
            showLogin={showLogin}
            setShowLogin={setShowLogin}
            closeRegisterForm={() => setShowRegistration(false)}
          />
        </>
      )}
      <div>
        <RegisterForm
          clearMessage={clearMessage}
          clearErrorMessage={clearErrorMessage}
          showRegistration={showRegistration}
          setShowRegistration={setShowRegistration}
          closeLoginForm={() => setShowLogin(false)}
        />
      </div>
    </div>
  );
}
