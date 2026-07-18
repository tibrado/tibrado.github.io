import { Typography } from "@mui/material";
import { CheckBoxOutlineBlankOutlined, CheckBoxOutlineBlank, IndeterminateCheckBoxOutlined,BrowserNotSupportedOutlined, ReportProblemOutlined } from "@mui/icons-material";
import type { AppPermissionOptions } from "../assets/types";

type Props = {
  what: string; 
  status: AppPermissionOptions; 
  prompt?: string;
  granted?: string;
  denied?: string;
  unsupported?: string;
  error?: string;
};

export const PermissionStatus: React.FC<Props> = ({ what, status, prompt, granted, denied, unsupported, error}) => {
    const ViewStatusIcon: Record<AppPermissionOptions, React.ReactNode> = {
        prompt: <CheckBoxOutlineBlankOutlined />,
        granted: <CheckBoxOutlineBlank />,
        denied: <IndeterminateCheckBoxOutlined />,
        unsupported: <BrowserNotSupportedOutlined/>,
        error: <ReportProblemOutlined/>
    };

    const ViewStatusMsg: Record<AppPermissionOptions, string | undefined> = {
        prompt: prompt,
        granted: granted,
        denied: denied,
        unsupported: unsupported,
        error: error
    };

    return(
        <Typography variant="caption" color="black" 
            sx={{ 
                fontStyle: 'italic', 
                opacity: 0.7,
                display: 'inline-flex',
                alignItems: 'center', 
                gap: 0.5
            }}
        >
            {ViewStatusIcon[status]} {what}{ViewStatusMsg[status] ? `: ${ViewStatusMsg[status]}` : ''}
        </Typography>
    ); 
}; 