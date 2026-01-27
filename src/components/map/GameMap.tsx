import { useMemo, useState, useRef } from 'react';
import { Map, Marker, Popup, GeolocateControl, type MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Place } from '@mui/icons-material';
import { GamePage } from '../../pages/GamePage';
import type { Game, GameStates, Coordinates } from '../../assets/types';
import {inRange} from '../../handlers/DistanceHandlers';

type Props = {
    game: Game;
    setGame: (game: Game | undefined) => void; 
    setState: (state: GameStates) => void; 
}; 

export const GameMap: React.FC<Props> = ({game, setGame, setState}) => {
    const [selected, setSelected] = useState<number | undefined>(undefined); 
    //-- User Location
    const [coord, setCoord] = useState<Coordinates | undefined>(undefined); 
    const mapRef = useRef<MapRef>(null);
    const geolocateRef = useRef<any>(null); 

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
        return  game.current >= index ? <Marker
            key={`marker-${index}`}
            latitude={clue.location.coordinates[0]}
            longitude={clue.location.coordinates[1]}
            anchor='bottom'
            onClick={e => {
                e.originalEvent.stopPropagation();
                setSelected(index);
                focusOnClue(index);
            }}
            style={{
                cursor: 'pointer',
                zIndex: 1
            }}
        >
                <Place color={
                    inRange(coord, {latitude: clue.location.coordinates[0], longitude: clue.location.coordinates[1]}) && game.current == index ? 'error' 
                    : index < game.current ? 'success' : undefined
                }/> 
        </Marker> : undefined
    }), [game.clues, game.current]);

    /**
     * Check if pin is within 
     * ******Check if ********/

    return (
        <Map
            ref={mapRef} // 3. Attach the ref to the Map component
            onLoad={() => {
                if(geolocateRef.current){
                    geolocateRef.current.trigger(); 
                }
            }}
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
                ref={geolocateRef}
                positionOptions={{
                    enableHighAccuracy: false,
                    maximumAge: 0,
                    timeout: 6000 /* 6 sec */
                }}
                fitBoundsOptions={{
                    maxZoom: 20
                }}
                trackUserLocation={true}
                showAccuracyCircle={true}
                showUserLocation={true}
                onGeolocate={(e) => {
                        setCoord({
                            longitude: e.coords.longitude, 
                            latitude: e.coords.latitude, 
                            accuracy: e.target._accuracy
                        }); 
                }}
            />

            {pins}

            {selected !== undefined && (
                <Popup 
                    anchor='center'
                    latitude={game.clues[selected].location.coordinates[0]}
                    longitude={game.clues[selected].location.coordinates[1]}
                    closeButton={false}
                    style={{padding: 0, margin: 0, zIndex: 2}}
                    onClose={() => setSelected(undefined)}
                >
                    <GamePage game={game} setGame={setGame} selected={selected} setState={setState} nextClue={focusOnClue} />
                </Popup>
            )}
        </Map>
    );
}; 

export default GameMap;