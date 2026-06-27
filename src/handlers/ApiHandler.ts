import type { Player, Games, GameInfo, Trials, World } from "../assets/types";

const API = "https://script.google.com/macros/s/AKfycbwKSyiEJjPm5TIU_JmgQdMFBB9sOPQGUGlNsfGrbG2ig-kh4OJ7_j_HsonZT_63U7rp/exec"; 
const FEEDBACK_API = "https://script.google.com/macros/s/AKfycby7rRHQ-nFOTnz-wZku7o4SBV-AQMWmUqpwOcIV_2mxy2qcOiywKLXwf-qKh_jISiDS/exec"; 
const GAMES_API = "https://raw.githubusercontent.com/tibrado/regnevacs/refs/heads/main/games.json"; 
const TRIAL_API = "https://raw.githubusercontent.com/tibrado/regnevacs/refs/heads/main/"; 

export async function GetPlayers(world: World, setWorld: Function): Promise<boolean> {
    try{
        const response = await fetch(`${API}?game_id=${world.id}`); 

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

        const response = await fetch(API, {
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

export async function LoadGames(setWorld: Function): Promise<boolean>{
    try{
        const response = await fetch(GAMES_API); 
        
        if(!response.ok){
            throw new Error("fail to load games")
        }; 
        
        const raw: any = await response.json(); 
        const hunts = Array.isArray(raw.hunts) ? raw.hunts : []; 

        const games: Games = {
            ...(raw as Partial<Games>),
            hunts: hunts.map((r: GameInfo) => ({
                    coord: r.coord,
                    description: r.description,
                    title: r.title,
                    type: r.type
                })
            )
        };  
        
        setWorld((pre: World) => ({
            ...pre,
            games: games,
            paths: [0]
        })); 

        return true; 
    } catch (e) {
        throw new Error(`Fail to get player: ${e}`); 
    }

}; 

export async function LoadTrial(setWorld: Function, gameInfo: GameInfo, FocusOnPin: (lng: number, lat: number, zoom_offset: number) => void): Promise<boolean>{
    try{
        const id = `${gameInfo.coord}`.replace(',', ''); 
        const response = await fetch(`${TRIAL_API}${id}.json`); 
        
        if(!response.ok){
            throw new Error("did not find trial")
        }; 
        
        const raw: any = await response.json(); 
        const _trails: Trials[] = Array.isArray(raw.clues)
            ? raw.clues.map((c: any) => ({
                hintIcon: c.hintIcon,
                hint: c.hint,
                text: c.text,
                responses: c.responses,
                inputType: c.inputType,
                location: c.location
            })) : []; 
            
        setWorld((pre: World) => ({
            ...pre,
            id: id,
            trials: _trails,
            title: gameInfo.title,
            gameType: gameInfo.type,
            paths: [0],
            player: {
                ...pre.player,
                game_id: id
            },
            selected: {
                mode: 'trial',
                index: 0,
                path: 0
            }
        })); 

        // Fly to first pin 
        const loc = _trails[0].location[0]; 
        FocusOnPin(loc[1], loc[0], 1.5); 

        return true; 
    } catch (e) {
        throw new Error(`fail to load trail: ${e}`); 
    }    
}; 

export async function PostFeedback(feedback: string, rating: number): Promise<string | undefined> {
    try{

        const response = await fetch(FEEDBACK_API, {
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