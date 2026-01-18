//------------------------------------------------------------------------------------------//
export type HintIconTypes = 'internet' | 'walk' | 'drive' | 'here' | 'think';
//------------------------------------CLUE OBJECT-------------------------------------------//
export type ClueObject = {
    hintIcon: HintIconTypes;
    text: string;
    hint: string;
    responses: string[];
    inputType?: InputTypes;
};

export type Location = {
    country: string;
    state: string; 
    city: string;
    address: string; 
    zip: number; 
}; 

export type Game = {
    title: string;
    date: Date;
    location?: Location; 
    clues: ClueObject[];
}; 
//------------------------------------------------------------------------------------------//
export type GameStates = 'start' | 'game' | 'victory' | 'transition' | 'loading';
//------------------------------------------------------------------------------------------//

//------------------------------------------------------------------------------------------//
export type InputTypes = 'text' | 'scan';
//------------------------------------------------------------------------------------------//

//------------------------------------------------------------------------------------------//

//------------------------------------------------------------------------------------------//