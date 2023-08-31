import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./components/Login";
import Users from "./pages/Users";
import UsersCreate from "./components/Register";
import UsersFormEdit from "./pages/UsersFormEdit";
import Siswa from "./pages/siswa/Siswa";
import SiswaFormCreate from "./pages/siswa/SiswaFormCreate";
import SiswaFormEdit from "./pages/siswa/SiswaFormEdit";
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
          <Route path="/pengguna" element={<Users />} />
          <Route path="/register" element={<UsersCreate />} />
          <Route path="/pengguna/ubah/:id" element={<UsersFormEdit />} />
          <Route path="/siswa" element={<Siswa />} />
          <Route path="/siswa/tambah" element={<SiswaFormCreate />} />
          <Route path="/siswa/ubah/:id" element={<SiswaFormEdit />} />
          <Route path="/ijazah" element={<Ijazah />} />
          <Route path="/ijazah/arsipkan" element={<IjazahFormCreate />} />
          <Route path="/ijazah/ubah/:id" element={<IjazahFormEdit />} />
          <Route path="/ijazah/konfirmasi" element={<IjazahFormConfirm />} />
          <Route path="/ijazah/tolak" element={<IjazahFormRejected />} />
          <Route path="/sertifikat" element={<Sertifikat />} />
          <Route path="/sertifikat/arsipkan" element={<SertifikatFormCreate />} />
          <Route path="/sertifikat/ubah/:id" element={<SertifikatFormEdit />} />
          <Route path="/sertifikat/konfirmasi" element={<SertifikatFormConfirm />} />
          <Route path="/sertifikat/tolak" element={<SertifikatFormRejected />}/>
          <Route path="/verifikasi" element={<Verifikasi />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
