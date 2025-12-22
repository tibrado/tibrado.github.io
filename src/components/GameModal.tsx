import React, {type ReactElement} from 'react';
import {Box, Button, Modal, Paper} from '@mui/material'; 
import { QuestionAnswer } from '@mui/icons-material';

type Props = {
  children: ReactElement;
  open: boolean; 
  setOpen: (open: boolean) => void;
}; 

export const GameModal: React.FC<Props> = ({children, open, setOpen}) => {
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box>
      <Button onClick={handleOpen} 
        variant="text"
        sx={{
      }}><QuestionAnswer/></Button>
      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper 
          elevation={10} 
          sx={{m: 5, p: 0.5, width: '100%', background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            alignContent: 'center'
          }}
        >
          {children}
        </Paper>
      </Modal>
    </Box>
  );
}

export default GameModal; 