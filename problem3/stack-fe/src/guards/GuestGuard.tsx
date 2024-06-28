import React from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

// ==============================|| GUEST GUARD ||============================== //

/**
 * Guest guard for routes having no auth required
 * @param {PropTypes.node} children children element/node
 */

const GuestGuard: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  React.useEffect(() => {
    if (isLoggedIn) {
      navigate("/admin/news/list");
    }
  }, [isLoggedIn]);

  return children;
};

export default GuestGuard;
