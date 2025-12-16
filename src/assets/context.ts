import { createContext } from "react";
import type { Game } from "./types";

export const GameIdCtx= createContext<string | undefined >(undefined); 
export const GameCtx = createContext<Game | undefined>(undefined); 
export const ClueIndex = createContext<number>(0); 