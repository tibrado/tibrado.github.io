import {/*ReportProblem,*/ QuestionAnswer, Quiz, QrCodeScanner, LocalSee} from "@mui/icons-material";
import type { Trials, InputTypes} from "../assets/types";
import { GameClue } from "../components/map/GameClue";
import BaseCard from "./BaseCard";
import { Box, Slide, Typography, IconButton } from "@mui/material";
import { useState, type ReactElement } from "react";

type Props = {
    OnSubmit: (v: boolean, p: number) => void; 
    transition: boolean;
    trial: Trials;
    path: number; 
    title: string;
}; 

const TrailCard: React.FC<Props> = ({OnSubmit, transition, title, trial, path}) => {
    const [showClue, setShowClue] = useState<boolean>(true); 

    const Icons: Record<InputTypes, ReactElement> = {
        text: <QuestionAnswer/>,
        scan: <QrCodeScanner/>,
        detect: <LocalSee/>
    };

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
                        backgroundColor: 'rgba(255, 255, 255, 0.15)', 
                        backdropFilter: 'blur(12px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(12px) saturate(180%)',
                        border: '2px solid rgba(255, 255, 255, 0.1)',
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
                            OnSubmit={OnSubmit}
                            showClue={showClue}
                            clue={trial.text[path]}
                            responses={trial.responses.map(r => r.toLocaleLowerCase())}
                            inputType={trial.inputType[path]}
                            hint={`${trial.hint[path]}`}
                        />
                    }
                    actions={
                        <Box sx={{
                            width:'100%',
                            display: 'flex',
                            gap: 1,
                            justifyContent: 'space-between'
                        }}>
                            {/*<IconButton 
                                onClick={undefined}
                                color='error'
                                size='small'
                                children={<ReportProblem/>}
                                sx={{
                                    boxShadow: '1px 1px 5px rgba(234, 139, 139, 0.7)',
                                }}
                            />*/}
                            <IconButton 
                                onClick={() => setShowClue(!showClue)}
                                color='success'
                                size='small'
                                children={ showClue ? Icons[trial.inputType[path]] : <Quiz/>}
                                sx={{
                                    bgcolor: 'success.main',
                                    color: 'white',
                                    borderRadius: '8px',
                                    padding: '8px 12px',
                                    boxShadow: '1px 1px 5px rgba(139, 234, 174, 0.7)',
                                    '&:hover': {
                                      bgcolor: 'success.dark',
                                    },
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