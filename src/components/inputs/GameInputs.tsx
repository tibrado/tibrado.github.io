import { TextField } from "@mui/material";
import QRScanner from "./QRScanner";
import { type ReactElement } from "react";
import type { InputTypes } from "../../assets/types";

type Props = {
    onSubmit: (value: string) => void;
    inputType: InputTypes;
    label?: string;
    helperText?: string;
    nope?: boolean;
};

const GameInputs: React.FC<Props> = ({ onSubmit, inputType, label, helperText, nope}) => {

    // ----------- Input Types
    const Inputs: Record<InputTypes, ReactElement> = {
        text:
            <TextField
                id="input-with-icon-textfield"
                label={label}
                helperText={nope ? 'red cause you wrong' : helperText}
                variant="filled"
                multiline
                error={nope}
                onChange={(e) => onSubmit(e.target.value)}
                sx={{
                    border: '1px solid gray',
                    borderRadius: '10px',
                    // FIXED: Removed the comma after 1px
                    boxShadow: `0px 1px 20px ${nope ? 'red' : '#c7c7c79c'}`,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'white', // Ensure shadow is visible against a background
                    '& .MuiFilledInput-root': {
                        backgroundColor: 'transparent',
                    },
                    '& .MuiFilledInput-root:hover': {
                        backgroundColor: 'transparent',
                    },
                    '& .MuiFilledInput-root.Mui-focused': {
                        backgroundColor: 'transparent',
                    },
                    '& .MuiFormHelperText-root': {
                        width: '100%',
                        textAlign: 'end',
                        m: 0,
                        pr: 2,
                    },
                }}
            />
        ,
        scan: <QRScanner onSubmit={onSubmit} nope={nope} msg={nope ? 'red cause you wrong' : helperText}/>
    };

    return (Inputs[inputType]);
};

export default GameInputs;