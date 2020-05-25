import api from "../../src/api";


/**
 * reset test DB
 * use with carefully. it may damage another test that runs parallel
 *
 * @returns {Promise<*|undefined>}
 */
export default function () {
    return api('test/setupDB')
}
