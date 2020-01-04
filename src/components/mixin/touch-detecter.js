/**
 * Created by alexey2baranov on 07.02.17.
 */

const touchDetector= {
  created() {
    this.isTouchDevice =
        global.navigator &&
        (('ontouchstart' in global)
            || (global.navigator.MaxTouchPoints > 0)
            || (global.navigator.msMaxTouchPoints > 0))
    if (this.isTouchDevice) {
      // console.log("isTouchDevice")
    }
  }
}

export default  touchDetector
