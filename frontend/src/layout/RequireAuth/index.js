import { useLocation, Navigate, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const RequireAuth = ({ allowedTypes }) => {
  const user = useSelector((state) => state.user.userDetails);
  const location = useLocation();
  return allowedTypes?.includes(user?.user_type) ? (
    <Outlet />
  ) : user?.email ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

RequireAuth.propTypes = {
  allowedRoles: PropTypes.array
};
export default RequireAuth;
