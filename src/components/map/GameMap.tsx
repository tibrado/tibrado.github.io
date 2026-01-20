import { useMemo, useState, useRef } from 'react';
import { Map, Marker, Popup, GeolocateControl,  type MapRef } from 'react-map-gl/maplibre';
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

    const mapRef = useRef<MapRef>(null);
    const focusOnClue = (clueIndex: number) => {
        setSelected(clueIndex); 
        // Use the mapRef to call the flyTo method
        mapRef.current?.flyTo({
            center: [game.clues[clueIndex].location.coordinates[1], game.clues[clueIndex].location.coordinates[0]] ,
            duration: 2000, // Duration in milliseconds
            zoom: 20,       // Optional: adjust zoom level on arrival
            essential: true
        });

    }; 

    const pins = useMemo(() => game.clues.map((clue, index) => {
       return  <Marker
            key={`marker-${index}`}
            latitude={clue.location.coordinates[0]}
            longitude={clue.location.coordinates[1]}
            anchor='bottom'
            onClick={e => {
                e.originalEvent.stopPropagation();
                setSelected(index);
                focusOnClue(index);
            }}
            style={{cursor: 'pointer'}}
        >
            <Place/>
        </Marker>
    }
    ), [game.clues]); // Added game.clues as dependency

    return (
        <Map
            ref={mapRef} // 3. Attach the ref to the Map component
            initialViewState={{
                latitude: game.clues[0].location.coordinates[0],
                longitude: game.clues[0].location.coordinates[1],
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

            {/*User Location*/}
            <GeolocateControl
                positionOptions={{
                    enableHighAccuracy: true
                }}
                trackUserLocation={true}
                onGeolocate={(e) => console.log("User located:", e.coords)}
            />

            {pins}

            {selected !== undefined && (
                <Popup 
                    anchor='center'
                    latitude={game.clues[selected].location.coordinates[0]}
                    longitude={game.clues[selected].location.coordinates[1]}
                    closeButton={false}
                    style={{padding: 0, margin: 0}}
                    onClose={() => setSelected(undefined)}
                >
                    <GamePage game={game} selected={selected} setState={setState} nextClue={focusOnClue} />
                </Popup>
            )}
        </Map>
    );
}; 

export default GameMap;