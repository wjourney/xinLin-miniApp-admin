import React, { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import AppLayout from "@/components/App/Layout";
import Login from "@/components/App/Login";
// import Register from "@/components/App/Register";
import AuthProvider from "@/components/App/AuthProvider";
import { getHealthCheckInfo } from "@/api/common";
// import { getUserInfo } from "@/api/user";

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [renderFlag, setRenderFlag] = useState(true);
  // const getUser = async () => {
  //   const { code } = await getUserInfo();
  //   if (code === 1000) {
  //     setRenderFlag(true);
  //   } else {
  //     setRenderFlag(false);
  //     navigate("/login");
  //   }
  // };

  // useEffect(() => {
  //   getUser();
  // }, []);

  if (!renderFlag) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

const App: React.FC = () => {
  // const getHealthInfo = async () => {
  //   const res = await getHealthCheckInfo();
  //   console.log(res);
  // };

  // useEffect(() => {
  //   getHealthInfo();
  // }, []);

  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* <Route path="/register" element={<Register />} /> */}
        <Route
          path="*"
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
        />
      </Routes>
    </AuthProvider>
  );
};

export default App;
