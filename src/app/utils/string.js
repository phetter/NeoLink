
/**
 * @param {arrayBuffer} buf
 * @returns {string} ASCII string
 */
export const ab2str = buf =>
  String.fromCharCode.apply(null, new Uint8Array(buf))

/**
 * @param {string} str - HEX string
 * @returns {number[]}
 */
export const hexstring2ab = str => {
  // ensureHex(str)
  if (!str.length) return new Uint8Array()
  const iters = str.length / 2
  const result = new Uint8Array(iters)
  for (let i = 0; i < iters; i++) {
    result[i] = parseInt(str.substring(0, 2), 16)
    str = str.substring(2)
  }
  return result
}

/**
 * @param {string} hexstring - HEX string
 * @returns {string} ASCII string
 */
export const hexstring2str = hexstring => ab2str(hexstring2ab(hexstring))
