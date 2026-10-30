import { type ReactNode } from 'react';
import { Card, CardHeader, CardContent, CardActions, type SxProps, type Theme } from '@mui/material';

type CardProps = {
    style?: SxProps<Theme>;
    content: ReactNode;
    contentStyle?: SxProps<Theme>;
    headerAction?: ReactNode;
    header?: ReactNode;
    subheader?: ReactNode;
    actions?: ReactNode;
    avatar?: ReactNode;
};

// https://plus.unsplash.com/premium_photo-1772734257394-77dff00c5f26?q=80&w=928&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D
const content_style = {
    p: 0, m: 0,
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'center',
    height: '250px',
    width: '100%',
    flexDirection: "column",
    fontSize: '14px'
}; 

const BaseCard: React.FC<CardProps> = ({style, header, subheader, content, actions, avatar,headerAction, contentStyle=content_style}) => {
    return(
        <Card sx={style}>
            <CardHeader
                sx={{p: 0}}
                avatar={avatar}
                title={header}
                subheader={subheader}
                action={headerAction}
            />
        
            <CardContent 
                sx={contentStyle}
            >
                {
                    content
                    /*<CardMedia
                        component='iframe'
                        height="240"
                        image="https://www.youtube.com/embed/4oHsrTUEu8I" // Path to your video file
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        sx={{border: 'none'}}
                    />*/
                }
            </CardContent>

            <CardActions 
                disableSpacing 
                sx={{
                    p: 0,
                    m: 0
                }}
            >
                {actions}
            </CardActions>
        </Card>

    ); 
}; 

export default BaseCard; 

export const RewardBaseCard: React.FC<CardProps> = ({style, header, subheader, content, actions, avatar}) => {
    return(
        <Card sx={style}>
            <CardHeader
                sx={{p: 0}}
                avatar={avatar}
                title={header}
                subheader={subheader}
            />
        
            <CardContent 
                sx={{
                    p: 0, m:0, display: 'flex', height:'100%',  flexDirection: "column", width: '100%'
                }}
            >
                {content}
            </CardContent>

            <CardActions 
                disableSpacing 
                sx={{
                    p: 0,
                    m: 0
                }}
            >
                {actions}
            </CardActions>
        </Card>

    ); 
}; 