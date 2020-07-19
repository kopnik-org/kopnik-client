import {container} from "../bottle/bottle"

/**
 * Mock VK for tests
 */
export default class MK {
    static get logger() {
        return container.logger.getLogger('MK')
    }

    static get Widgets() {
        return {
            AllowMessagesFromCommunity() {
                MK.logger.debug('AllowMessagesFromCommunity', arguments)
            },
        }
    }

    static get Observer() {
        return {
            subscribe() {
                MK.logger.debug('subscribe', arguments)
            },
            unsubscribe() {
                MK.logger.debug('unsubscribe', arguments)
            },
        }
    }
}
