import { CheckCircle, Cancel  } from "@mui/icons-material";
import type { GameInfo } from "../assets/types";
import BaseCard from "./BaseCard";
import { IconButton, Typography, Zoom, Box } from "@mui/material";
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

type Props = {
    transition: boolean;
    info: GameInfo;
    accept: () => void; 
    cancel: () => void; 
}; 

const GameCard: React.FC<Props> = ({transition, info, accept, cancel}) => {
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
                        >{info.title}
                        </Typography>
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
                        >{`${info.type}`}</Typography>
                    }
                    content={
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]} 
                            rehypePlugins={[rehypeRaw]}
                            
                        >{info.description}</ReactMarkdown>
                    }
                    actions={
                        <Box sx={{
                            width:'100%',
                            display: 'flex',
                            gap: 1,
                            justifyContent: 'space-between'
                        }}>
                            <IconButton 
                                onClick={cancel}
                                color='error'
                                size='small'
                                children={<Cancel/>}
                                sx={{
                                    boxShadow: '1px 1px 5px rgba(234, 139, 139, 0.7)',
                                }}
                            />
                            <IconButton 
                                onClick={accept}
                                color='success'
                                size='small'
                                children={<CheckCircle />}
                                sx={{
                                    boxShadow: '1px 1px 5px rgba(139, 234, 174, 0.7)',
                                }}
                            />
                        </Box>
                    }
                />
            </Box>
        </Zoom>
    ); 
}; 

export default GameCard; 