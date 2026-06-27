import { type ReactNode } from 'react';
import { Card, CardHeader, CardContent, CardActions, type SxProps, type Theme } from '@mui/material';

type CardProps = {
    style?: SxProps<Theme>;
    header?: ReactNode;
    subheader?: ReactNode;
    content: ReactNode;
    actions?: ReactNode;
    avatar?: ReactNode;
};
    
const BaseCard: React.FC<CardProps> = ({style, header, subheader, content, actions, avatar}) => {
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
                    p: 0, m:0, 
                    display: 'flex', 
                    justifyContent: 'left',
                    alignItems: 'center',
                    height:'250px',  
                    width: '100%',
                    flexDirection: "column", 
                    fontSize: '14px'
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