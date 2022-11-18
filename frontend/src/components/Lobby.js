import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import TeamSelect from './TeamSelect';
import TargetSelect from './TargetSelect';
import Game from './Game';

function Lobby() {
    const { lobbyID } = useParams();
    const { token } = useAuth();
    const [gameState, setGameState] = useState('teamSelect');
    const [team1, setTeam1] = useState([]);
    const [team2, setTeam2] = useState([]);
    const [targets, setTargets] = useState([]);
    const [points, setPoints] = useState([0, 0]);

    console.log(lobbyID);

    const getLobby = async () => {
        try {
            const response = await fetch('http://'+window.location.hostname+':8080/gameModel/'+lobbyID, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
            }).then(data => data.json());
            // Need: lobby DNE error code, no permission error code, success code
            // Set gameState: teamSelect, targetSelect, inProgress
            setGameState(response?.data?.status);
            setTeam1(response?.data?.team1);
            setTeam2(response?.data?.team2);
            setTargets(response?.data?.objects);
            //setPoints(response?.data?.points);
        }
        catch (e) {
            console.log('Fetch lobby failed: ' + e);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            getLobby();
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // TODO: Lobby logic (@BACKEND)
    // If lobby does not exist, return lobby DNE error code. 
    // Frontend can diplay alert: Lobby not found.
    // Otherwise if gameState=="teamSelect", add user to lobby and return success code and current gameState ("teamSelect")
    // Frontend will display the TeamScreen
    // Otherwise, (in target select or game in progress) if user not in lobby, return no permissions error code. 
    // Frontend will redirect back to home screen. Maybe display alert: Game already started.
    // Otherwise, return success code and current gameState ("targetSelect" or "inProgress")
    // Frontend will display the proper screen

    return (
        gameState === 'teamSelect' ? <TeamSelect lobbyID={lobbyID} team1={team1} team2={team2}></TeamSelect> :
        gameState === 'targetSelect' ? <TargetSelect lobbyID={lobbyID} targets={targets}></TargetSelect> : <Game points={points}></Game>
    );
}

export default Lobby