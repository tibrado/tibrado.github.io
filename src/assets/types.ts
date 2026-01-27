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
    coordinates: [number, number];
    type?: LocationType;
    detail?: string; 

}; 

export type Game = {
    current: number; // current clue index
    title: string;
    date: Date;
    clues: ClueObject[];
}; 
//------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------//
export type Coordinates = {
    latitude: number; 
    longitude: number; 
    accuracy?: number; 
}; 
//------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------//

//------------------------------------------------------------------------------------------//

//------------------------------------------------------------------------------------------//