import type { Trials, GameInfo } from "../assets/types";

/*
Tutorial 
1. How to be a scavenger. Welcome to the tutorial, this will help you under stand the fine details about being a scavenger. If you accept this quest you will learn the simple skills nesscary to become a scavenger.
2. I see you have decided to take on the challenge and become a part time scavenger. There are 3 input options that will be avalible to you. 1. Input Text, 2. QR Code Scanning & 3. Object Recognition.
3. Some locations are goe lock and you will need to be with the search are to gain access to the clue. Scan any object to solve this clue, and processed to the 

*/


export const GetTutorialGameInfo = (lat: number, lng: number): GameInfo => {
    
    return {
        coord: [lat, lng],
        description: `Imagine Pokémon GO, but instead of catching digital monsters, you are hunting for real-world items, secret codes, and hidden answers. **Scavenger HQ** turns your entire neighborhood into a giant treasure hunt. To play, you will use your phone to solve riddles and find items in three cool ways.`,
        title: "I Want to Scavenger!",
        type: "Fire"
    } as GameInfo; 
}; 


export const GetTrials = (location: [number, number]): Trials[] => {
    
    return [
        {
            hintIcon: ["here"],
            inputType: ["text"],
            hint: [`Typing Clues (Text Input)`],
            text: [`Sometimes, the game will give you a riddle. You have to type the exact answer to unlock the next level. Select the chat icon 🗪 on the bottom left and type **yes** to proceed to the next clue.`],
            responses: ["yes"],
            location: [location]
        }, 
        {
            hintIcon: ["here"],
            inputType: ["scan"],
            hint: ["Scanning Secret Codes (QR Codes)"],
            text: [`*Congratulation you have earned some points*. \n\n High-tech treasure hunters look for QR codes. These look like pixelated square stickers hidden on park benches, trees, or signposts. Select the QR icon 𖣯 on the bottom left and scan any **QR Codes** near you.`],
            responses: ["-"],
            location: [location]
        }, 
        {
            hintIcon: ["here"],
            inputType: ["detect"],
            hint: ["Finding Real Objects (Object Detection)"],
            text: [`This is where the game gets magical. The game uses your camera like artificial intelligence "eyes" to recognize real-world objects.`],
            responses: ["-"],
            location: [location]
        }, 
    ] as Trials[];
}