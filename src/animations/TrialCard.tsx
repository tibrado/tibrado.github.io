import {ReportProblem, QuestionAnswer, Quiz } from "@mui/icons-material";
import type { Trials} from "../assets/types";
import { GameClue } from "../components/map/GameClue";
import BaseCard from "./BaseCard";
import { Box, Slide, Typography, IconButton } from "@mui/material";
// import { blue, red } from '@mui/material/colors';
import { useState } from "react";

type Props = {
    transition: boolean;
    trial: Trials;
    path: number; 
    title: string;
    ValidateResponse: (v: string) => void;
    invalidResponse: boolean;
}; 

const TrailCard: React.FC<Props> = ({transition, title, trial, path, invalidResponse, ValidateResponse}) => {
    const [showClue, setShowClue] = useState<boolean>(true); 
    return (
        <Slide direction={transition ? 'right' : 'left'} in={transition} mountOnEnter unmountOnExit>
            <Box>
                <BaseCard
                    style={{
                        width: '250px',
                        height: '350px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 1,
                        borderRadius: '5px',
                        // 1. Semi-transparent background
                        backgroundColor: 'rgba(255, 255, 255, 0.15)', 
                        // 2. The "Frosted" effect
                        backdropFilter: 'blur(12px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(12px) saturate(180%)', // Safari support
                        // 3. Subtle border to define the edges
                        border: '2px solid rgba(255, 255, 255, 0.1)',
                        // 4. Soft shadow for depth
                        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
                        color: '#000000ff',
                    }}

                    header={
                        <Typography 
                            sx={{
                                color: '#000000ff',
                                alignContent: 'center',
                                fontFamily: 'system-ui',
                                fontSize: '15px',
                                fontWeight: 'bold',
                                textShadow: '1px 1px 3px rgba(25, 23, 23, 0.7)'
                            }}
                        >{title}
                        </Typography>
                    }
                    subheader={
                        <Typography 
                            sx={{
                                color: '#757575ff',
                                alignContent: 'center',
                                fontFamily: 'system-ui',
                                fontSize: '12px',
                                pl: '10px'
                            }}
                        >{trial.hint[path]}</Typography>
                    }
                    content={
                        <GameClue 
                            showClue={showClue}
                            clue={trial.text[path]}
                            validateResponse={ValidateResponse} 
                            inputType={trial?.inputType[path]}
                            hint={`${trial.hint[path]}`}
                            nope={invalidResponse}
                        />
                    }
                    actions={
                        <Box sx={{
                            width:'100%',
                            display: 'flex',
                            gap: 1,
                            justifyContent: 'space-between'
                        }}>
                            <IconButton 
                                onClick={undefined}
                                color='error'
                                size='small'
                                children={<ReportProblem/>}
                                sx={{
                                    boxShadow: '1px 1px 5px rgba(234, 139, 139, 0.7)',
                                }}
                            />
                            <IconButton 
                                onClick={() => setShowClue(!showClue)}
                                color='success'
                                size='small'
                                children={ showClue ? <QuestionAnswer /> : <Quiz/>}
                                sx={{
                                    boxShadow: '1px 1px 5px rgba(139, 234, 174, 0.7)',
                                }}
                            />

                        </Box>
                    }
                />
            </Box>
        </Slide>
    ); 
}; 

export default TrailCard; 