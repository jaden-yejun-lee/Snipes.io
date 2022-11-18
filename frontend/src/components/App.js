import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import Lobby from './Lobby';
import RequireAuth from './RequireAuth';
import Upload from './Upload';
import KillFeed from './KillFeed';
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
                    <Route path='/lobby/:lobbyID' element={<Lobby />}>
                        <Route path='upload' element={<Upload />} />
                        <Route path='killFeed' element={<KillFeed />} />
                    </Route>
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
