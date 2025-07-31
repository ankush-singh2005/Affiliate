import { useSelector } from "react-redux";
import { Navigate } from 'react-router-dom';

// roles will be array of roles that are allowed to render/visit children component
function ProtectedRoute({ roles, children }) {
    const userDetails = useSelector((state) => state.userDetails);
    return roles.includes(userDetails?.role) ?
        children :
        <Navigate to="/unauthorized-access" />;
}

export default ProtectedRoute;