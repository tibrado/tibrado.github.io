import type { World, Player, Games, GameInfo, Trials } from "../assets/types";

const API = "https://script.google.com/macros/s/AKfycbxtZho5mvTwgZ6ifc3wROu5krIMctQDlYD1gyFSFia7PZInZX4NmmgVZKMD26QyG2Nm/exec"; 
const GAMES_API = "https://raw.githubusercontent.com/tibrado/regnevacs/refs/heads/main/games.json"; 
const TRIAL_API = "https://raw.githubusercontent.com/tibrado/regnevacs/refs/heads/main/"; 

export async function GetPlayers(world: World, setWorld: (world: World) => void): Promise<boolean> {
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
                    return ['game_id', 'date', 'name', 'score', 'latitude', 'longitude', 'uuid', 'icon'].reduce((obj, header, index) => {
                        console.log(`${obj} ${header} ${index}`)
                        obj[header] = row[index];
                        return obj;
                    }, {} as any);
                }
            ).filter((p: Player) => 
                p.uuid !== world.player.uuid // Remove active player
            ).map(({ title, rows: _rows, ...rest }) => rest as Player); // Remove extra fields
            
            setWorld({...world, players: players});
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
        
        console.log(`API Response: ${response.ok}`); 
        return undefined; 
    } catch (e) {
        throw new Error(`Fail to get player: ${e}`); 
    }
}; 

export async function LoadGames(world: World, setWorld: (world: World) => void): Promise<boolean>{
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
                    latitude: r.latitude, 
                    longitude: r.longitude,
                    description: r.description
                })
            )
        };  

        setWorld({
            ...world,
            statue: hunts.length > 0 ? 'game' : 'loading',
            games
        }); 

        return true; 
    } catch (e) {
        throw new Error(`Fail to get player: ${e}`); 
    }

}; 

export async function LoadTrial(world: World, setWorld: (world: World) => void, id: string): Promise<boolean>{
    try{
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

        setWorld({
            ...world,
            id: id,
            trials: _trails,
            player: {
                ...world.player,
                game_id: id
            }
        }); 

        return true; 
    } catch (e) {
        throw new Error(`fail to load trail: ${e}`); 
    }    
}; 