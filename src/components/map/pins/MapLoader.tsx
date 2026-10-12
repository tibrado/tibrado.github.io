import BasePin from "./BasePin";
import {Color} from '../../../assets/types';
import { component_to_image } from "../../helpers/component_to_image";

export const loadPin = async (map: any) => {
    const name = 'quest'; 
    try {
        // Create Image
        const pimg = await component_to_image(
            <BasePin imgUrl={'other_icons/scavenger_hunt.png'} color={Color.blue}/>,
            64
        );

        // Load pin to map
        if (!map.hasImage(name)) {
            map.addImage(name, pimg);
        };
    } catch (err) {
        console.error('Image Load Failed: ', err); 
    }; 
};