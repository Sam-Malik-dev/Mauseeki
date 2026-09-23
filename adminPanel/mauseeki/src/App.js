import './App.css';
import {BrowserRouter ,Routes, Route} from 'react-router-dom';
import Login from './Components/AdminLogin/Login';
import AdminLayout from './Components/AdminLayout/AdminLayout';
import Dashboard from './Components/DashBoard/Dashboard'
import Songs from './Components/AdminSongs.jsx/Songs';
import AdminArtists from './Components/AdminArtists/AdminArtists';
import AdminAlbum from './Components/AdminAlbum/AdminAlbum'
import AdminUsers from './Components/AdminUsers/AdminUsers';
import Messages from './Components/Messages/Messages';
function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route element={<AdminLayout />}>

                    <Route path="/" element={<Dashboard />} />
                    <Route path="/songs" element={<Songs />} />
                    <Route path="/artists" element={<AdminArtists />} />
                    <Route path="/albums" element={<AdminAlbum />} />
                    <Route path="/users" element={<AdminUsers />} />
                    <Route path="/messages" element={<Messages />} />

                </Route>
      </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
