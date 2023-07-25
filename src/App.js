import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./components/Login";
import Users from "./pages/Users";
import UsersFormEdit from "./pages/UsersFormEdit";
import UsersFormCreate from "./pages/UsersFormCreate";
import Ijazah from "./pages/Ijazah";
import IjazahFormEdit from "./pages/IjazahFormEdit";
import IjazahFormCreate from "./pages/IjazahFormCreate";
import Sertifikat from "./pages/Sertifikat";
import SertifikatFormCreate from "./pages/SertifikatFormCreate";
import SertifikatFormEdit from "./pages/SertifikatFormEdit";
import Siswa from "./pages/Siswa";
import SiswaFormCreate from "./pages/SiswaFormCreate";
import SiswaFormEdit from "./pages/SiswaFormEdit";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/create" element={<UsersFormCreate />} />
          <Route path="/users/edit/:id" element={<UsersFormEdit />} />
          <Route path="/ijazah" element={<Ijazah />} />
          <Route path="/ijazah/create" element={<IjazahFormCreate />} />
          <Route path="/ijazah/edit/:id" element={<IjazahFormEdit />} />
          <Route path="/sertifikat" element={<Sertifikat />} />
          <Route path="/sertifikat/create" element={<SertifikatFormCreate />} />
          <Route path="/sertifikat/edit/:id" element={<SertifikatFormEdit />} />
          <Route path="/siswa" element={<Siswa />} />
          <Route path="/siswa/create" element={<SiswaFormCreate /> } />
          <Route path="/siswa/edit/:id" element={<SiswaFormEdit /> } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
