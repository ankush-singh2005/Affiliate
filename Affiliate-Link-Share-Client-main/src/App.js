import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import AppLayout from "./layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import { useEffect, useState } from "react";
import axios from "axios";
import Error from "./pages/Error";
import Logout from "./pages/Logout";
import { serverEndpoint } from "./config/config";
import { useDispatch, useSelector } from "react-redux";
import { SET_USER } from "./redux/user/actions";
import UserLayout from "./layout/UserLayout";
import Register from "./pages/Register";
import Spinner from "./components/Spinner";
import ManageUsers from "./pages/users/ManageUsers";
import ProtectedRoute from "./rbac/ProtectedRoute";
import UnauthorizedAccess from "./components/UnauthorizedAccess";
import ManagePayments from "./pages/payments/ManagePayments";
import AnalyticsDashboard from "./pages/links/AnalyticsDashboard";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  // Tracking user details in App because App is the component which decides
  // where to navigate based on the current route and it needs to know whether
  // the user is logged in or not.
  const userDetails = useSelector((state) => state.userDetails);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const attemptToRefreshToken = async (request, response) => {
    try{
      await axios.post(`${serverEndpoint}/auth/refresh-token`,{},{
        withCredentials:true
      });
      dispatch({
        type:SET_USER,
        payload: response.data.userDetails
      })
    } catch(error){
      console.log(error);
    }
  };

  const isUserLoggedIn = async () => {
    try {
      const response = await axios.post(`${serverEndpoint}/auth/is-user-logged-in`, {}, {
        withCredentials: true
      });
      // updateUserDetails(response.data.userDetails);
      dispatch({
        type:  SET_USER,
        payload: response.data.userDetails
      });
    } catch (error) {
      if(error.response?.status === 401){
        console.log('Token expired, attempting to refresh');
        await attemptToRefreshToken();
      }
      else{
        console.log('User not logged in', error);
      }
      console.log('User not loggedin', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    isUserLoggedIn();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <Routes>
      <Route path="/" element={userDetails ?
        <UserLayout>
          <Navigate to='/dashboard' />
        </UserLayout> :
        <AppLayout>
          <Home />
        </AppLayout>
      } />

      {/* We're passing updateUserDetails function to Login because thats where 
          we'll get user information are autnetication. */}
      <Route path="/login" element={userDetails ?
        <Navigate to='/dashboard' /> :
        <AppLayout>
          <Login />
        </AppLayout>
      } />
      <Route path="/register" element={userDetails ?
        <Navigate to='/dashboard' /> :
        <AppLayout>
          <Register />
        </AppLayout>
      } />
      <Route path="/dashboard" element={userDetails ?
        <UserLayout>
          <Dashboard />
        </UserLayout> :
        <Navigate to='/login' />
      } />
      <Route path="/users" element={userDetails ?
        <ProtectedRoute roles={['admin']}>
          <UserLayout>
            <ManageUsers />
          </UserLayout>
        </ProtectedRoute> :
        <Navigate to='/login' />
      } />
      <Route path="/unauthorized-access" element={userDetails ?
        <UserLayout>
          <UnauthorizedAccess />
        </UserLayout> :
        <Navigate to="/login" />
      } />
      <Route path="/logout" element={userDetails ?
        <Logout /> :
        <Navigate to="/login" />
      } />
      <Route path="/forgot-password" element={
        <ForgetPassword/>
      } />
      <Route path="/reset-password" element={
        <ResetPassword/>
      } />
      <Route path="/error" element={userDetails ?
        <UserLayout>
          <Error />
        </UserLayout> :
        <AppLayout><Error /></AppLayout>
      } />
      <Route path="/manage-payment" element={userDetails ?
        <UserLayout>
          <ManagePayments />
        </UserLayout> :
        <Navigate to='/login' />
      } />
      <Route path="/analytics/:linkId" element={userDetails ?
        <UserLayout>
          <AnalyticsDashboard />
        </UserLayout> :
        <Navigate to='/login' />
      } />
    </Routes>
  );
}

export default App;
