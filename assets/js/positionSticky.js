(function($, window, undefined) {

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
/**
 * @namespace PositionSticky
 * @author Ahmet Katrancı <ahmet@katranci.co.uk>
 */
var PositionSticky = {

  /**
   * @constant
   */
  POS_SCHEME_STATIC:   100,

  /**
   * @constant
   */
  POS_SCHEME_FIXED:    200,

  /**
   * @constant
   */
  POS_SCHEME_ABSOLUTE: 300,

  /**
   * Creates an instance of PositionSticky
   *
   * @param element
   * @param options
   * @returns {PositionSticky}
   * @static
   */
  create: function(element, options) {
    if (typeof options === 'undefined') {
      options = {};
    }
    return Object.create(PositionSticky).init(element, options);
  },

  /**
   * Constructor method
   *
   * @param element {HTMLElement}
   * @param options {Object}
   * @returns {PositionSticky}
   * @instance
   */
  init: function(element, options) {
    this.constructor = PositionSticky;
    this.window = window;
    this.element = element;
    this.container = element.parentNode;
    this.posScheme = PositionSticky.POS_SCHEME_STATIC;
    this.isTicking = false;
    this.threshold = null;
    this.options = options;
    this.boundingBoxHeight = null;
    this.latestKnownScrollY = this.window.pageYOffset;

    this.validateContainerPosScheme();
    this.setOffsetTop();
    this.setOffsetBottom();
    this.calcThreshold();
    this.setElementWidth();
    this.setBoundingBoxHeight();
    this.createPlaceholder();
    this.subscribeToWindowScroll();

    return this;
  },

  /**
   * Ensures that the container's position is either 'relative' or 'absolute'
   * so that when the sticky element is positioned absolutely it is positioned within its container
   *
   * @instance
   */
  validateContainerPosScheme: function() {
    var containerPosScheme = this.container.style.position;
    if (containerPosScheme != 'relative' && containerPosScheme != 'absolute') {
      this.container.style.position = 'relative';
    }
  },

  /**
   * Sets the distance that the sticky element will have from the top of viewport
   * when it becomes sticky
   *
   * @instance
   */
  setOffsetTop: function() {
    if (typeof this.options.offsetTop === 'number' && this.options.offsetTop >= 0) {
      this.offsetTop = this.options.offsetTop;
    } else {
      var topBorderWidth = parseInt(this.window.getComputedStyle(this.container).borderTopWidth, 10);
      var topPadding = parseInt(this.window.getComputedStyle(this.container).paddingTop, 10);
      this.offsetTop = topBorderWidth + topPadding;
    }
  },

  /**
   * Sets the distance that the sticky element will have from the bottom of its container
   * when it is positioned absolutely
   *
   * @instance
   */
  setOffsetBottom: function() {
    var bottomBorderWidth = parseInt(this.window.getComputedStyle(this.container).borderBottomWidth, 10);
    var bottomPadding = parseInt(this.window.getComputedStyle(this.container).paddingBottom, 10);
    this.offsetBottom = bottomBorderWidth + bottomPadding;
  },

  /**
   * Calculates the point where the sticky behaviour should start
   *
   * @instance
   */
  calcThreshold: function() {
    this.threshold = this.getElementDistanceFromDocumentTop() - this.offsetTop;
  },

  /**
   * Applies element's computed width to its inline styling so that when the element
   * is positioned absolutely or fixed it doesn't lose its shape
   *
   * @instance
   */
  setElementWidth: function() {
    var width = this.window.getComputedStyle(this.element).width;
    this.element.style.width = width;
  },

  /**
   * Saves element's bounding box height to an instance property so that it is not
   * calculated on every #update. When updatePlaceholder boolean is true, it also
   * updates the placeholder's height.
   *
   * @param updatePlaceholder {boolean}
   * @instance
   */
  setBoundingBoxHeight: function(updatePlaceholder) {
    this.boundingBoxHeight = this.element.getBoundingClientRect().height;
    if (updatePlaceholder === true) {
      this.placeholder.style.height = this.boundingBoxHeight + 'px';
    }
  },

  /**
   * Creates the placeholder that will be used in place of the element
   * when the element is positioned absolutely or fixed
   *
   * @instance
   */
  createPlaceholder: function() {
    var placeholder = document.createElement('DIV');

    var width   = this.element.getBoundingClientRect().width + 'px';
    var height  = this.boundingBoxHeight + 'px';
    var margin  = this.window.getComputedStyle(this.element).margin;
    var float   = this.window.getComputedStyle(this.element).float; // TODO: Doesn't work on Firefox

    placeholder.style.display = 'none';
    placeholder.style.width   = width;
    placeholder.style.height  = height;
    placeholder.style.margin  = margin;
    placeholder.style.float   = float;

    this.container.insertBefore(placeholder, this.element);
    this.placeholder = placeholder;
  },

  /**
   * Attaches #onScroll method to Window.onscroll event
   *
   * @instance
   */
  subscribeToWindowScroll: function() {
    this.window.addEventListener('scroll', this.onScroll.bind(this));
  },

  /**
   * Debounces the scroll event
   *
   * @see [Debouncing Scroll Events]{@link http://www.html5rocks.com/en/tutorials/speed/animations/#debouncing-scroll-events}
   * @instance
   *
   * @todo Don't run update when container is not visible
   */
  onScroll: function() {
    if (!this.isTicking) {
      this.latestKnownScrollY = this.window.pageYOffset;
      this.window.requestAnimationFrame(this.update.bind(this));
      this.isTicking = true;
    }
  },

  /**
   * @returns {boolean}
   * @instance
   */
  isStatic: function() {
    return this.posScheme === PositionSticky.POS_SCHEME_STATIC;
  },

  /**
   * @instance
   */
  makeStatic: function() {
    this.element.style.position = 'static';
    this.placeholder.style.display = 'none';
    this.posScheme = PositionSticky.POS_SCHEME_STATIC;
  },

  /**
   * @returns {boolean}
   * @instance
   */
  isFixed: function() {
    return this.posScheme === PositionSticky.POS_SCHEME_FIXED;
  },

  /**
   * @instance
   */
  makeFixed: function() {
    this.element.style.bottom = null;
    this.element.style.position = 'fixed';
    this.element.style.top = this.offsetTop + 'px';
    this.placeholder.style.display = 'block';
    this.posScheme = PositionSticky.POS_SCHEME_FIXED;
  },

  /**
   * @returns {boolean}
   * @instance
   */
  isAbsolute: function() {
    return this.posScheme === PositionSticky.POS_SCHEME_ABSOLUTE;
  },

  /**
   * @instance
   */
  makeAbsolute: function() {
    this.element.style.top = null;
    this.element.style.position = 'absolute';
    this.element.style.bottom = this.offsetBottom + 'px';
    this.placeholder.style.display = 'block';
    this.posScheme = PositionSticky.POS_SCHEME_ABSOLUTE;
  },

  /**
   * This is the main method that runs on every animation frame during scroll.
   * It starts with checking whether the element is within the static range.
   * If not, it checks whether the element is within the fixed range.
   * Otherwise, it positions the element absolutely.
   *
   * @instance
   */
  update: function() {
    this.isTicking = false;

    if (this.isBelowThreshold()) {
      if (!this.isStatic()) {
        this.makeStatic();
      }
    } else if (this.canStickyFitInContainer()) {
      if (!this.isFixed()) {
        this.makeFixed();
      }
    } else {
      if (!this.isAbsolute()) {
        this.makeAbsolute();
      }
    }
  },

  /**
   * Returns true when the page hasn't been scrolled to the threshold point yet.
   * Otherwise, returns false.
   *
   * @returns {boolean}
   * @instance
   */
  isBelowThreshold: function() {
    if (this.latestKnownScrollY < this.threshold) {
      return true;
    }
    return false;
  },

  /**
   * Checks whether the element can fit inside the visible portion of the container or not
   *
   * @returns {boolean}
   * @instance
   */
  canStickyFitInContainer: function() {
    return this.getAvailableSpaceInContainer() >= this.boundingBoxHeight;
  },

  /**
   * Calculates the height of the visible portion of the container
   * that can be used to fit the sticky element
   *
   * @returns {number}
   * @instance
   */
  getAvailableSpaceInContainer: function() {
    return this.container.getBoundingClientRect().bottom - this.offsetBottom - this.offsetTop;
  },

  /**
   * Calculates element's total offset from the document top.
   * It uses placeholder if page is scrolled and element became sticky already.
   *
   * @returns {number}
   * @instance
   */
  getElementDistanceFromDocumentTop: function() {
    var element = (this.isStatic() ? this.element : this.placeholder);
    var totalOffsetTop = this.latestKnownScrollY + element.getBoundingClientRect().top;
    return totalOffsetTop;
  },

  /**
   * Re-measures the cached positions/dimensions that are used during scroll
   *
   * @instance
   */
  refresh: function() {
    this.calcThreshold();
    this.setBoundingBoxHeight(true);
  }

};
$.fn.positionSticky = function(options) {

  return this.each(function() {
    var $this = $(this);
    var data  = $this.data('positionSticky');

    if (!data) {
      $this.data('positionSticky', (data = PositionSticky.create(this, options)));
    }

    if (typeof options === 'string') {
      data[options]();
    }
  });

};

})(jQuery, window);