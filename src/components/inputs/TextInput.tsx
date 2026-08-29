import React, {useState} from 'react'; 
import { TextField } from "@mui/material";
import { blue, red } from '@mui/material/colors';

type Props = {
    OnSubmit: (v: boolean, p: number) => void;
    responses: string[];
    hint?: string;
};

const TextInput: React.FC<Props> = ({OnSubmit, responses, hint}) => {
    const [color, setColor] = useState<string>(blue[600]); 

    const handleTextInput = (code: string) => {
        code = code.toLocaleLowerCase(); 

        setColor(
            responses.some(v => v.startsWith(code)) ? blue[700] : red[600]
        );

        if(responses.includes(code)) OnSubmit(true, responses.indexOf(code)); 
    }; 

    return(
        <TextField
            id="input-with-icon-textfield"
            label={'code'}
            helperText={hint}
            variant="filled"
            multiline
            rows={7}
            error={color == red[900]}
            onChange={(e) => handleTextInput(e.target.value)}
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: `1px solid ${color}`,
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
                    pr: 2
                },
            }}
        />
    )
}; 

export default TextInput;