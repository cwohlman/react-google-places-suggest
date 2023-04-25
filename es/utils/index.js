var _typeof =
  typeof Symbol === "function" && typeof Symbol.iterator === "symbol"
    ? function(obj) {
        return typeof obj
      }
    : function(obj) {
        return obj &&
          typeof Symbol === "function" &&
          obj.constructor === Symbol &&
          obj !== Symbol.prototype
          ? "symbol"
          : typeof obj
      }

export function deepEqual(x, y) {
  if (x === y) {
    return true
  } else if (
    (typeof x === "undefined" ? "undefined" : _typeof(x)) == "object" &&
    x != null &&
    (typeof y === "undefined" ? "undefined" : _typeof(y)) == "object" &&
    y != null
  ) {
    if (Object.keys(x).length != Object.keys(y).length) return false

    for (var prop in x) {
      if (y.hasOwnProperty(prop)) {
        if (!deepEqual(x[prop], y[prop])) return false
      } else return false
    }

    return true
  } else return false
}