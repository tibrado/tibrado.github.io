import React, {useState, type ReactElement} from 'react';
import ReactMarkdown from 'react-markdown';
import { type InputTypes, Color } from '../../assets/types';
import {Box, IconButton, CardMedia} from '@mui/material';
import TextInput from '../inputs/TextInput';
import ObjectClassifier from '../inputs/ObjectClassifier';
import QRScanner from '../inputs/QRScanner';
import { Photo, TextSnippet, YouTube } from '@mui/icons-material';

export type Props ={
    OnSubmit: (v: boolean, p: number) => void; 
    showClue: boolean;
    clue: string;
    image?: string;
    video?: string;
    responses: string[];
    inputType: InputTypes; 
    hint: string; 
}; 

export const GameClue: React.FC<Props> = ({OnSubmit, showClue, clue, image, video, responses, inputType, hint}) => {
    const text_image_video: boolean[] = [clue.trim() != '', Boolean(image), Boolean(video)]
    const hasTwoOrMore = text_image_video.filter(Boolean).length >= 2;

    const [value, setValue] = useState<'text' | 'picture' | 'video'>(
        text_image_video[0] ? 'text' : (
            text_image_video[1] ? 'picture' : (
                text_image_video[2] ? 'video' : 'text'
            )
        )
    ); 

    const _height = `${hasTwoOrMore ? 220 : 245}px`; 

    // icon sx 
    const iconSx = {borderRadius: 0, p: 0, m: 0, ml: '0px'};

    const Inputs: Record<InputTypes, ReactElement> = {
        text: <TextInput OnSubmit={OnSubmit} responses={responses} hint={hint}/>,
        scan: <QRScanner  OnSubmit={OnSubmit} responses={responses}/>,
        detect: <ObjectClassifier OnSubmit={OnSubmit}  responses={responses} hint={hint}/>

    };

    
    return ( 
        showClue ? 
            <Box sx={{height: '100%', width: '100%', p: 0, m: 0}}> 
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'right',
                    alignItems: 'center',
                    alignSelf: 'center',
                    m: 0, p: 0

                }}>
                    {text_image_video[0] && hasTwoOrMore ? (
                        <IconButton
                            size='small'
                            onClick={() => setValue('text')}
                            sx={{ ...iconSx, color: `${value == 'text' ? '#000000b0' : Color.blue}` }}
                        ><TextSnippet /></IconButton>) : undefined
                    }


                    {text_image_video[1] && hasTwoOrMore ? (
                        <IconButton
                            size='small'
                            onClick={() => setValue('picture')}
                            sx={{ ...iconSx, color: `${value == 'picture' ? '#000000b0' : Color.blue}` }}
                        ><Photo /></IconButton>) : undefined
                    }

                    {text_image_video[2] && hasTwoOrMore ? (
                        <IconButton
                            size='small'
                            onClick={() => setValue('video')}
                            sx={{ ...iconSx, color: `${value == 'video' ? '#000000b0' : Color.blue}` }}
                        ><YouTube /></IconButton>) : undefined
                    }
                        
                    
                </Box>

                <Box 
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'right',
                        alignItems: 'left',
                        alignSelf: 'center',
                        m: 0, p: 0, height: _height,
                        overflowY: 'auto'
                    }}
                >
                    {
                        value == 'text' ? (
                            <ReactMarkdown children={clue} />
                        ) : (
                            value == 'video' ? (
                                <CardMedia
                                    component='iframe'
                                    height={_height}
                                    image={video}//"https://www.youtube.com/embed/4oHsrTUEu8I" // Make sure to use the embed video format
                                    allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    sx={{ border: '1px solid black' }}
                                />
                            ) : (
                                <CardMedia
                                    component="img"
                                    title={'Image'}
                                    height={_height}
                                    image={image}//"https://plus.unsplash.com/premium_photo-1772734257394-77dff00c5f26?q=80&w=928&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D" // Path to your video file
                                />
                            )
                        )

                    }
                </Box>
                
            </Box>
        : Inputs[inputType]
    ); 
}; 