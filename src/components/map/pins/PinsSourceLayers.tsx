import {useMemo, useEffect} from 'react'; 
import { Source, Layer, useMap} from 'react-map-gl/maplibre';
import { useWorld } from '../../../context';
import { get_distance } from '../../../handlers/DistanceHandlers';

export function QuestLayer() {
    const { world } = useWorld();

    const geoJsonData = useMemo(() => {
        const games = world?.games?.hunts; 

        if(!Array.isArray(games)){
            return {
                "type": "FeatureCollection" as const,
                "features": []
            };
        };

        const features = games.map((h, i) => ({
            "type": "Feature" as const, // Cast to literal type for TypeScript safety
            "id": `game_pin_${i}`,
            "properties": {
                "title": h.title,
                "type": h.type,
                "in_range": true,
                "description": h.description,
                "distance_meters": get_distance({latitude: h.coord[0], longitude: h.coord[1]}, {latitude: world.player.lat, longitude: world.player.lng}, true)
            },
            "geometry": {
                "type": "Point" as const,
                "coordinates": [h.coord[1], h.coord[0]]
            }
        }));
    
        return {
            "type": "FeatureCollection" as const,
            "features": features
        };
    }, [world?.games?.hunts]);
  
    return (
        <Source id="game-pins-source" type="geojson" data={geoJsonData}>
            <Layer 
                id="scavenger-game-layer" 
                type="symbol" 
                layout={{ 
                    'icon-image': 'quest', 
                    'icon-size': 0.3,
                    'icon-allow-overlap': true, 
                }}
            />
        </Source>
    );
};

export function TrialLayer() {
    const { world } = useWorld();

    const geoJsonData = useMemo(() => {
        const trials = world?.trials

        if(!Array.isArray(trials)){
            return {
                "type": "FeatureCollection" as const,
                "features": []
            };
        };

        const features = trials.flatMap((t, id) => (
            t.text.flatMap((text, path) => ({
                "type": "Feature" as const, // Cast to literal type for TypeScript safety
                "id": `trial_pin_${id}_${path}`,
                "properties": {
                    "id": id,
                    "path": path,
                    "in_range": true,
                    "text": text,
                    "distance_meters": get_distance({latitude: t.location[path][0], longitude: t.location[path][1]}, {latitude: world.player.lat, longitude: world.player.lng}, true)
                },
                "geometry": {
                    "type": "Point" as const,
                    "coordinates": [t.location[path][1], t.location[path][0]]
                }

            })))
        );

        return {
            "type": "FeatureCollection" as const,
            "features": features.flat()
        };
    }, [world?.trials]);
  
    return (
        <Source id="trial-pin-source" type="geojson" data={geoJsonData}>
            <Layer 
                id="scavenger-trial-layer" 
                type="symbol" 
                layout={{ 
                    'icon-image': 'search', 
                    'icon-size': 0.3,
                    'icon-allow-overlap': true, 
                }}
            />
        </Source>
    );
};

export function MainCharacterLayer() {
    const { world } = useWorld();
    const { current: map } = useMap(); // Gets the raw map instance
    
    const mc = world.player;

    // 1. Update the data directly in MapLibre without re-rendering React
    useEffect(() => {
        if (!map) return;

        const source = map.getSource('mc-pin-source') as maplibregl.GeoJSONSource;
        if (source) {
            // Directly push the new coordinates to the GPU
            source.setData({
                "type": "FeatureCollection",
                "features": [{
                    "type": "Feature",
                    "id": "mc_pin",
                    "properties": mc,
                    "geometry": {
                        "type": "Point",
                        "coordinates": [mc.lng, mc.lat]
                    }
                }]
            });
        }
    }, [mc.lng, mc.lat, map]); // Only runs when coordinates change

    // 2. Initial render returns an empty collection so the layer exists
    return (
        <Source id="mc-pin-source" type="geojson" data={{ type: "FeatureCollection", features: [] }}>
            <Layer 
                id="scavenger-mc-layer" 
                type="symbol" 
                layout={{ 
                    'icon-image': mc.icon as string, 
                    'icon-size': 0.2,
                    'icon-allow-overlap': true, 
                }}
            />
        </Source>
    );
}

export function OtherPlayersLayer() {
    const { world } = useWorld();
    const players = world.players; 
    const { current: map } = useMap(); // Gets the raw map instance
    
    // 1. Update the data directly in MapLibre without re-rendering React
    useEffect(() => {
        if (!map) return;

        const source = map.getSource('players-pin-source') as maplibregl.GeoJSONSource;
        if (source) {
            // Directly push the new coordinates to the GPU
            source.setData({
                "type": "FeatureCollection",
                "features": players.map((p, i) => ({
                    "type": "Feature",
                    "id": `players_pin_${i}`,
                    "properties": p,
                    "geometry": {
                        "type": "Point",
                        "coordinates": [p.lng, p.lat]
                    }
                }))
            });
        }
    }, [players, map]); // Only runs when coordinates change

    // 2. Initial render returns an empty collection so the layer exists
    return (
        <Source id="players-pin-source" type="geojson" data={{ type: "FeatureCollection", features: [] }}>
            <Layer 
                id="scavenger-players-layer" 
                type="symbol" 
                layout={{ 
                    'icon-image': ['get', 'icon' as string], 
                    'icon-size': 0.15,
                    'icon-allow-overlap': true, 
                }}
            />
        </Source>
    );
}
/*}
            <Layer
                id='the-scavenger-test'
                type='symbol'
                layout={{
                    'icon-image': "cow",
                    'icon-size': 0.20
                }}
            />

            <Layer 
            id="the-scavenger" 
            type="symbol" 
            layout={{ 
                'icon-image': 'quest', 
                'icon-size': [
                    'interpolate',
                    ['linear'],                  // Smoothly blend values between steps
                    ['get', 'distance_meters'],  // 1. Get the current distance value
                    0,   .3,
                    0.25,   0.25,
                    0.5,   0.2,
                    0.75,   0.3,
                    1,   0.1
                ],
                'icon-allow-overlap': true, 
            }}
            
            paint={{
              'icon-opacity': [
                    'interpolate',
                    ['linear'],                  // Smoothly blend values between steps
                    ['get', 'distance_meters'],  // 1. Get the current distance value
                    0.25,   1,
                    0.5,   1,
                    0.75,   1,
                    1,   1
                ]
            }}
        />
*/