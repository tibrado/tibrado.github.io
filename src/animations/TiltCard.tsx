import React, { type ReactNode } from 'react';
import MuiCard from '@mui/material/Card';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

interface TiltCardProps {
  children: ReactNode;
}

// --- Styled Components ---

// Container no longer needs transitions for rotation
const StyledTiltContainer = styled(Box)(() => ({
  position: 'relative',
  overflow: 'hidden',
}));

// Card no longer uses CSS variables for rotation/glare; holofoil is centered
const StyledCard = styled(MuiCard)(({ theme }) => ({
  height: '100%',
  width: '100%',
  transform: 'none',
  transition: 'box-shadow 0.3s ease',
  position: 'relative',
  zIndex: 1,

  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5,
    pointerEvents: 'none',
    background: `radial-gradient(
      circle at 50% 50%,
      #ffffff80,
      #ff00f333 10%,
      #00c4ff33 30%,
      #00ff2f33 50%,
      #fffb0033 70%,
      #ff000033 90%,
      #ffffff00
    )`,
    transition: 'opacity 0.3s ease-out',
  },
  '&:hover::before': {
    opacity: 0.8,
  },
  boxShadow: theme.shadows[4],
  '&:hover': {
    boxShadow: theme.shadows[16],
  }
}));


// --- Main component without tilt ---

const TiltCard: React.FC<TiltCardProps> = ({ children }) => {
  return (
    <StyledTiltContainer>
      <StyledCard>
        {children}
      </StyledCard>
    </StyledTiltContainer>
  );
};

export default TiltCard;