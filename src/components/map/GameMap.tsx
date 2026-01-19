import { useMemo, useState, useRef } from 'react';
import { Map, Marker, Popup, type MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Place } from '@mui/icons-material';
import { GamePage } from '../../pages/GamePage';
import type { Game, GameStates } from '../../assets/types';

type Props = {
    game: Game;
    setState: (state: GameStates) => void; 
}; 

export const GameMap: React.FC<Props> = ({game, setState}) => {
    const [selected, setSelected] = useState<number | undefined>(undefined); 
    // 1. Create a reference to the map
    const mapRef = useRef<MapRef>(null);

    // 2. Updated click handler to fly to the marker
    const handleMarkerClick = (longitude: number, latitude: number, index: number) => {
        setSelected(index);
        
        // Use the mapRef to call the flyTo method
        mapRef.current?.flyTo({
            center: [longitude, latitude],
            duration: 2000, // Duration in milliseconds
            zoom: 20,       // Optional: adjust zoom level on arrival
            essential: true
        });
    };

    const pins = useMemo(() => game.clues.map((clue, index) => 
        <Marker
            key={`marker-${index}`}
            longitude={clue.location.longitude}
            latitude={clue.location.latitude}
            anchor='bottom'
            onClick={e => {
                e.originalEvent.stopPropagation();
                handleMarkerClick(clue.location.longitude, clue.location.latitude, index); 
            }}
            style={{cursor: 'pointer'}}
        >
            <Place/>
        </Marker>
    ), [game.clues]); // Added game.clues as dependency

    return (
        <Map
            ref={mapRef} // 3. Attach the ref to the Map component
            initialViewState={{
                longitude: game.clues[0].location.longitude,
                latitude: game.clues[0].location.latitude,
                zoom: 20,
                bearing: 90,
                pitch: 60
            }}
            mapStyle='https://tiles.openfreemap.org/styles/liberty'
            style={{
                height: '95dvh', 
                width: '95dvw',
                borderRadius: '10px',
            }}
        >
            {/* Custom Popup Styles */}
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

            {selected !== undefined && (
                <Popup 
                    anchor='center'
                    longitude={game.clues[selected].location.longitude}
                    latitude={game.clues[selected].location.latitude}
                    closeButton={false}
                    style={{padding: 0, margin: 0}}
                    onClose={() => setSelected(undefined)}
                >
                    <GamePage game={game} selected={selected} setState={setState} />
                </Popup>
            )}
        </Map>
    );
}; 

export default GameMap;