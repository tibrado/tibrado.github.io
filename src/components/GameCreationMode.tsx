import { Error, AddCircle, QuestionAnswer, DoneAll, QrCodeScanner, LocalSee } from '@mui/icons-material';
import {Box, Typography, Stepper,StepLabel,StepContent,Step, IconButton} from "@mui/material";
import { useWorld } from "../context";
import { type GameData, type GameType, type InputTypes, type ObjectiveData, Color } from '../assets/types';
import { Notification } from './helpers/Notification';
import { useState } from 'react';
import { PostGame } from '../handlers/ApiHandler';
//--------------------------------------------------------------------------------//

function GameCreationMode() {
    const { world, setWorld } = useWorld();

    if (!world) return;

    const [openAlert, setOpenAlert] = useState<boolean>(false); 

    const getIcon: any = (i: number, it: InputTypes | GameType) => {
        if (i === 0) return Error;

        const Icons: Record<InputTypes | GameType, any> = {
            text: QuestionAnswer,
            scan: QrCodeScanner,
            detect: LocalSee,
            scavenger_hunt: undefined,
            murder_mystery: undefined,
        };

        return Icons[it]
    };

    const handleAdd = () => {
        setWorld(pre => ({
            ...pre,
            creationMode: {
                ...pre.creationMode,
                location: {
                    active: true
                }
            }
        }));

        setOpenAlert(true); 
    };

    const handleDone = () => {
        // convert to ga
        const data = world.creationMode.data[0]; 
        const game: GameData = {
            uuid: 'none',
            location: data.coordinates!,
            description: data.description ?? 'none',
            title: data.value ?? 'none',
            type: data.type as GameType
        }; 

        // Objective
        const objectives: ObjectiveData[] = []; 
        world.creationMode.data.slice(1).map((d, _) => {
            objectives.push(
                {
                    clue: [d.description ?? ''],
                    hint: [''],
                    solution: [d.value ?? 'error'],
                    location: [d.coordinates!],
                    inputType: [d.type as InputTypes]

                }
            ); 
        }); 

        // post then clear
        PostGame(game, objectives); 
        /*
        handleCopy(
            `${JSON.stringify(_info)}\n\n\n${JSON.stringify(objectives)}`
        ); 

    
        setWorld(pre => ({
            ...pre,
            creationMode: {
                ...pre.creationMode,
                active: false,
                data: [],
                location: {
                    coordinates: undefined,
                    active: false
                }
            }
        }));
        */
    }; 

    const onSelect = (i: number) => {
        setWorld(pre => ({
            ...pre,
            creationMode: {
                ...pre.creationMode,
                edit: i
            }
        }));
    };

    return (
        <>
            {
                world.creationMode.active ? <>
                    <Notification 
                        open={openAlert} 
                        setOpen={setOpenAlert} 
                        msg={'select location on map to place pin'}
                        variant={'filled'}
                        severity={'error'}
                    />
                    <Box
                        sx={{
                            zIndex: 1,
                            position: 'absolute', // Locks it relative to the container
                            height: '80%',
                            width: '30px',
                            pointerEvents: 'auto',
                            bottom: '10%',
                            ml: '8px',
                            mb: '5px',

                            // 1. Semi-transparent background
                            backgroundColor: 'rgba(255, 255, 255, 0.26)',

                            // 2. The "Frosted" effect
                            backdropFilter: 'blur(12px) saturate(180%)',
                            WebkitBackdropFilter: 'blur(12px) saturate(180%)', // Safari support
                            boxShadow: `0px 0px 2px ${Color.red}`,
                            borderRadius: '5px',
                            overflowY: 'auto',
                            // --- Cross-Browser Scrollbar Hiding ---
                            scrollbarWidth: 'none',          // Firefox
                            '&::-webkit-scrollbar': {
                                display: 'none',             // DuckDuckGo, Chrome, Safari, Opera
                                width: 0,                    // Fallback force-hide
                                height: 0,
                            },
                        }}
                    >
                        <Stepper activeStep={undefined} orientation="vertical">

                            {
                                world.creationMode.data.map((s, i) => (
                                    <Step key={`step_${i}`}>
                                        <StepLabel
                                            onClick={() => onSelect(i)}
                                            slots={{ stepIcon: getIcon(i, s.type) }}
                                            slotProps={{
                                                stepIcon: {
                                                    sx: {
                                                        fontSize: '30px',
                                                        color: '#d37d1b',
                                                        p: `${i == 0 || i == world.creationMode.data.length - 1 ? '0' : '5'}px`,
                                                    }
                                                }
                                            }}
                                        >
                                            { }
                                        </StepLabel>
                                        <StepContent sx={{ textAlign: 'left' }}>
                                            <Typography></Typography>
                                        </StepContent>

                                    </Step>
                                ))
                            }
                        </Stepper>
                    </Box>
                    <Box sx={{position: 'absolute', right: '10px', bottom: '6px'}}>
                        <IconButton
                            onClick={() => handleAdd()}
                            color='success'
                            size='small'
                            disabled={world.creationMode.location.active}
                            children={<AddCircle sx={{ color: '#f4f5f4'}}/>}
                            sx={{
                                borderRadius: '5px',
                                boxShadow: '2px 2px 3px #02000080',
                                bgcolor: Color.blue
                            }}
                        /> 
                    </Box>

                    <Box sx={{ position: 'absolute', left: '5px', bottom: '6px' }}>
                        <IconButton
                            title='yes'
                            onClick={() => handleDone()}
                            color='success'
                            size='small'
                            disabled={world.creationMode.location.active}
                            children={<DoneAll 
                                sx={{ color: '#f4f5f4' }} 
                            />}
                            sx={{
                                borderRadius: '5px',
                                boxShadow: '2px 2px 3px #02000080',
                                bgcolor: Color.green
                            }}
                        />
                    </Box>
                </> : <></>
            }
        </>
    ); 
};

export default GameCreationMode;