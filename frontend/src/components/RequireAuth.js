import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function RequireAuth() {
    const { token } = useAuth();
    const location = useLocation();

    return (
        token ? <Outlet /> : <Navigate to='/login' state={{ from: location }} />
    );
}

export default RequireAuth;