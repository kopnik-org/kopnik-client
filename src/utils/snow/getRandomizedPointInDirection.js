import {LatLng, LatLngBounds} from 'leaflet'

import randomize from "./randomize";
/**
 *
 * @param {LatLng} center
 * @param {number} radius
 * @param {number} angle
 */
export default function (center, radius, angle) {
    angle = randomize(angle)
    radius = randomize(radius)
    return new LatLng(center.lat + radius * Math.cos(angle), center.lng + radius * Math.sin(angle))
}
