import { createContext } from "react";
import type { World } from "./types";

export const GameIdCtx= createContext<string | undefined >(undefined); 
export const GameCtx = createContext<World | undefined>(undefined); 
export const ClueIndex = createContext<number>(0); 