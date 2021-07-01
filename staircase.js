export default class Staircase {
  /**
   * Constructor
   *
   * @constructor
   * @param {number} [min=1] - lowest level on the staircase
   * @param {number} [max=10] - highest level on the staircase
   * @param {number} [start=min] - starting position on the staircase
   * @param {object} [up] - parameters for moving "up" the staircase
   * @param {number} [up.increment=+1] - number of steps and direction when moving "up"
   * @param {int} [up.repeatsToMove=1] - number of consecutive `moveUp()` before moving "up"
   * @param {object} [down] - parameters for moving "down" the staircase
   * @param {number} [down.increment=-1] - number of steps and direction when moving "down"
   * @param {int} [down.repeatsToMove=1] - number of consecutive `moveDown()` before moving "down"
   */
  constructor(
      min = 1, max = 10, start = min,
      up = {increment: +1, repeatsToMove: 1},
      down = {increment: -1, repeatsToMove: 1},
  ) {
    this.minimum = min;
    this.maximum = max;
    this.up = up;
    this.down = down;
    this.currentStep = start;
    this.repeats = {up: 0, down: 0};
    this.reversals = 0;
    this.lastStepDirection = null;
    this.history = [];
    this._start = start;
  }

  /**
   * Attempt to move "up". Moves "up" if consecutive repeats = up.repeatsToMove
   *
   * @returns {boolean|number} new currentStep, false if no movement
   */
  moveUp() {
    return this._move('up');
  }

  /**
   * Attempt to move "down". Moves "down" if consecutive repeats = down.repeatsToMove
   *
   * @returns {boolean|number} new currentStep, false if no movement
   */
  moveDown() {
    return this._move('down');
  }

  /**
   *
   * @param {string} direction - 'up' or 'down'
   * @returns {boolean|number} new stepNumber, false if no movement
   * @private
   */
  _move(direction) {
    const otherDirection = (direction === 'up') ? 'down' : 'up';
    this.repeats[otherDirection] = 0;
    this.history.push(this.currentStep);
    if (++this.repeats[direction] >= this[direction].repeatsToMove) {
      this.repeats[direction] = 0;
      if (this._start) {
        if (this._start === this._bindValue(this.currentStep + this[direction].increment)) {
          return this.currentStep;
        } else {
          this._start = undefined;
        }
      }
      if (Math.sign(this.lastStepDirection) === Math.sign(this[otherDirection].increment)) {
        this.reversals++;
      }
      this.lastStepDirection = this[direction].increment;
      return this.currentStep = this._bindValue(this.currentStep + this[direction].increment);
    } else {
      return false;
    }
  }

  /**
   * Bind value within range (inclusive, min/max reversible)
   *
   * @param {number} value
   * @return {number} value, or min or max
   * @private
   */
  _bindValue(value) {
    if (this.maximum > this.minimum) {
      return (value > this.maximum)
          ? this.maximum
          : (value < this.minimum)
              ? this.minimum
              : value;
    } else {
      return (value > this.minimum)
          ? this.minimum
          : (value < this.maximum)
              ? this.maximum
              : value;
    }
  }
}

window.Staircase = Staircase;