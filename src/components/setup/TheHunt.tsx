
import type { Game } from '../../assets/types';
import { v4 as uuid } from 'uuid';

export async function GetGame(id: string): Promise<Game | undefined> {
    try{
        const response = await fetch(`https://raw.githubusercontent.com/tibrado/regnevacs/refs/heads/main/${id}.json`);
        if(!response.ok){
            throw new Error("none");
        }; 

        const raw: any = await response.json(); 

        const game: Game = {
            ...(raw as Partial<Game>),
            id: id, 
            current: 0,
            statue: 'game',
            title: raw.title,
            date: raw.date ? new Date(raw.date) : new Date(),
            clues: Array.isArray(raw.clues)
                ? raw.clues.map((c: any) => ({
                    hintIcon: c.hintIcon,
                    hint: c.hint,
                    text: c.text,
                    responses: c.responses,
                    inputType: c.inputType,
                    location: c.location
                }))
                : [],
            gameTime: 0,
            player: {game_id: id, date: new Date(Date.now()), uuid: uuid(), name: 'Player', score: 0, latitude: 0, longitude: 0},
            players: []
        };
        // "game_id","date","name","score","lat","long","uuid"
        // Load leader board for that game 
        console.log(JSON.stringify(game.player))
        return game; 

    } catch(e) {
        throw new Error(`fail to get game: ${e}`);
        
    }; 
}; 
