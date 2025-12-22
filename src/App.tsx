import React, { useState, type ReactNode } from 'react';
import { Box, CssBaseline, Paper, ThemeProvider, createTheme} from '@mui/material';
import { StartPage } from './pages/StartPage';
import { GamePage } from './pages/GamePage';
import type { Game, GameStates } from './assets/types';

const theme = createTheme();

export const App: React.FC = () => {
  const [game, setGame] = useState<Game | undefined>(undefined); 
  const [state, setState] = useState<GameStates>('start'); 

  const States: Record<GameStates, ReactNode> = {
    start: <StartPage setGame={setGame} setState={setState}/>,
    game: <GamePage game={game} setState={setState}/>,
    victory: undefined,
    transition: undefined,
    loading: undefined
  }; 

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100dvh',
          minWidth: '100dvw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'black',
          p: 2,
        }}
      >
        <Paper elevation={3} sx={{ 
          width: '100%',
          height: '100%', background: 'red',
          alignItems: 'center',
          justifyContent: 'center',

        }}>
          {States[state]}
        </Paper>
      </Box>
    </ThemeProvider>
  );
};