import type { Game, Player } from "../assets/types";

const API = "https://script.google.com/macros/s/AKfycbxc-HfdUzHlDRdXrHHzq2zMq9Evgr4NehcKjjbCfDjeoXja3IR5unTXjAjcwwaCI1Ro/exec"

export async function GetPlayers(game: Game, setGame: (game: Game) => void): Promise<boolean> {
    try{

        const response = await fetch(`${API}?game_id=${game.id}`); 

        if(!response.ok){
            throw new Error("fail to access api")
        }; 

        const raw: any[][] = await response.json(); 

        if(raw.length > 0){
            const players: Player[] = raw.map(
                (row) => {
                    // Create object from headers and row values
                    return ['game_id', 'date', 'name', 'score', 'latitude', 'longitude', 'uuid'].reduce((obj, header, index) => {
                        console.log(`${obj} ${header} ${index}`)
                        obj[header] = row[index];
                        return obj;
                    }, {} as any);
                }
            ).filter((p: Player) => 
                p.uuid !== game.player.uuid // Remove active player
            ).map(({ title, rows: _rows, ...rest }) => rest as Player); // Remove extra fields
            
            setGame({...game, players: players});
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