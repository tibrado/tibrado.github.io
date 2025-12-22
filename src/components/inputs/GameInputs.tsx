import { TextField } from "@mui/material";
import QRScanner from "./QRScanner";
import { type ReactElement } from "react";
import type { InputTypes } from "../../assets/types";

type Props = {
    onSubmit: (value: string) => void;
    inputType: InputTypes;
    label?: string;
    helperText?: string;
}; 

const GameInputs: React.FC<Props> = ({onSubmit, inputType, label, helperText}) => {
    // ----------- Input Types
    const Inputs: Record<InputTypes, ReactElement> = {
        text: <TextField
            id="input-with-icon-textfield"
            label={label}
            helperText={helperText}
            variant='filled'
            multiline
            onChange={(e) => onSubmit(e.target.value)}
            sx={{
                width: '100%', 
                height: '100%',
                overflowY: 'auto',
                '& .MuiFormHelperText-root': {
                    width: '100%',
                    textAlign: 'end',
                    m: 0,
                    pr: 2                
                }
            }}
        />, 
        scan: <QRScanner onSubmit={onSubmit}/>
    }; 

    return (Inputs[inputType]); 
}; 

export default GameInputs;