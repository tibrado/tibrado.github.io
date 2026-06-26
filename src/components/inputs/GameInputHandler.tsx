import { TextField } from "@mui/material";
import QRScanner from "./QRScanner";
import { type ReactElement } from "react";
import type { InputTypes } from "../../assets/types";
import ObjectClassifier from "./ObjectClassifier"; 
import { blue, red } from '@mui/material/colors';

type Props = {
    onSubmit: (value: string) => void;
    inputType: InputTypes;
    label?: string;
    hint?: string;
    nope?: boolean;
    textRows?: number;
};

const GameInputHandler: React.FC<Props> = ({ onSubmit, inputType, label, hint, nope, textRows}) => {
    // ----------- Input Types
    const Inputs: Record<InputTypes, ReactElement> = {
        text:
            <TextField
                id="input-with-icon-textfield"
                label={label}
                helperText={nope ? 'red cause you wrong' : hint}
                variant="filled"
                multiline
                rows={textRows}
                error={nope}
                onChange={(e) => onSubmit(e.target.value)}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: `1px solid ${nope ? red[600] : blue[700]}`,
                    borderRadius: '5px',
                    width: '90%',
                    height: '90%',
                    backgroundColor: '#ffffffc7',
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
                        color: nope ? red[900] : blue[900]
                    },
                }}
            />,
        scan: <QRScanner onSubmit={onSubmit} nope={nope} msg={nope ? 'red cause you wrong' : hint}/>,
        detect: <ObjectClassifier inputType={inputType} onSubmit={onSubmit} nope={nope} msg={nope ? 'red cause you wrong' : hint}/>

    };

    return (Inputs[inputType]);
};

export default GameInputHandler;