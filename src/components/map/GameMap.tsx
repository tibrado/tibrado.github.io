
import { useMemo, useState } from 'react';
import {
    Map, Marker, Popup, 

} from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Place } from '@mui/icons-material';
import { GamePage } from '../../pages/GamePage';
import type { Game, GameStates } from '../../assets/types';

type Props = {
    POI: PointOfInterest[]; // Points of Interest 
    game: Game | undefined;
    setState: (state: GameStates) => void; 
}; 

type PointOfInterest = {
    longitude: number;
    latitude: number;
    info: string; 
    type: string;
}; 

export const GameMap: React.FC<Props> = ({POI, game, setState}) => {
    const [poi, setPoi] = useState<PointOfInterest | undefined>(undefined); 

    const pins = useMemo(() => POI.map((point, index) => 
        <Marker
            key={`marker-${index}`}
            longitude={point.longitude}
            latitude={point.latitude}
            anchor='bottom'
            onClick={e => {
                e.originalEvent.stopPropagation();
                setPoi(point); 
            }}
            style={{cursor: 'pointer'}}
        >
            <Place/>
        </Marker>
    ), []); 

    return (
        <Map
            initialViewState={{
                longitude: 12.4,
                latitude: 41.9,
                zoom: 3.5,
                bearing: 0,
                pitch: 0
            }}
            mapStyle='https://tiles.openfreemap.org/styles/liberty'
            style={{
                height: '95dvh', 
                width: '95dvw',
                borderRadius: '10px',
            }}
        >
            <style>
                {`
                    .maplibregl-popup-content {
                        background: transparent !important;
                        box-shadow: none !important;
                        padding: 0 !important;
                    }
                    .maplibregl-popup-tip {
                        display: none !important;
                    }
                `}
            </style>

            {pins}

            {poi && (
                <Popup 
                    anchor='center'
                    longitude={poi.longitude}
                    latitude={poi.latitude}
                    closeButton={false}
                    style={{padding: 0, margin: 0}}
                    onClose={() => setPoi(undefined)}
                >
                    <GamePage game={game} setState={setState} />
                </Popup>
            )}
        </Map>
    );
}; 

export default GameMap; 