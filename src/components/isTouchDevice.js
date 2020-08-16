/**
 * Created by alexey2baranov on 07.02.17.
 */

export default function () {
  return global.navigator &&
    (
      ('ontouchstart' in global)
      || (global.navigator.MaxTouchPoints > 0)
      || (global.navigator.msMaxTouchPoints > 0)
    )
}
