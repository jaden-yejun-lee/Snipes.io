import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import Lobby from './Lobby';
import RequireAuth from './RequireAuth';
import Profile from './Profile';
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Navigate to="/home" />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route element={<RequireAuth />}>
                    <Route path='/home' element={<Home />} />
                </Route>
                <Route element={<RequireAuth />}>
                    <Route path='/lobby/:lobbyID' element={<Lobby />} />
                </Route>
                <Route element={<RequireAuth />}>
                    <Route path='/profile' element={<Profile />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
