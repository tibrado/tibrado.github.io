import React from 'react'; 
import {Box, List, ListItem, ListItemText, Typography} from '@mui/material'; 

type Props = {

}; 

export const LeaderBoard: React.FC<Props> = ({}) => {

    const createBoard = (name: string[]) => {
        return (
            <List dense={true}>
                {
                    name.map((n, i) => {
                        return <ListItem id={`li_${i}_${n}`} sx={{p: 0, m: 0,}}>
                            <ListItemText id={`lit_${i}_${n}`} sx={{p: 0, m: 0}} 
                                primary={`${i + 1}. ${n}`}
                            />
                        </ListItem>
                    })
                }
            </List>
        ); 
    };

    return (
        <Box 
        sx={{
          position: 'absolute', // Locks it relative to the container
          top: 10,
          left: 1,
          zIndex: 1,           // Ensures it stays above the map
          pl: 1, pr: 2, pb: 0,
          width: '200px',
          backgroundColor: 'rgba(248, 159, 6, 0.01)',
          pointerEvents: 'none',
          color: '#2196f3'
        }}>
            <Typography color='secondary' variant='subtitle2' fontWeight='bold'>
                Leader Board
            </Typography>
            {createBoard([
  'Alex_M',
  'Sarah_S',
  'Jordan_D',
  'Lisa_K',
  'Mark_E',
  'Chris_K',
  'Atlas_P',
  'Nova_S',
  'Echo_R',
  'Zenith_U'
])}
        </Box>
    ); 
}; 