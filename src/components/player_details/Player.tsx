import { Avatar, Badge } from "@mui/material";
import type { PlayerIcon } from "../../assets/types";


type Props = {
    name: string; 
    position: number;
    icon: PlayerIcon; 
};

export const PlayerDisplay: React.FC<Props> = ({name, position, icon}) => {
    return (
        <Badge 
            badgeContent={position} color="primary"
            
        >
            <Avatar 
                key={`k-${name}`}
                variant="square"
                alt="UK" 
                src={`/icons/${icon}.png`}
                sx={{
                    width: { xs: 40, md: 40, lg: 40 }, 
                    height: { xs: 40, md: 40, lg: 40 },
                    p: "5px", // Padding to keep the image away from the circle edge
                    "& img": {
                        objectFit: "contain", // Ensures the full PNG is visible
                        width: "100%",        // Forces image to respect container width
                        height: "100%",        // Forces image to respect container height
                        filter: "drop-shadow(2px 3px 2px rgba(0, 0, 0, 0.38))" // Shadow follows PNG shape
                    
                    }
                }}
            />
        </Badge>
    );
    
};