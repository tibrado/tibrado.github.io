import { Error, AddCircle, QuestionAnswer, DoneAll, QrCodeScanner, LocalSee } from '@mui/icons-material';
import {Box, Typography, Stepper,StepLabel,StepContent,Step, IconButton} from "@mui/material";
import { useWorld } from "../context";
import type { GameInfo, GameType, InputTypes, Trials } from '../assets/types';

//--------------------------------------------------------------------------------//
function GameCreationMode() {
    const { world, setWorld } = useWorld();

    if (!world) return;

    const getIcon: any = (i: number, it: InputTypes | GameType) => {
        if (i === 0) return Error;

        const Icons: Record<InputTypes | GameType, any> = {
            text: QuestionAnswer,
            scan: QrCodeScanner,
            detect: LocalSee,
            Fire: undefined,
            Water: undefined,
            Earth: undefined,
            Air: undefined,
            Spirit: undefined,
            Ether: undefined
        };

        return Icons[it]
    }

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
    };

    const handleDone = () => {
        // convert to ga
        const game = world.creationMode.data[0]; 
        
        const _info: GameInfo = {
            coord: [game!.coordinates!.latitude, game!.coordinates!.longitude],
            description: game.description ?? 'none',
            title: game.value ?? 'none',
            type: game.type as GameType
        }; 

        // Trials 
        const _trials: Trials[] = []; 
        world.creationMode.data.slice(1).map((d, _) => {
            _trials.push(
                {
                    hintIcon: ['walk'],
                    text: [d.description ?? ''],
                    hint: [''],
                    responses: [d.value ?? 'error'],
                    location: [[d.coordinates!.latitude, d.coordinates!.longitude]],
                    inputType: [d.type as InputTypes]

                }
            ); 
        }); 

        // post then clear
        handleCopy(
            `${JSON.stringify(_info)}\n\n\n${JSON.stringify(_trials)}`
        ); 

        /*
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

    const handleClick = (i: number) => {
        if (i === world.creationMode.data.length - 1){
            /*
            setSteps([
                ...steps,
                {
                    label: 'new',
                    inputType: 'text' as InputTypes,
                    description: 'none'
                }
            ]); */
            console.log('select location on map')
            setWorld(pre => ({
                ...pre,
                creationMode: {
                    ...pre.creationMode,
                    location: {
                        active: true,
                        coordinates: undefined
                    }
                }
            }));
        }  else {
            // console.log(steps)
        }
    };

    const handleCopy = async (text: string) => {
        try {
            // Use the modern asynchronous Clipboard API
            await navigator.clipboard.writeText(text);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <>
            {
                world.creationMode.active ? <>
                    <Box
                        sx={{
                            zIndex: 1,
                            position: 'absolute', // Locks it relative to the container
                            height: '90%',
                            width: '30px',
                            pointerEvents: 'auto',
                            bottom: '0px',
                            ml: '8px',
                            mb: '5px',
                            bgcolor: 'rgba(15, 142, 232, 0.15)',
                            boxShadow: '0px 1px 5px rgba(15, 142, 232, 0.71)',
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
                                            onClick={() => handleClick(i)}
                                            slots={{ stepIcon: getIcon(i, s.type) }}
                                            slotProps={{
                                                stepIcon: {
                                                    sx: {
                                                        fontSize: '30px',
                                                        color: '#d37d1b',
                                                        p: `${i == 0 ? '0' : '5'}px`,
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

                            <Step>
                                <StepLabel
                                    onClick={() => handleAdd()}
                                    slots={{ stepIcon: AddCircle }}
                                    slotProps={{
                                        stepIcon: {
                                            sx: {
                                                fontSize: '30px',
                                                color: '#d37d1b',
                                            }
                                        }
                                    }}
                                />
                            </Step>
                        </Stepper>
                    </Box>
                    <Box sx={{position: 'absolute', right: '10px', bottom: '6px'}}>
                        <IconButton
                            onClick={() => handleDone()}
                            color='success'
                            size='small'
                            children={<DoneAll sx={{ color: '#f4f5f4'}}/>}
                            sx={{
                                borderRadius: '5px',
                                boxShadow: '2px 2px 3px #02000080',
                                bgcolor: '#4caf50'
                            }}
                        /> 
                    </Box>
                </> : <></>
            }
        </>
    )
};

export default GameCreationMode;