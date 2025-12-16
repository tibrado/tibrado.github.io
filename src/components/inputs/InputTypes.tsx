import { InputAdornment, TextField } from "@mui/material";
import {Send} from '@mui/icons-material';

type Props = {
    onSubmit: (value: string) => void;
}; 

export const UserFreeTextInput: React.FC<Props> = ({onSubmit}) => {
    // const [value, setValue] = useState<string>(''); 
    return (
        <TextField
            id="input-with-icon-textfield"
            label="TextField"
            variant='outlined'
            slotProps={{
                input: {
                    endAdornment: (
                        <InputAdornment position="start">
                                <Send/>
                        </InputAdornment>
                    )
                },
            }}
            onChange={(e) => onSubmit(e.target.value)}
            sx={{
                width: '100%', 
                height: '100%',
            }}
        />
    )
}; 