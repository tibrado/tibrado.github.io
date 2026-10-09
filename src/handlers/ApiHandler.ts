import type { Player, GameData, ObjectiveData, World, LatLng } from "../assets/types";
import { v4 as uuid } from 'uuid';

const APIs: Record<string, string> = {
    'GAME': 'https://script.google.com/macros/s/AKfycbzQnicq4YKQrpcaHB0M8LhmyvU_UCeg25uoTMXNgB5c67JUmmMU9iTCqUxzlVrtuv5zoA/exec',
    'FEEDBACK': 'https://script.google.com/macros/s/AKfycby7rRHQ-nFOTnz-wZku7o4SBV-AQMWmUqpwOcIV_2mxy2qcOiywKLXwf-qKh_jISiDS/exec',
    'PLAYER': 'https://script.google.com/macros/s/AKfycbwKSyiEJjPm5TIU_JmgQdMFBB9sOPQGUGlNsfGrbG2ig-kh4OJ7_j_HsonZT_63U7rp/exec'
};

export async function GetPlayers(world: World, setWorld: Function): Promise<boolean> {
    try{
        const response = await fetch(`${APIs.PLAYER}?game_id=${world.uuid}`); 

        if(!response.ok){
            throw new Error("fail to access api")
        }; 

        const raw: any[][] = await response.json(); 

        if(raw.length > 0){
            const players: Player[] = raw.map(
                (row) => {
                    // Create object from headers and row values
                    return ['game_id', 'date', 'name', 'score', 'lat', 'lng', 'uuid', 'icon'].reduce((obj, header, index) => {
                        obj[header] = row[index];
                        return obj;
                    }, {} as any);
                }
            ).filter((p: Player) => 
                p.uuid !== world.player.uuid // Remove active player
            ).map(({ title, rows: _rows, ...rest }) => rest as Player); // Remove extra fields
            
            setWorld((pre: World) => ({...pre, players: players}));
            return true; 
        }; 

        return false; 
    } catch (e) {
        //return undefined; 
        throw new Error(`Fail to get player: ${e}`); 
    }
}; 

export async function PostPlayer(player: Player): Promise<string | undefined> {
    try{
        const response = await fetch(APIs.PLAYER, {
            method: 'POST',
            body: JSON.stringify(player)
        }); 
        if(!response.ok){
            throw new Error("fail to post score")
        }; 
        
        return undefined; 
    } catch (e) {
        throw new Error(`Fail to get player: ${e}`); 
    }
}; 

export async function PostFeedback(feedback: string, rating: number): Promise<string | undefined> {
    try{

        const response = await fetch(APIs.FEEDBACK, {
            method: 'POST',
            body: JSON.stringify({
                feedback: feedback,
                rating: rating
            })
        }); 
        if(!response.ok){
            throw new Error("fail to post score")
        }; 
        
        return undefined; 
    } catch (e) {
        throw new Error(`Fail to get player: ${e}`); 
    }
}; 

// Google Sheets -> Get Objectives 
export async function GetObjectives(setWorld: Function, game: GameData, objectives: ObjectiveData[], FocusOnPin: (lng: number, lat: number, zoom_offset: number) => void): Promise<boolean> {
    // try {
        let data: ObjectiveData[] = [];

        if (game.uuid == 'tutorial') {
            data = objectives;
        }
        else {
            const response = await fetch(`${APIs.GAME}?what=${'objective'}&uuid=${game.uuid}`);
            
            if (!response.ok) {
                throw new Error(`Fail to load games data`);
            };

            const raw: any = await response.json();

            data = Array.isArray(raw) ? raw as ObjectiveData[] : [];

        };

        setWorld((pre: World) => ({
            ...pre,
            id: game.uuid,
            objectives: data,
            title: game.title,
            gameType: game.type,
            paths: [0],
            player: {
                ...pre.player,
                game_id: game.uuid
            },
            selected: {
                mode: 'trial',
                index: 0,
                path: 0
            }
        }));

        const loc: LatLng = objectives[0].location[0];
        FocusOnPin(loc.longitude, loc.latitude, 1.5);

        return true;
    /*} catch (e) {
        throw new Error(`Fail to get player: ${e}`);
    }*/
};
export async function GetGames(setWorld: Function, tutorial: GameData, location: LatLng): Promise<boolean> {
    try {
        // fetch(`${API}?game_id=${world.id}`)
        const response = await fetch(`${APIs.GAME}?type=${'game'}&location=${location}`);

        if (!response.ok) {
            throw new Error(`Fail to load games data`); 
        };

        const raw: any = await response.json();
        const data = Array.isArray(raw) ? raw as GameData[]: [];

        setWorld((pre: World) => ({
            ...pre,
            games: [...[tutorial], ...data],
            paths: [0]
        })); 
        
        return true;
    } catch (e) {
        throw new Error(`Fail to get player: ${e}`);
    }
};
export async function PostGame(gameData: GameData, objectiveData: ObjectiveData[]): Promise<string | undefined> {
    try {
        gameData.uuid = uuid();

        const response = await fetch(APIs.GAME, {
            method: 'POST',
            body: JSON.stringify({
                game: gameData,
                objectives: objectiveData
            })
        });
        console.log("Done --> ", response); 
        if (!response.ok) {
            throw new Error("fail to post score")
        };

        return undefined;
    } catch (e) {
        throw new Error(`Post Game: ${e}`);
    }
};