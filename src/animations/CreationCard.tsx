import { CheckCircle, QuestionAnswer, QrCodeScanner, LocalSee, Close } from "@mui/icons-material";
import type { GameType, InputTypes} from "../assets/types";
import BaseCard from "./BaseCard";
import {
    IconButton, Typography, Zoom, Box, Grid, TextField,
    FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import { useEffect, useState, type ReactElement } from "react";
import QRScanner from "../components/inputs/QRScanner";
import { useWorld } from "../context";


type Props = {
    transition: boolean;
    close: () => void;
};

const CreationCard: React.FC<Props> = ({ transition, close }) => {
    const {world, setWorld } = useWorld();
        
    const [description, setDescription] = useState<string | undefined>();
    const [value, setValue] = useState<string | undefined>();
    const [typeValue, setTypeValue] = useState < InputTypes | GameType | undefined>();
    
    const [openInput, setOpenInput] = useState<boolean>(false);

    const valid = (): boolean => {
        return value == undefined || description == undefined || typeValue == undefined;
    };

    const save = () => {
        if(!valid()){
            setWorld(pre => (
                {   
                    ...pre, 
                    creationMode: {
                        ...pre.creationMode,
                        data: [
                            ...pre.creationMode.data, 
                            {
                                value: value,
                                description: description,
                                type: typeValue,
                                coordinates: world.creationMode.location.coordinates
                            }
                        ]
                    }
                }
            ));
            close(); 
        }; 
    }; 

    useEffect(() => {
        if(value != undefined){
            setOpenInput(false)
        }
    }, [value]); 


    const startContentForm = () => {
        const [iconSelected, setIconSelected] = useState<number>(0);
        // Handle Icons
        /*
        const Icons: Record<GameType, any> = {
            Earth: undefined,
            Fire: undefined,
            Water: undefined,
            Air: undefined,
            Spirit: undefined,
            Ether: undefined
        };
        */

        const iconOptions: GameType[] = ['Air', 'Earth', 'Water', 'Fire', 'Ether', 'Spirit'];


        return (
            <Box sx={{ flexFlow: 1, width: '100%' }}>
                <Grid container columnSpacing={3} sx={{ bgcolor: 'transparent' }}>
                    <Grid size={12} sx={{ m: '2px', pt: '10px' }}>
                        <TextField size="small" label="Game Title" variant="outlined" fullWidth onChange={(e) => setValue(e.target.value)}/>
                    </Grid>
                    <Grid size={12} sx={{ m: '2px', pt: '10px' }}>
                        <TextField size='small' label="Description" variant="outlined" multiline rows={4} fullWidth onChange={(e) => setDescription(e.target.value)} />
                    </Grid>
                    <Grid size={12} sx={{ m: '2px', height: '50px', pt: '10px' }}>
                        <FormControl size='small' fullWidth>
                            <InputLabel>Reward</InputLabel>
                            <Select
                                value={iconSelected}
                                label="Reward"
                                onChange={(e) => {
                                    setIconSelected(e.target.value); 
                                    setTypeValue(iconOptions[e.target.value]); 
                                }}
                            >
                                {
                                    [...iconOptions, ' other'].map((io, i) => {
                                        return (
                                            <MenuItem value={i}>
                                                {io}
                                            </MenuItem>
                                        ); 
                                    })
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Box>
        );
    };


    const clueContentForm = () => {
        const [select, setSelected] = useState<number>(0);

        const icons: Record<InputTypes, ReactElement> = {
            text: <QuestionAnswer/>,
            scan: <QrCodeScanner/>,
            detect: <LocalSee/>
        };

        const options: InputTypes[] = ['text', 'scan'];
        const scan: boolean = options[select] == 'scan'; 

        return (
            <Box sx={{ flexFlow: 1, width: '100%' }}>
                <Grid container sx={{ bgcolor: 'transparent' }}>
                    { 
                        openInput ?
                            <Grid size={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: '5px', mt: '15px' }}>
                                <Box sx={{ height: '100%', width: '100%' }}>
                                    <QRScanner getValue={setValue} />
                                </Box>
                            </Grid>
                        :
                        <>
                            <Grid size={12} sx={{ m: '2px', height: '50px', pt: '10px' }}>
                                <FormControl size='small' fullWidth>
                                    <InputLabel>Response Type</InputLabel>
                                    <Select
                                        value={select}
                                        label="Response Type"
                                        onChange={(e) => {
                                            setSelected(e.target.value);
                                            setTypeValue(options[e.target.value - 1]); 
                                        }}
                                    >
                                        {
                                            [undefined, ...options].map((o, i) => {
                                                return (
                                                    <MenuItem value={i}>
                                                        {o}
                                                    </MenuItem>
                                                );
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid size={12} sx={{ m: '2px', pt: '10px' }}>
                                <TextField size='small' label="Clue" variant="outlined" multiline rows={4} fullWidth onChange={(e) => setDescription(e.target.value)} />
                            </Grid>
                            
                            {
                                select != 0 ? 
                                <Grid container columnSpacing={1} size={12} sx={{ m: '2px', height: '50px', pt: '10px' }}>
                                        <Grid size={scan ? 12: 9.5}> 
                                        <TextField size="small" label="Answer"  defaultValue={value} fullWidth 
                                            onChange={(e) => setValue(e.target.value)}
                                            variant={"outlined"}
                                            disabled={!scan}
                                            slotProps={{ 
                                                inputLabel: { shrink: value != undefined } 
                                            }} 
                                            sx={{
                                                bgcolor: `${scan ? undefined : 'lightgray'}`
                                            }}
                                            
                                        />
                                    </Grid>
                                    {
                                        !scan ? 
                                            <Grid size={2}>
                                                <IconButton
                                                    onClick={() => setOpenInput(true)}
                                                    color='primary'
                                                    children={icons[options[select - 1]]}
                                                    sx={{
                                                        borderRadius: '5px',
                                                        boxShadow: '1px 1px 5px #1976d2',

                                                    }}
                                                /> 
                                            </Grid>
                                        : <></>
                                    }
                                </Grid> : <></>
                            }
                        </>
                    }    
                </Grid>
            </Box>
        );
    };


    return (
        <Zoom in={transition} style={{ transitionDelay: transition ? '0s' : '5s' }}>
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
                        boxShadow: '0 8px 32px 0 rgba(253, 3, 3, 0.2)',
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
                        >{'Game Information'}
                        </Typography>
                    }
                    headerAction={
                        openInput ? 
                            <IconButton
                                onClick={() => setOpenInput(false)}
                                color='error'
                                size='small'
                                children={<Close fontSize="small"/>}
                            /> : <></>
                    }
                    subheader={
                        <Typography
                            sx={{
                                color: 'rgb(82, 82, 82)',
                                alignContent: 'center',
                                fontFamily: 'system-ui',
                                fontSize: '10px',
                                pl: '10px'
                            }}
                        >{`please fill out hunt details`}</Typography>
                    }
                    content={
                        world.creationMode.data.length == 0 
                        ? startContentForm()
                        : clueContentForm()
                    }
                    actions={
                        <Box sx={{
                            width: '100%',
                            display: 'flex',
                            gap: 1,
                            justifyContent: 'right'
                        }}>
                            <IconButton
                                onClick={save}
                                color='success'
                                size='small'
                                disabled={valid()}
                                children={<CheckCircle />}
                            />
                        </Box>
                    }
                />
            </Box>
        </Zoom>
    );
};

export default CreationCard; 