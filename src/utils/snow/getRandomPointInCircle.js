import {LatLng, LatLngBounds} from 'leaflet'

/**
 *
 * @param {LatLng} center
 * @param {number} radius
 * @param {number} angle
 */
export default function (center, radius, angle) {
    angle = angle
    // const distance = Math.random() * radius
    const distance = radius
    return new LatLng(center.lat + distance * Math.cos(angle), center.lng + distance * Math.sin(angle))
}
