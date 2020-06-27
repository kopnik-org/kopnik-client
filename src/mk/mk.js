import {container} from "../bottle"

/**
 * Mock VK for tests
 */
export default class MK {
    static get logger() {
        container.logger.getLogger('MK')
    }

    static get Widgets() {
        return {
            AllowMessagesFromCommunity() {
                this.logger.debug('AllowMessagesFromCommunity', arguments)
            },
        }
    }

    static get Observer() {
        return {
            subscribe() {
                this.logger.debug('subscribe', arguments)
            },
            unsubscribe() {
                this.logger.debug('unsubscribe', arguments)
            },
        }
    }
}
