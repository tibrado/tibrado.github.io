
import type { Game } from '../../assets/types';

export async function GetGame(id: string): Promise<Game | undefined> {
    try{
        const response = await fetch(`https://raw.githubusercontent.com/tibrado/regnevacs/refs/heads/main/${id}.json`);
        if(!response.ok){
            throw new Error("none");
        }; 

        const raw: any = await response.json(); 
        console.log('here: ', raw); 
        const game: Game = {
            ...(raw as Partial<Game>),
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
        };
    
        return game; 

    } catch(e) {
        throw new Error(`fail to get game: ${e}`);
        
    }; 
}; 
