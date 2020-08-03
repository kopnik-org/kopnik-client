export default function (value, delta=0.1) {
    delta= Math.random()*delta/2
    if (Math.random()>0.5){
        delta= -delta
    }
    return value* (1+delta)
}
