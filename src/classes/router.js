'use strict'

const Base = require('./base')

/**
 * @class Router
 * @extends Base
 */
module.exports = class Router extends Base {
  /**
   * @method map
   * @static
   * @param {Object} definition
   */
  static map (definition) {
    this.definition = definition
  }
}