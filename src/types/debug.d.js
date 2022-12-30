/**
 * @typedef {Object} PlayerDebugParams
 * @property {number} axisX - Player position on X axis
 * @property {number} axisY - Player position on Y axis
 * @property {number} coordX - Player position on X axis in tiles
 * @property {number} coordY - Player position on Y axis in tiles
 * @property {string} state - Player current state
 * @property {string} arrows - Arrows pressed
 */

/**
 * @typedef {Object} GameDebugParams
 * @property {string} timeDraw - Time to draw
 * @property {string} timeUpdate - Time to update
 * @property {string} timeStart - Total time
 */

/**
 * @typedef {Object} MapDebugParams
 * @property {number} tiles - Number of tiles in buffer
 * @property {number} visibleTiles - Number of visible tiles
 * @property {number} backgroundItems - Number of background items in buffer
 * @property {number} visibleBackgroundItems - Number of visible background items
 */