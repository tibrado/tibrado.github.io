import type { Team } from "../assets/types";

export function setTeam(team: Team){
    localStorage.setItem('scavenger_team', JSON.stringify(team)); 
}; 

export function geTeam(): Team | null {
    const data =  localStorage.getItem('scavenger_team'); 
    return data ? JSON.parse(data) : null; 
};

export function updateTeam(){
    
}