// @flow
import BigNumber from 'bignumber.js'

import util from 'util'
const BN = BigNumber

// https://stackoverflow.com/questions/4912788/truncate-not-round-off-decimal-numbers-in-javascript
export const truncateNumber = (num, places) =>
  Math.trunc(num * 10 ** places) / 10 ** places

// https://github.com/MikeMcl/bignumber.js/issues/11
export const toBigNumber = (value) =>
  new BigNumber(String(value))

export const toNumber = (value) =>
  toBigNumber(value).toNumber()

export const isZero = (amount) =>
  toBigNumber(amount).equals(0)

export const isNumber = (value) => {
  try {
    toBigNumber(value)
    return true
  } catch (e) {
    return false
  }
}

/**
 * @class Fixed8
 * @classdesc A wrapper around bignumber.js that adds on helper methods commonly used in neon-js
 * @param {string|int} value
 * @param {number} [base]
 */
export class Fixed8 extends BN {
  constructor (input, base = undefined) {
    if (typeof input === 'number') input = input.toFixed(8)
    super(input, base)
  }

  toHex () {
    const hexstring = this.times(100000000).round(0).toString(16)
    return '0'.repeat(16 - hexstring.length) + hexstring
  }

  // toReverseHex () {
  //   return reverseHex(this.toHex())
  // }

  [util.inspect.custom] (depth, opts) {
    return this.toFixed(8)
  }

  static fromHex (hex) {
    return new Fixed8(hex, 16).div(100000000)
  }

  // static fromReverseHex (hex) {
  //   return this.fromHex(reverseHex(hex))
  // }

  /**
   * Returns a Fixed8 whose value is rounded upwards to the next whole number.
   * @return {Fixed8}
   */
  ceil () {
    return new Fixed8(super.ceil())
  }

  /**
   * Returns a Fixed8 whose value is rounded downwards to the previous whole number.
   * @return {Fixed8}
   */
  floor () {
    return new Fixed8(super.floor())
  }

  /**
   * Returns a Fixed8 rounded to the nearest dp decimal places according to rounding mode rm.
   * If dp is null, round to whole number.
   * If rm is null, round according to default rounding mode.
   * @param {number} [dp]
   * @param {number} [rm]
   * @return {Fixed8}
   */
  round (dp = null, rm = null) {
    return new Fixed8(super.round(dp, rm))
  }

  /**
   * See [[dividedBy]]
   * @param {string|number|Fixed8}
   * @param {number} [base]
   * @return {Fixed8}
   */
  div (n, base = null) {
    return this.dividedBy(n, base)
  }

  /**
   * Returns a Fixed8 whose value is the value of this Fixed8 divided by `n`
   * @param {string|number|Fixed8}
   * @param {number} [base]
   * @return {Fixed8}
   * @alias [[div]]
   */
  dividedBy (n, base = null) {
    return new Fixed8(super.dividedBy(n, base))
  }

  /**
   * See [[times]]
   * @param {string|number|Fixed8}
   * @param {number} [base]
   * @return {Fixed8}
   */
  mul (n, base = null) {
    return this.times(n, base)
  }

  /**
   * Returns a Fixed8 whose value is the value of this Fixed8 multipled by `n`
   * @param {string|number|Fixed8}
   * @param {number} [base]
   * @return {Fixed8}
   * @alias [[mul]]
   */
  times (n, base = null) {
    return new Fixed8(super.times(n, base))
  }

  /**
   * See [[plus]]
   * @param {string|number|Fixed8}
   * @param {number} [base]
   * @return {Fixed8}
   */
  add (n, base = null) {
    return this.plus(n, base)
  }

  /**
   * Returns a Fixed8 whose value is the value of this Fixed8 plus `n`
   * @param {string|number|Fixed8}
   * @param {number} [base]
   * @return {Fixed8}
   * @alias [[add]]
   */
  plus (n, base = null) {
    return new Fixed8(super.plus(n, base))
  }

  /**
   * See [[minus]]
   * @param {string|number|Fixed8}
   * @param {number} [base]
   * @return {Fixed8}
   */
  sub (n, base = null) {
    return this.minus(n, base)
  }

  /**
   * Returns a Fixed8 whose value is the value of this Fixed8 minus `n`
   * @param {string|number|Fixed8}
   * @param {number} [base]
   * @return {Fixed8}
   * @alias [[sub]]
   */
  minus (n, base = null) {
    return new Fixed8(super.minus(n, base))
  }
}
