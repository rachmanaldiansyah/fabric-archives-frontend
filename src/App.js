import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./components/Login";
import Users from "./pages/Users";
import UsersCreate from "./components/Register";
import UsersFormEdit from "./pages/UsersFormEdit";
import Ijazah from "./pages/Ijazah";
import IjazahFormConfirm from "./pages/IjazahFormConfirm";
import IjazahFormEdit from "./pages/IjazahFormEdit";
import IjazahFormCreate from "./pages/IjazahFormCreate";
import Sertifikat from "./pages/Sertifikat";
import SertifikatFormConfirm from "./pages/SertifikatFormConfirm";
import SertifikatFormCreate from "./pages/SertifikatFormCreate";
import SertifikatFormEdit from "./pages/SertifikatFormEdit";
import Verifikasi from "./components/Verifikasi";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/register" element={<UsersCreate />} />
          <Route path="/users/edit/:id" element={<UsersFormEdit />} />
          <Route path="/ijazah" element={<Ijazah />} />
          <Route path="/ijazah/create" element={<IjazahFormCreate />} />
          <Route path="/ijazah/edit/:id" element={<IjazahFormEdit />} />
          <Route path="/ijazah/confirm" element={<IjazahFormConfirm />} />
          <Route path="/sertifikat" element={<Sertifikat />} />
          <Route
            path="/sertifikat/confirm"
            element={<SertifikatFormConfirm />}
          />
          <Route path="/sertifikat/create" element={<SertifikatFormCreate />} />
          <Route path="/sertifikat/edit/:id" element={<SertifikatFormEdit />} />
          <Route path="/verifikasi" element={<Verifikasi />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
