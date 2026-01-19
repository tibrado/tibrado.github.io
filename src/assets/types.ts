//------------------------------------------------------------------------------------------//
export type HintIconTypes = 'internet' | 'walk' | 'drive' | 'here' | 'think';
export type GameStates = 'start' | 'game' | 'victory' | 'transition' | 'loading';
export type InputTypes = 'text' | 'scan';
export type LocationType = 'start' | 'point';
//------------------------------------CLUE OBJECT-------------------------------------------//
export type ClueObject = {
    location: Location; 
    hintIcon: HintIconTypes;
    text: string;
    hint: string;
    responses: string[];
    inputType?: InputTypes;
    reward?: number;
};

export type Location = {
    longitude: number;
    latitude: number;
    type?: LocationType;
    detail?: string; 

}; 

export type Game = {
    title: string;
    date: Date;
    clues: ClueObject[];
}; 
//------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------//

//------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------//

//------------------------------------------------------------------------------------------//

//------------------------------------------------------------------------------------------//