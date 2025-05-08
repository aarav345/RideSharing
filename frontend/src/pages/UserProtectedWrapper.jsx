import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserDataContext from "../context/UserContext";

const UserProtectedWrapper = ({ children }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { user, setUser } = useContext(UserDataContext);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      axios
        .get(`${import.meta.env.VITE_BASE_URL}/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            setIsLoading(false);
            setUser(response.data.user);
            navigate("/login");
          }
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
          setIsLoading(false);
          localStorage.removeItem("token");
          navigate("/login");
        });
    }
  }, [token, navigate, setUser]);

  if (isLoading) return <div>Loading...</div>;

  return <>{children}</>;
};

export default UserProtectedWrapper;
