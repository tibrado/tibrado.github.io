import { InputAdornment, TextField, IconButton } from "@mui/material";
import {QrCodeScanner} from '@mui/icons-material';
import QRScanner from "./QRScanner";
import { useState, type ReactNode } from "react";
import type { InputTypes } from "../../assets/types";

type Props = {
    onSubmit: (value: string) => void;
}; 

export const UserFreeTextInput: React.FC<Props> = ({onSubmit}) => {
    const [inputType, setInputType] = useState<InputTypes>('text');

    // Test
    const a = "a"; 
    console.log(a); 
    // ----------- Input Types
    const Inputs: Record<InputTypes, ReactNode> = {
        text: <TextField
            id="input-with-icon-textfield"
            label="TextField"
            variant='outlined'
            slotProps={{
                input: {
                    startAdornment: (
                        <InputAdornment position="start">
                            <IconButton onClick={() => setInputType('scan')}>
                                <QrCodeScanner/>
                            </IconButton>
                        </InputAdornment>
                    )
                },
            }}
            onChange={(e) => onSubmit(e.target.value)}
            sx={{
                width: '100%', 
                height: '100%',
            }}
        />, 
        scan: <QRScanner onSubmit={onSubmit}/>
    }; 

    return (Inputs[inputType])
}; 