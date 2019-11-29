export default function scalar(target, name, descriptor) {

    descriptor.get = () => {
        console.debug('old target', target)

        console.log('load new target: call path/${this.constructor.name}/get')

        target= new Date()
        return target
    }
}