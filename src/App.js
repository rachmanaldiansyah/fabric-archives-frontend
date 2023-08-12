import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./components/Login";
import Users from "./pages/Users";
import UsersCreate from "./components/Register";
import UsersFormEdit from "./pages/UsersFormEdit";
import Ijazah from "./pages/ijazah/Ijazah";
import IjazahFormConfirm from "./pages/ijazah/IjazahFormConfirm";
import IjazahFormEdit from "./pages/ijazah/IjazahFormEdit";
import IjazahFormCreate from "./pages/ijazah/IjazahFormCreate";
import IjazahFormRejected from "./pages/ijazah/IjazahFormRejected";
import Sertifikat from "./pages/sertifikat/Sertifikat";
import SertifikatFormConfirm from "./pages/sertifikat/SertifikatFormConfirm";
import SertifikatFormCreate from "./pages/sertifikat/SertifikatFormCreate";
import SertifikatFormEdit from "./pages/sertifikat/SertifikatFormEdit";
import SertifikatFormRejected from "./pages/sertifikat/SertifikatFormRejected";
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
          <Route path="/ijazah/arsipkan" element={<IjazahFormCreate />} />
          <Route path="/ijazah/edit/:id" element={<IjazahFormEdit />} />
          <Route path="/ijazah/confirm" element={<IjazahFormConfirm />} />
          <Route path="/ijazah/rejected" element={<IjazahFormRejected />} />
          <Route path="/sertifikat" element={<Sertifikat />} />
          <Route path="/sertifikat/arsipkan" element={<SertifikatFormCreate />} />
          <Route path="/sertifikat/edit/:id" element={<SertifikatFormEdit />} />
          <Route path="/sertifikat/confirm" element={<SertifikatFormConfirm />} />
          <Route path="/sertifikat/rejected" element={<SertifikatFormRejected />}/>
          <Route path="/verifikasi" element={<Verifikasi />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
