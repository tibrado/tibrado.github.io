import React, { useState, type ReactNode } from 'react';
import { Box, CssBaseline, Paper, ThemeProvider, createTheme } from '@mui/material';
import { StartPage } from './pages/StartPage';
import {GameMap} from './components/map/GameMap';
import type { Game, GameStates } from './assets/types';
import Done from './pages/DonePage';

const theme = createTheme();

export const App: React.FC = () => {
  const [game, setGame] = useState<Game | undefined>(undefined);
  const [state, setState] = useState<GameStates>('start');

  // TSX Example: Enter fullscreen on first click anywhere
  document.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    }
  }, { once: true });

  const States: Record<GameStates, ReactNode> = {
    start: <StartPage setGame={setGame} setState={setState} />,
    game: game ? <GameMap game={game} setGame={setGame} setState={setState} /> : <>-_-</>,
    victory: <Done />,
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
          backgroundColor: 'hsla(230, 59%, 25%, 1)', // fallback
          backgroundImage: 'linear-gradient(180deg, hsla(230,59%,25%,1) 0%, hsla(359,73%,39%,1) 70%, hsla(32,97%,59%,1) 100%)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          overflow: 'hidden'
        }}
      >
        <Paper elevation={0} sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent',
          p: 1
        }}>
          {States[state]}
        </Paper>
      </Box>
    </ThemeProvider>
  );
};