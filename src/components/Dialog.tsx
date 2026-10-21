import BaseCard from "../animations/BaseCard";
import { Typography, Box, Button } from "@mui/material";

type Props = {
    title?: string;
    message: string;
    handleResponse: (v: boolean) => void;
    trueText?: string;
    falseText?: string;
};

export const Dialog: React.FC<Props> = ({title, message, handleResponse, trueText}) => {
    return (
        <>

            <BaseCard
                style={{
                    width: '250px',
                    height: 'auto',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 1,
                    borderRadius: '5px',
                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(12px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(12px) saturate(180%)',
                    border: '2px solid rgba(255, 255, 255, 0.1)',
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
                    >{title}
                    </Typography>
                }
                contentStyle={{
                    p: 0,
                    pb: '10px', pt: '10px',  
                    height: 'auto',
                    width: '100%',
                }}
                content={
                    <Typography
                        sx={{
                            color: '#000000ff',
                            alignContent: 'center',
                            fontFamily: 'system-ui',
                            fontSize: '13px',
                            textShadow: '1px 1px 3px rgba(25, 23, 23, 0.7)'
                        }}
                    >{message}
                    </Typography>
                }
                actions={
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                        <Button
                            onClick={() => handleResponse(true)}
                            color='primary'
                            size='small'
                            variant="contained"
                            children={trueText}
                        />

                    </Box>
                }
            />
        </>
    );
};

export default Dialog; 