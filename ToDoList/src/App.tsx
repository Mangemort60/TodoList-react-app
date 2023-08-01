import {useState} from "react";
import "./App.css";
import LoginForm, {UserData} from "./pages/LoginForm";
import DashBoard from "./pages/DashBoard";
import {Routes, Route, Navigate} from "react-router-dom";
import RegisterForm from "./pages/RegisterForm";
import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";

function App() {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_isAuthenticated, setIsAuthenticated] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [UserToken, _setUserToken, removeUserToken] = useCookies();
  const [user, setUser] = useState<UserData | undefined>();

  const LogOut = () => {
    setIsAuthenticated(false);
    removeUserToken("token");
    navigate("/login");
  };

  return (
    <Routes>
      if({UserToken.token})
      {
        <Route
          path="/dashboard"
          element={<DashBoard onClick={LogOut} user={user} />}
        />
      }
      <Route path="/" element={<Navigate to="/login" />} />
      <Route
        path="/login"
        element={
          <LoginForm
            setIsAuthenticated={setIsAuthenticated}
            setUser={setUser}
          />
        }
      />
      <Route path="/register" element={<RegisterForm />} />
    </Routes>
  );
}

export default App;
