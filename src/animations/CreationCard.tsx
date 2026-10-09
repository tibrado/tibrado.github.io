import { CheckCircle, QuestionAnswer, QrCodeScanner, LocalSee, Close } from "@mui/icons-material";
import { type GameType, type InputTypes as InputType, Color} from "../assets/types";
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
    const [value, setValue] = useState<string>('');
    const [gameTypeValue, setGameTypeValue] = useState<GameType>('scavenger_hunt');
    const [inputTypeValue, setInputTypeValue] = useState<InputType>('text');
    const [openInput, setOpenInput] = useState<boolean>(false);
    const [gameTypeSelect, setGameTypeSelect] = useState<number>(0);
    const [inputTypeSelect, setInputTypeSelect] = useState<number>(0);


    const gameTypes: GameType[] = ['scavenger_hunt', 'murder_mystery'];
    const inputTypes: InputType[] = ['text', 'scan'];
    const edit: boolean = world.creationMode.edit != undefined;

    const valid = (): boolean => {
        return value == '' || description == undefined;
    };

    const save = () => {
        if(!valid()){
            let temp = world.creationMode.data; 
            if(edit){
                const i = world.creationMode.edit ?? 0; 

                temp[i].value = value; 
                temp[i].description = description;
                temp[i].type = i == 0 ? gameTypeValue : inputTypeValue;
                // temp[i].coordinates = world.creationMode.location.LatLng
            }
            else{
                temp = [
                    ...temp,
                    {
                        value: value,
                        description: description,
                        type: world.creationMode.data.length == 0 ? gameTypeValue : inputTypeValue,
                        coordinates: world.creationMode.location.LatLng
                    }
                ];
            }

            setWorld(pre => (
                {   
                    ...pre, 
                    creationMode: {
                        ...pre.creationMode,
                        data: temp,
                        edit: undefined
                    }
                }
            ));
            close(); 
        }; 
    }; 

    const startContentForm = () => {
        return (
            <Box sx={{ flexFlow: 1, width: '100%' }}>
                <Grid container columnSpacing={3} sx={{ bgcolor: 'transparent' }}>
                    <Grid size={12} sx={{ m: '2px', pt: '10px' }}>
                        <TextField size="small" label="Game Title" variant="outlined" fullWidth onChange={(e) => setValue(e.target.value)}
                            value={value}    
                        />
                    </Grid>
                    <Grid size={12} sx={{ m: '2px', pt: '10px' }}>
                        <TextField size='small' label="Description" variant="outlined" multiline rows={4} fullWidth onChange={(e) => setDescription(e.target.value)} 
                            value={description}    
                        />
                    </Grid>
                    <Grid size={12} sx={{ m: '2px', height: '50px', pt: '10px' }}>
                        <FormControl size='small' fullWidth>
                            <InputLabel>Reward</InputLabel>
                            <Select
                                value={gameTypeSelect}
                                label="Reward"
                                onChange={(e) => {
                                    setGameTypeSelect(e.target.value); 
                                    setGameTypeValue(gameTypes[e.target.value]); 
                                }}
                            >
                                {
                                    gameTypes.map((io, i) => {
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
        const icons: Record<InputType, ReactElement> = {
            text: <QuestionAnswer/>,
            scan: <QrCodeScanner/>,
            detect: <LocalSee/>
        };
        const scan: boolean = inputTypes[inputTypeSelect] == 'scan'; 

        return (
            <Box sx={{ flexFlow: 1, width: '100%' }}>
                <Grid container sx={{ bgcolor: 'transparent' }}>
                    { 
                        openInput ?
                            <Grid size={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: '5px', mt: '15px' }}>
                                <Box sx={{ height: '100%', width: '100%' }}>
                                    <QRScanner 
                                        getValue={setValue} 
                                    />
                                </Box>
                            </Grid>
                        :
                        <>
                            <Grid size={12} sx={{ m: '2px', height: '50px', pt: '10px' }}>
                                <FormControl size='small' fullWidth>
                                    <InputLabel>Response Type</InputLabel>
                                    <Select
                                        value={inputTypeSelect}
                                        label="Response Type"
                                        onChange={(e) => {
                                            setInputTypeSelect(e.target.value);
                                            setInputTypeValue(inputTypes[e.target.value]); 
                                        }}
                                    >
                                        {
                                            inputTypes.map((o, i) => {
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
                                <TextField size='small' label="Clue" variant="outlined" multiline rows={4} fullWidth onChange={(e) => setDescription(e.target.value)} 
                                    defaultValue={description}
                                />
                            </Grid>
                            
                            {
                                <Grid container columnSpacing={1} size={12} sx={{ m: '2px', height: '50px', pt: '10px' }}>
                                    <Grid size={scan ? 9.5: 12}> 
                                        <TextField size="small" label="Answer"  defaultValue={value} fullWidth 
                                            onChange={(e) => setValue(e.target.value)}
                                            variant={"outlined"}
                                            disabled={scan}
                                            slotProps={{ 
                                                inputLabel: { shrink: value != undefined } 
                                            }} 
                                            sx={{
                                                bgcolor: `${scan ? 'lightgray' : undefined}`
                                            }}
                                            
                                        />
                                    </Grid>
                                    {
                                        scan ? 
                                            <Grid size={2}>
                                                <IconButton
                                                    onClick={() => setOpenInput(true)}
                                                    color='primary'
                                                    children={icons[inputTypes[inputTypeSelect]]}
                                                    sx={{
                                                        borderRadius: '5px',
                                                        boxShadow: `1px 1px 5px ${Color.blue}`,

                                                    }}
                                                /> 
                                            </Grid>
                                        : <></>
                                    }
                                </Grid>
                            }
                        </>
                    }    
                </Grid>
            </Box>
        );
    };

    const getForm = () => {
        if(!edit){
           return world.creationMode.data.length == 0
                ? startContentForm()
                : clueContentForm()
        }

        return world.creationMode.edit == 0
            ? startContentForm()
            : clueContentForm()
    };

    useEffect(() => {
        if (value != undefined) {
            setOpenInput(false)
        }
    }, [value]); 

    useEffect(() => {
        if(world.creationMode.edit != undefined){
            const data = world.creationMode.data[world.creationMode.edit]

            setValue(data.value ?? '');
            setDescription(data.description); 

            if(world.creationMode.edit == 0){
                setGameTypeSelect(gameTypes.indexOf(data.type as GameType));
                setGameTypeValue(data.type as GameType);
            }
            else {
                setInputTypeSelect(inputTypes.indexOf(data.type as InputType));
                setInputTypeValue(data.type as InputType);
            }
        };
    }, [world.creationMode.edit])

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
                        boxShadow: `0 0px 10px ${Color.red}`,
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
                    content={getForm()}
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