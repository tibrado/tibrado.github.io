import type { ObjectiveData, GameData, LatLng } from "../assets/types";

/*
Tutorial 
1. How to be a scavenger. Welcome to the tutorial, this will help you under stand the fine details about being a scavenger. If you accept this quest you will learn the simple skills nesscary to become a scavenger.
2. I see you have decided to take on the challenge and become a part time scavenger. There are 3 input options that will be avalible to you. 1. Input Text, 2. QR Code Scanning & 3. Object Recognition.
3. Some locations are goe lock and you will need to be with the search are to gain access to the clue. Scan any object to solve this clue, and processed to the 

*/


export const GetTutorialGameInfo = (lat: number, lng: number): GameData => {
    
    return {
        uuid: 'tutorial',
        location: {
            latitude: lat, 
            longitude: lng
        },
        description: `Imagine Pokémon GO, but instead of catching digital monsters, you are hunting for real-world items, secret codes, and hidden answers. **Scavenger HQ** turns your entire neighborhood into a giant treasure hunt. To play, you will use your phone to solve riddles and find items in three cool ways.`,
        title: "I Want to Scavenger!",
        type: "scavenger_hunt"
    } as GameData; 
}; 


export const GetTrials = (location: LatLng): ObjectiveData[] => {
    return [
        {
            inputType: ["text"],
            hint: [`Typing Clues (Text Input)`],
            clue: [`Sometimes, the game will give you a riddle. You have to type the exact answer to unlock the next level. Select the chat icon 🗪 on the bottom left and type **yes** to proceed to the next clue.`],
            solution: ["yes"],
            location: [location]
        }, 
        {
            inputType: ["scan"],
            hint: ["Scanning Secret Codes (QR Codes)"],
            clue: [`*Congratulation you have earned some points*. \n\n High-tech treasure hunters look for QR codes. These look like pixelated square stickers hidden on park benches, trees, or signposts. Select the QR icon 𖣯 on the bottom left and scan any **QR Codes** near you.`],
            solution: ["-"],
            location: [location]
        }, 
        {
            inputType: ["detect"],
            hint: ["Finding Real Objects (Object Detection)"],
            clue: [`This is where the game gets magical. The game uses your camera like artificial intelligence "eyes" to recognize real-world objects.`],
            solution: ["-"],
            location: [location]
        }, 
    ] as ObjectiveData[];
}