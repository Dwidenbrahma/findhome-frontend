import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home.jsx";
import Form from "./components/form/Form.jsx";
import Info from "./components/main/Info.jsx";
import Login from "./components/form/Login.jsx";
import Register from "./components/form/Register.jsx";
import UserDashbord from "./components/user/UserDashbord.jsx";
import HousePost from "./components/form/HousePost.jsx";
import Owner from "./components/form/Owner.jsx";
import OwnerDashboard from "./components/Owner/OwnerDashboard.jsx";
import EditProperty from "./components/Owner/EditProperty.jsx";
import { AuthProvider } from "./components/AuthContext.jsx";
import OwnerLogin from "./components/form/OwnerLogin.jsx";
import { OwnerAuthProvider } from "./components/OwnerContextAuth.jsx";
//import Loading from "./components/Loading";
import { DashProvider } from "./components/ShowDashContext.jsx";
import PanoramicViewer from "./components/main/Panoramic.jsx";
//import StripeCheckout from "./components/Stripe/StripeCheckout.jsx";
import PropertyForm from "./components/form/PropertyForm.jsx";
import { HomeProvider } from "./components/HomeContext.jsx";
import ForgotPassword from "./components/form/ForgotPassword.jsx";
import ResetPassword from "./components/form/ResetPassword.jsx";
import ForgotOwner from "./components/form/ForgotOwner.jsx";
import ResetOwner from "./components/form/ResetOwner.jsx";
//import StudentCard from "./components/main/StudentCard.jsx";
import WishListProvider from "./components/WishListContext.jsx";

function App() {
  return (
    <BrowserRouter>
      {/* Wrapping the entire app with both context providers */}
      <AuthProvider>
        <OwnerAuthProvider>
          <DashProvider>
            <HomeProvider>
              <WishListProvider>
                <Routes>
                  {/* User routes */}

                  <Route path="/" element={<Home />} />
                  <Route path="/reserve/:id" element={<Form />} />
                  <Route path="/info/:id/:type" element={<Info />} />
                  <Route
                    path="/reserve/property/:id"
                    element={<PropertyForm />}
                  />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/user/dashbord" element={<UserDashbord />} />
                  <Route
                    path="/user/panoramic/:id"
                    element={<PanoramicViewer />}
                  />
                  <Route path="/forgot" element={<ForgotPassword />} />
                  <Route
                    path="/reset-password/:token"
                    element={<ResetPassword />}
                  />
                  {/* <Route path="/user/payement" element={<StudentCard />} /> */}

                  {/* Owner routes */}
                  <Route path="/owner/login" element={<OwnerLogin />} />
                  <Route path="/owner/signup" element={<Owner />} />
                  <Route path="/owner/dash/posthome" element={<HousePost />} />
                  <Route path="/owner/dash" element={<OwnerDashboard />} />
                  <Route
                    path="/owner/dash/edit/:id"
                    element={<EditProperty />}
                  />
                  <Route path="/owner/forgot" element={<ForgotOwner />} />
                  <Route
                    path="/owner/reset-password/:token"
                    element={<ResetOwner />}
                  />
                </Routes>
              </WishListProvider>
            </HomeProvider>
          </DashProvider>
        </OwnerAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
