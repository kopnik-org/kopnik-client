import Kopnik from "@/models/Kopnik";
import snowflake from "@/utils/snow/snowflake";

export default async function snow () {
  const east = await snowflake({
    location: {
      lat: 61,
      lng: 100,
    },
    distance: 15,
    iterations: 4 ,
    foreman: Kopnik.getReference(1),
  })

  const west = await snowflake({
    location: {
      lat: 51,
      lng: 24,
    },
    distance: 10,
    iterations: 6,
    foreman: Kopnik.getReference(1),
  })
  // return; 8h-

  const middle = await snowflake({
    location: {
      "lat": 55.085,
      "lng": 38.784,
    },
    distance: 10,
    iterations: 6    ,
    foreman: Kopnik.getReference(1),
  })

  const moscow = await snowflake({
    location: {
      lat: 55.749,
      lng: 37.613,
    },
    distance: 0.2,
    iterations: 5,
    foreman: middle,
  })

  const na = await snowflake({
    location: {
      "lat":42.467,
      "lng":-96.425
    },
    distance: 20,
    iterations: 4 ,
    foreman: west,
  })

  const sa = await snowflake({
    location: {
      "lat":-13.424,
      "lng":-57.978
    },
    distance: 10,
    iterations: 4,
    foreman: na,
  })


  const china = await snowflake({
    location: {
      "lat":34.232,
      "lng":103.763
    },
    distance: 10,
    iterations: 4,
    foreman: east,
  })

  const af = await snowflake({
    location: {
      "lat":7.274,
      "lng":24.773
    },
    distance: 20,
    iterations: 4,
    foreman: west,
  })

  const australia = await snowflake({
    location: {
      "lat":-25.051,
      "lng":135.168
    },
    distance: 15,
    iterations: 4,
    foreman: east,
  })
}
