import { Send } from "@mui/icons-material";
import type { Trials} from "../assets/types";
import { GameClue } from "../components/map/GameClue";
import BaseCard from "./BaseCard";
import { Box, Slide, TextField, Typography } from "@mui/material";
import { blue, red } from '@mui/material/colors';

type Props = {
    transition: boolean;
    trial: Trials;
    path: number; 
    title: string;
    ValidateResponse: (v: string) => void;
    invalidResponse: boolean;
}; 

const TrailCard: React.FC<Props> = ({transition, title, trial, path, invalidResponse, ValidateResponse}) => {
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
                            showClue={false}
                            clue={trial.text[path]}
                            validateResponse={ValidateResponse} 
                            inputType={'text'}
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
                            <TextField
                                id="input-with-icon-textfield"
                                label={'response'}
                                variant="outlined"
                                error={invalidResponse}
                                size={'small'}
                                onChange={(e) => ValidateResponse(e.target.value)}
                                fullWidth
                                slotProps={{
                                    input: {
                                        endAdornment: <Send
                                            sx={{
                                                color: blue[500]
                                            }}
                                        />
                                    }
                                }}
                                sx={{
                                    m: 0,
                                    borderRadius: '5px',
                                    boxShadow: `2px 2px 3px ${invalidResponse ? blue[500] : red[500]}`,
                                    backgroundColor: 'transparent', // Ensure shadow is visible against a background
                                    '& .MuiFilledInput-root': {
                                        backgroundColor: 'transparent',
                                    },
                                    '& .MuiFilledInput-root:hover': {
                                        backgroundColor: 'transparent',
                                    },
                                    '& .MuiFilledInput-root.Mui-focused': {
                                        backgroundColor: 'transparent',
                                    },
                                    '& .MuiFormHelperText-root': {
                                        width: '100%',
                                        textAlign: 'end',
                                        m: 0,
                                        pr: 0,
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