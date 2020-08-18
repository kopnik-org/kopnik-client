import {LatLng, LatLngBounds} from 'leaflet'

import randomize from "./randomize";
/**
 *
 * @param {LatLng} center
 * @param {number} distance
 * @param {number} angle
 */
export default function (center, distance, angle) {
    return new LatLng(center.lat + distance * Math.cos(angle)/2, center.lng + distance * Math.sin(angle))
}
