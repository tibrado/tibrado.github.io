import React from 'react'; 
import {Alert, Snackbar, Slide} from '@mui/material'; 

type Props = {
    msg: string;
    severity?: ("success" | "info" | "warning" | "error") | undefined;
    variant?: ("standard" | "filled" | "outlined") | undefined; 
    open: boolean; 
    setOpen: (v: boolean) => void; 
}; 
export const Notification: React.FC<Props> = ({msg, severity, variant, open, setOpen}) => {

    const handleClose = () => {
        setOpen(false); 
    }; 

    return (
        <Snackbar open={open} autoHideDuration={10000} onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            sx={{top: '3% !important'}}
            slots={{
                transition: Slide
            }}
            slotProps={{
                transition: {direction: 'down'} as any
            }}
        >
            <Alert
                severity={severity}
                variant={variant}
                icon={false}
                sx={{
                    width: 'auto',
                    minWidth: '200px',
                    maxWidth: '400px',
                    py: 0,
                    px: 1,
                    m: 0,
                    fontSize: '0.75rem',
                    // Centers the text inside the alert since icons are removed
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                {msg}
            </Alert>
        </Snackbar>
    );
}; 