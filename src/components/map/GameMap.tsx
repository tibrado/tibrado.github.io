import { useMemo, useState, useRef, useCallback } from 'react';
import { Map, Marker, Popup, GeolocateControl, type MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Place } from '@mui/icons-material';
import { GamePage } from '../../pages/GamePage';
import type { World, Coordinates } from '../../assets/types';
import {inRange} from '../../handlers/DistanceHandlers';
import { LoadTrial } from '../../handlers/ApiHandler';
import { PlayerDisplay } from '../player_details/Player';

type Props = {
    world: World;
    setWorld: (world: World | undefined) => void; 
}; 

export const GameMap: React.FC<Props> = ({world, setWorld}) => {
    const [selected, setSelected] = useState<number | undefined>(undefined); 
    const [coord, setCoord] = useState<Coordinates | undefined>(undefined); 
    const mapRef = useRef<MapRef>(null);
    const geolocateRef = useRef<any>(null); 

    const FocusOnPin = useCallback((lng: number, lat: number) => {
        mapRef.current?.flyTo({
            center: [lng, lat] ,
            duration: 2000, // Duration in milliseconds
            zoom: 20,       // Optional: adjust zoom level on arrival
            essential: true
        });
    }, []);  

    const user_pin = useMemo(() => {
        return (
            coord ? 
                <Marker
                    key={`active-user`}
                    latitude={coord.latitude}
                    longitude={coord.longitude}
                    anchor='bottom'
                    offset={[0, 20]}
                    onClick={e => {
                        e.originalEvent.stopPropagation();
                        console.log(`user}`)
                    }}
                    style={{
                        cursor: 'pointer',
                        zIndex: 1
                    }}
                >
                    <PlayerDisplay name={world.player.name} position={0} icon={world.player.icon}/>
                </Marker> 
            : undefined
        )
    }, [coord]); 

    const world_pins = useMemo(() => world.games?.hunts.map((g, i) => {
        
        return ( world.games ? 
            <Marker
                key={`event_marker-${i}`}
                latitude={g.latitude}
                longitude={g.longitude}
                anchor='bottom'
                onClick={e => {
                    e.originalEvent.stopPropagation();
                    FocusOnPin(g.longitude, g.latitude);
                    LoadTrial(world, setWorld, `${g.latitude},${g.longitude}`); 
                    
                }}
                style={{
                    cursor: 'pointer',
                    zIndex: 2
                }}
            >
                <Place color={'primary'}/> 
            </Marker> : <></>
        )
    }), [world.games]);

    const player_pins = useMemo(() => world.players.map((p, i) => {
        return world.id ?  
            <Marker
                key={`player-${i}`}
                latitude={p.latitude}
                longitude={p.longitude}
                anchor='bottom'
                onClick={e => {
                    e.originalEvent.stopPropagation();
                    console.log(`${i}.${p.name}`)
                }}
                style={{
                    cursor: 'pointer',
                    zIndex: 1
                }}
            >
                <PlayerDisplay name={p.name} position={i} icon={p.icon}/>
            </Marker> : undefined
    }), [world.players]);

    const pins = useMemo(() => world.trials.map((clue, index) => {
        return  world.current >= index ? <Marker
            key={`marker-${index}`}
            latitude={clue.location.coordinates[0]}
            longitude={clue.location.coordinates[1]}
            anchor='bottom'
            onClick={e => {
                e.originalEvent.stopPropagation();
                setSelected(index);
                FocusOnPin(clue.location.coordinates[1], clue.location.coordinates[0]);
            }}
            style={{
                cursor: 'pointer',
                zIndex: 1
            }}
        >
            <Place color={
                inRange(coord, {latitude: clue.location.coordinates[0], longitude: clue.location.coordinates[1]}) && world.current == index ? 'error' 
                : index < world.current ? 'success' : undefined
            }/> 
        </Marker> : undefined
    }), [world.trials, world.current]);

    return (
        <Map
            ref={mapRef} // 3. Attach the ref to the Map component
            attributionControl={false} // Removes the 'i' and copyright text
            onLoad={(e) => {
                geolocateRef.current?.trigger(); 

                const _map = e.target; 
                const style = _map.getStyle(); 

                // Remove other icons 
                if(style && style.layers){
                    style.layers
                    .filter(l => l.type === 'symbol')    
                    .forEach(l =>  _map.removeLayer(l.id))
                }; 
                
                setWorld({...world, loading: false}); 
            }}

            initialViewState={{
                latitude: world.player.latitude,
                longitude: world.player.longitude,
                zoom: 18,
                bearing: 90,
                pitch: 60,
            }}
            
            // Disable all interactions
            doubleClickZoom={true}
            dragPan={true}
            dragRotate={true}
            touchZoomRotate={true}
            scrollZoom={true}
            maxZoom={22}
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
                    timeout: 10000 /* 10 sec */
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
                        accuracy: e.target?._accuracy
                    }); 
                    
                    setWorld({
                        ...world, 
                        player: {
                            ...world.player,
                            latitude: e.coords.latitude,
                            longitude: e.coords.longitude
                        }
                    })
                }}
            />

            {world.id ? pins : world_pins}
            {player_pins}
            {user_pin}
            {selected !== undefined && (
                <Popup 
                    anchor='center'
                    latitude={world.trials[selected].location.coordinates[0]}
                    longitude={world.trials[selected].location.coordinates[1]}
                    closeButton={false}
                    style={{padding: 0, margin: 0, zIndex: 2}}
                    onClose={() => setSelected(undefined)}
                >
                    <GamePage world={world} setWorld={setWorld} selected={selected} nextTrial={FocusOnPin} />
                </Popup>
            )}
        </Map>
    );
}; 

export default GameMap;