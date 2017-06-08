/*
	By Osvaldas Valutis, www.osvaldas.info
	Available for use under the MIT License
*/

;( function( $, window, document, undefined )
{
	var s = document.body || document.documentElement, s = s.style, prefixAnimation = '', prefixTransition = '';

	if( s.WebkitAnimation == '' )	prefixAnimation	 = '-webkit-';
	if( s.MozAnimation == '' )		prefixAnimation	 = '-moz-';
	if( s.OAnimation == '' )		prefixAnimation	 = '-o-';

	if( s.WebkitTransition == '' )	prefixTransition = '-webkit-';
	if( s.MozTransition == '' )		prefixTransition = '-moz-';
	if( s.OTransition == '' )		prefixTransition = '-o-';

	$.fn.extend(
	{
		onCSSAnimationEnd: function( callback )
		{
			var $this = $( this ).eq( 0 );
			$this.one( 'webkitAnimationEnd mozAnimationEnd oAnimationEnd oanimationend animationend', callback );
			if( ( prefixAnimation == '' && !( 'animation' in s ) ) || $this.css( prefixAnimation + 'animation-duration' ) == '0s' ) callback();
			return this;
		},
		onCSSTransitionEnd: function( callback )
		{
			var $this = $( this ).eq( 0 );
			$this.one( 'webkitTransitionEnd mozTransitionEnd oTransitionEnd otransitionend transitionend', callback );
			if( ( prefixTransition == '' && !( 'transition' in s ) ) || $this.css( prefixTransition + 'transition-duration' ) == '0s' ) callback();
			return this;
		}
	});
})( jQuery, window, document );
/*!
 * Macy.js v1.1.2 - Macy is a lightweight, dependency free, masonry layout library
 * Author: Copyright (c) Big Bite Creative <@bigbitecreative> <http://bigbitecreative.com>
 * Url: http://macyjs.com/
 * License: MIT
 */
(function(root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], function() {
      return factory();
    });
  } else if (typeof exports === "object") {
    module.exports = factory();
  } else {
    root.Macy = factory();
  }
})(this, function() {
  "use strict";
  var extend = function(objects) {
    var extended = {};
    var i = 1;
    var prop;
    var merge = function(obj) {
      for (prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
          if (Object.prototype.toString.call(obj[prop]) === "[object Object]") {
            extended[prop] = extend(extended[prop], obj[prop]);
          } else {
            extended[prop] = obj[prop];
          }
        }
      }
    };
    merge(arguments[0]);
    for (i = 1; i < arguments.length; i++) {
      var obj = arguments[i];
      merge(obj);
    }
    return extended;
  };
  var Macy = {};
  Macy.VERSION = "1.1.2";
  Macy.settings = {};
  var defaults = {
    columns: 3,
    margin: 2,
    trueOrder: true,
    waitForImages: false
  };
  var cache = {
    options: {}
  };
  var imgsRequired, currentlyLoaded;
  var getCurrentColumns = function() {
    var docWidth = document.body.clientWidth;
    var noOfColumns;
    for (var widths in cache.options.breakAt) {
      if (docWidth < widths) {
        noOfColumns = cache.options.breakAt[widths];
        break;
      }
    }
    if (!noOfColumns) {
      noOfColumns = cache.options.columns;
    }
    return noOfColumns;
  };
  var getColumnWidths = function(marginIncluded) {
    marginIncluded = typeof marginIncluded !== "undefined" ? marginIncluded : true;
    var noOfColumns = getCurrentColumns();
    var margins;
    if (!marginIncluded) {
      return 100 / noOfColumns;
    }
    if (noOfColumns === 1) {
      return 100 + "%";
    }
    margins = (noOfColumns - 1) * cache.options.margin / noOfColumns;
    return "calc(" + 100 / noOfColumns + "% - " + margins + "px)";
  };
  var setWidths = function() {
    var percentageWidth = getColumnWidths();
    each(cache.elements, function(index, val) {
      val.style.width = percentageWidth;
      val.style.position = "absolute";
    });
  };
  var getLeftValue = function(col) {
    var noOfColumns = getCurrentColumns();
    var totalLeft = 0;
    var margin, str;
    col++;
    if (col === 1) {
      return 0;
    }
    margin = (cache.options.margin - (noOfColumns - 1) * cache.options.margin / noOfColumns) * (col - 1);
    totalLeft += getColumnWidths(false) * (col - 1);
    str = "calc(" + totalLeft + "% + " + margin + "px)";
    return str;
  };
  var getTopValue = function(row, col, eles) {
    var totalHeight = 0;
    var tempHeight;
    if (row === 0) {
      return 0;
    }
    for (var i = 0; i < row; i++) {
      tempHeight = parseInt(getProperty(cache.elements[eles[i]], "height").replace("px", ""), 10);
      totalHeight += isNaN(tempHeight) ? 0 : tempHeight + cache.options.margin;
    }
    return totalHeight;
  };
  var reOrder = function(columns) {
    var col = 0;
    var elements2d = [];
    var tempIndexs = [];
    var indexArray = [];
    each(cache.elements, function(index) {
      col++;
      if (col > columns) {
        col = 1;
        elements2d.push(tempIndexs);
        tempIndexs = [];
      }
      tempIndexs.push(index);
    });
    elements2d.push(tempIndexs);
    for (var i = 0, elements2dLen = elements2d.length; i < elements2dLen; i++) {
      var eleIndexs = elements2d[i];
      for (var j = 0, eleIndexsLen = eleIndexs.length; j < eleIndexsLen; j++) {
        indexArray[j] = typeof indexArray[j] === "undefined" ? [] : indexArray[j];
        indexArray[j].push(eleIndexs[j]);
      }
    }
    cache.rows = indexArray;
    setPosition(false);
  };
  var shuffleOrder = function(columns) {
    var eles = cache.elements;
    var element2dArray = [];
    var overflowEles = [];
    for (var i = 0; i < columns; i++) {
      element2dArray[i] = [];
    }
    for (var k = 0; k < eles.length; k++) {
      overflowEles.push(k);
    }
    for (var v = 0, overflowElesLen = overflowEles.length; v < overflowElesLen; v++) {
      var index = findIndexOfSmallestTotal(element2dArray);
      element2dArray[index] = typeof element2dArray[index] === "undefined" ? [] : element2dArray[index];
      element2dArray[index].push(overflowEles[v]);
    }
    cache.rows = element2dArray;
    setPosition(true);
  };
  var setPosition = function(alternate) {
    alternate = alternate || false;
    var eles = cache.elements;
    var element2dArray = cache.rows;
    for (var i = 0, element2dArrayLen = element2dArray.length; i < element2dArrayLen; i++) {
      var rowArray = alternate ? bubbleSort(element2dArray[i]) : element2dArray[i];
      for (var j = 0, rowArrayLen = rowArray.length; j < rowArrayLen; j++) {
        var left, top;
        left = getLeftValue(i);
        top = getTopValue(j, i, rowArray, alternate);
        eles[rowArray[j]].style.top = top + "px";
        eles[rowArray[j]].style.left = left;
      }
    }
  };
  var findIndexOfSmallestTotal = function(arr) {
    var runningTotal = 0;
    var smallestIndex, smallest, lastSmall, tempHeight;
    for (var i = 0, arrLen = arr.length; i < arrLen; i++) {
      for (var j = 0; j < arr[i].length; j++) {
        tempHeight = parseInt(getProperty(cache.elements[arr[i][j]], "height").replace("px", ""), 10);
        runningTotal += isNaN(tempHeight) ? 0 : tempHeight;
      }
      lastSmall = smallest;
      smallest = smallest === undefined ? runningTotal : smallest > runningTotal ? runningTotal : smallest;
      if (lastSmall === undefined || lastSmall > smallest) {
        smallestIndex = i;
      }
      runningTotal = 0;
    }
    return smallestIndex;
  };
  var getProperty = function(element, value) {
    return window.getComputedStyle(element, null).getPropertyValue(value);
  };
  var findLargestColumn = function() {
    var arr = cache.rows;
    var highest = 0, runningTotal = 0;
    for (var i = 0, arrLen = arr.length; i < arrLen; i++) {
      for (var j = 0; j < arr[i].length; j++) {
        runningTotal += parseInt(getProperty(cache.elements[arr[i][j]], "height").replace("px", ""), 10);
        runningTotal += j !== 0 ? cache.options.margin : 0;
      }
      highest = highest < runningTotal ? runningTotal : highest;
      runningTotal = 0;
    }
    return highest;
  };
  var recalculate = function() {
    var columns = getCurrentColumns();
    if (columns === 1) {
      cache.container.style.height = "auto";
      each(cache.elements, function(index, ele) {
        ele.removeAttribute("style");
      });
      return;
    }
    setWidths();
    cache.elements = cache.container.children;
    if (!cache.options.trueOrder) {
      shuffleOrder(columns);
      setContainerHeight();
      return;
    }
    reOrder(columns);
    setContainerHeight();
  };
  var setContainerHeight = function() {
    cache.container.style.height = findLargestColumn() + "px";
  };
  var bubbleSort = function(list) {
    var arr = list;
    var n = arr.length - 1;
    for (var i = 0; i < n; i++) {
      for (var j = 0; j < n; j++) {
        if (arr[j] > arr[j + 1]) {
          var temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
        }
      }
    }
    return arr;
  };
  var ele = function(selector) {
    return document.querySelector(selector);
  };
  var eles = function(selector) {
    var nl = document.querySelectorAll(selector);
    var arr = [];
    for (var i = nl.length - 1; i >= 0; i--) {
      if (nl[i].offsetParent !== null) {
        arr.unshift(nl[i]);
      }
    }
    return arr;
  };
  var each = function(arr, func) {
    for (var i = 0, arrLen = arr.length; i < arrLen; i++) {
      func(i, arr[i]);
    }
  };
  var imagesLoaded = function(during, after) {
    during = during || false;
    after = after || false;
    if (typeof during === "function") {
      during();
    }
    if (currentlyLoaded >= imgsRequired && typeof after === "function") {
      after();
    }
  };
  var remove = function() {
    each(cache.container.children, function(index, ele) {
      ele.removeAttribute("style");
    });
    cache.container.removeAttribute("style");
    window.removeEventListener("resize", recalculate);
  };
  var calculateOnImageLoad = function(during, after) {
    var imgs = eles("img");
    imgsRequired = imgs.length - 1;
    currentlyLoaded = 0;
    each(imgs, function(i, img) {
      if (img.complete) {
        currentlyLoaded++;
        imagesLoaded(during, after);
        return;
      }
      img.addEventListener("load", function() {
        currentlyLoaded++;
        imagesLoaded(during, after);
      });
      img.addEventListener("error", function() {
        imgsRequired--;
        imagesLoaded(during, after);
      });
    });
  };
  Macy.init = function(options) {
    if (!options.container) {
      return;
    }
    cache.container = ele(options.container);
    if (!cache.container) {
      return;
    }
    delete options.container;
    cache.options = extend(defaults, options);
    window.addEventListener("resize", recalculate);
    cache.container.style.position = "relative";
    cache.elements = cache.container.children;
    if (!cache.options.waitForImages) {
      recalculate();
      calculateOnImageLoad(function() {
        recalculate();
      });
      return;
    }
    calculateOnImageLoad(null, function() {
      recalculate();
    });
  };
  Macy.recalculate = recalculate;
  Macy.onImageLoad = calculateOnImageLoad;
  Macy.remove = remove;
  return Macy;
});
/*!
 * Masonry PACKAGED v4.1.1
 * Cascading grid layout library
 * http://masonry.desandro.com
 * MIT License
 * by David DeSandro
 */

!function(t,e){"function"==typeof define&&define.amd?define("jquery-bridget/jquery-bridget",["jquery"],function(i){return e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("jquery")):t.jQueryBridget=e(t,t.jQuery)}(window,function(t,e){"use strict";function i(i,r,a){function h(t,e,n){var o,r="$()."+i+'("'+e+'")';return t.each(function(t,h){var u=a.data(h,i);if(!u)return void s(i+" not initialized. Cannot call methods, i.e. "+r);var d=u[e];if(!d||"_"==e.charAt(0))return void s(r+" is not a valid method");var l=d.apply(u,n);o=void 0===o?l:o}),void 0!==o?o:t}function u(t,e){t.each(function(t,n){var o=a.data(n,i);o?(o.option(e),o._init()):(o=new r(n,e),a.data(n,i,o))})}a=a||e||t.jQuery,a&&(r.prototype.option||(r.prototype.option=function(t){a.isPlainObject(t)&&(this.options=a.extend(!0,this.options,t))}),a.fn[i]=function(t){if("string"==typeof t){var e=o.call(arguments,1);return h(this,t,e)}return u(this,t),this},n(a))}function n(t){!t||t&&t.bridget||(t.bridget=i)}var o=Array.prototype.slice,r=t.console,s="undefined"==typeof r?function(){}:function(t){r.error(t)};return n(e||t.jQuery),i}),function(t,e){"function"==typeof define&&define.amd?define("ev-emitter/ev-emitter",e):"object"==typeof module&&module.exports?module.exports=e():t.EvEmitter=e()}("undefined"!=typeof window?window:this,function(){function t(){}var e=t.prototype;return e.on=function(t,e){if(t&&e){var i=this._events=this._events||{},n=i[t]=i[t]||[];return-1==n.indexOf(e)&&n.push(e),this}},e.once=function(t,e){if(t&&e){this.on(t,e);var i=this._onceEvents=this._onceEvents||{},n=i[t]=i[t]||{};return n[e]=!0,this}},e.off=function(t,e){var i=this._events&&this._events[t];if(i&&i.length){var n=i.indexOf(e);return-1!=n&&i.splice(n,1),this}},e.emitEvent=function(t,e){var i=this._events&&this._events[t];if(i&&i.length){var n=0,o=i[n];e=e||[];for(var r=this._onceEvents&&this._onceEvents[t];o;){var s=r&&r[o];s&&(this.off(t,o),delete r[o]),o.apply(this,e),n+=s?0:1,o=i[n]}return this}},t}),function(t,e){"use strict";"function"==typeof define&&define.amd?define("get-size/get-size",[],function(){return e()}):"object"==typeof module&&module.exports?module.exports=e():t.getSize=e()}(window,function(){"use strict";function t(t){var e=parseFloat(t),i=-1==t.indexOf("%")&&!isNaN(e);return i&&e}function e(){}function i(){for(var t={width:0,height:0,innerWidth:0,innerHeight:0,outerWidth:0,outerHeight:0},e=0;u>e;e++){var i=h[e];t[i]=0}return t}function n(t){var e=getComputedStyle(t);return e||a("Style returned "+e+". Are you running this code in a hidden iframe on Firefox? See http://bit.ly/getsizebug1"),e}function o(){if(!d){d=!0;var e=document.createElement("div");e.style.width="200px",e.style.padding="1px 2px 3px 4px",e.style.borderStyle="solid",e.style.borderWidth="1px 2px 3px 4px",e.style.boxSizing="border-box";var i=document.body||document.documentElement;i.appendChild(e);var o=n(e);r.isBoxSizeOuter=s=200==t(o.width),i.removeChild(e)}}function r(e){if(o(),"string"==typeof e&&(e=document.querySelector(e)),e&&"object"==typeof e&&e.nodeType){var r=n(e);if("none"==r.display)return i();var a={};a.width=e.offsetWidth,a.height=e.offsetHeight;for(var d=a.isBorderBox="border-box"==r.boxSizing,l=0;u>l;l++){var c=h[l],f=r[c],m=parseFloat(f);a[c]=isNaN(m)?0:m}var p=a.paddingLeft+a.paddingRight,g=a.paddingTop+a.paddingBottom,y=a.marginLeft+a.marginRight,v=a.marginTop+a.marginBottom,_=a.borderLeftWidth+a.borderRightWidth,E=a.borderTopWidth+a.borderBottomWidth,z=d&&s,b=t(r.width);b!==!1&&(a.width=b+(z?0:p+_));var x=t(r.height);return x!==!1&&(a.height=x+(z?0:g+E)),a.innerWidth=a.width-(p+_),a.innerHeight=a.height-(g+E),a.outerWidth=a.width+y,a.outerHeight=a.height+v,a}}var s,a="undefined"==typeof console?e:function(t){console.error(t)},h=["paddingLeft","paddingRight","paddingTop","paddingBottom","marginLeft","marginRight","marginTop","marginBottom","borderLeftWidth","borderRightWidth","borderTopWidth","borderBottomWidth"],u=h.length,d=!1;return r}),function(t,e){"use strict";"function"==typeof define&&define.amd?define("desandro-matches-selector/matches-selector",e):"object"==typeof module&&module.exports?module.exports=e():t.matchesSelector=e()}(window,function(){"use strict";var t=function(){var t=Element.prototype;if(t.matches)return"matches";if(t.matchesSelector)return"matchesSelector";for(var e=["webkit","moz","ms","o"],i=0;i<e.length;i++){var n=e[i],o=n+"MatchesSelector";if(t[o])return o}}();return function(e,i){return e[t](i)}}),function(t,e){"function"==typeof define&&define.amd?define("fizzy-ui-utils/utils",["desandro-matches-selector/matches-selector"],function(i){return e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("desandro-matches-selector")):t.fizzyUIUtils=e(t,t.matchesSelector)}(window,function(t,e){var i={};i.extend=function(t,e){for(var i in e)t[i]=e[i];return t},i.modulo=function(t,e){return(t%e+e)%e},i.makeArray=function(t){var e=[];if(Array.isArray(t))e=t;else if(t&&"number"==typeof t.length)for(var i=0;i<t.length;i++)e.push(t[i]);else e.push(t);return e},i.removeFrom=function(t,e){var i=t.indexOf(e);-1!=i&&t.splice(i,1)},i.getParent=function(t,i){for(;t!=document.body;)if(t=t.parentNode,e(t,i))return t},i.getQueryElement=function(t){return"string"==typeof t?document.querySelector(t):t},i.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},i.filterFindElements=function(t,n){t=i.makeArray(t);var o=[];return t.forEach(function(t){if(t instanceof HTMLElement){if(!n)return void o.push(t);e(t,n)&&o.push(t);for(var i=t.querySelectorAll(n),r=0;r<i.length;r++)o.push(i[r])}}),o},i.debounceMethod=function(t,e,i){var n=t.prototype[e],o=e+"Timeout";t.prototype[e]=function(){var t=this[o];t&&clearTimeout(t);var e=arguments,r=this;this[o]=setTimeout(function(){n.apply(r,e),delete r[o]},i||100)}},i.docReady=function(t){var e=document.readyState;"complete"==e||"interactive"==e?t():document.addEventListener("DOMContentLoaded",t)},i.toDashed=function(t){return t.replace(/(.)([A-Z])/g,function(t,e,i){return e+"-"+i}).toLowerCase()};var n=t.console;return i.htmlInit=function(e,o){i.docReady(function(){var r=i.toDashed(o),s="data-"+r,a=document.querySelectorAll("["+s+"]"),h=document.querySelectorAll(".js-"+r),u=i.makeArray(a).concat(i.makeArray(h)),d=s+"-options",l=t.jQuery;u.forEach(function(t){var i,r=t.getAttribute(s)||t.getAttribute(d);try{i=r&&JSON.parse(r)}catch(a){return void(n&&n.error("Error parsing "+s+" on "+t.className+": "+a))}var h=new e(t,i);l&&l.data(t,o,h)})})},i}),function(t,e){"function"==typeof define&&define.amd?define("outlayer/item",["ev-emitter/ev-emitter","get-size/get-size"],e):"object"==typeof module&&module.exports?module.exports=e(require("ev-emitter"),require("get-size")):(t.Outlayer={},t.Outlayer.Item=e(t.EvEmitter,t.getSize))}(window,function(t,e){"use strict";function i(t){for(var e in t)return!1;return e=null,!0}function n(t,e){t&&(this.element=t,this.layout=e,this.position={x:0,y:0},this._create())}function o(t){return t.replace(/([A-Z])/g,function(t){return"-"+t.toLowerCase()})}var r=document.documentElement.style,s="string"==typeof r.transition?"transition":"WebkitTransition",a="string"==typeof r.transform?"transform":"WebkitTransform",h={WebkitTransition:"webkitTransitionEnd",transition:"transitionend"}[s],u={transform:a,transition:s,transitionDuration:s+"Duration",transitionProperty:s+"Property",transitionDelay:s+"Delay"},d=n.prototype=Object.create(t.prototype);d.constructor=n,d._create=function(){this._transn={ingProperties:{},clean:{},onEnd:{}},this.css({position:"absolute"})},d.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},d.getSize=function(){this.size=e(this.element)},d.css=function(t){var e=this.element.style;for(var i in t){var n=u[i]||i;e[n]=t[i]}},d.getPosition=function(){var t=getComputedStyle(this.element),e=this.layout._getOption("originLeft"),i=this.layout._getOption("originTop"),n=t[e?"left":"right"],o=t[i?"top":"bottom"],r=this.layout.size,s=-1!=n.indexOf("%")?parseFloat(n)/100*r.width:parseInt(n,10),a=-1!=o.indexOf("%")?parseFloat(o)/100*r.height:parseInt(o,10);s=isNaN(s)?0:s,a=isNaN(a)?0:a,s-=e?r.paddingLeft:r.paddingRight,a-=i?r.paddingTop:r.paddingBottom,this.position.x=s,this.position.y=a},d.layoutPosition=function(){var t=this.layout.size,e={},i=this.layout._getOption("originLeft"),n=this.layout._getOption("originTop"),o=i?"paddingLeft":"paddingRight",r=i?"left":"right",s=i?"right":"left",a=this.position.x+t[o];e[r]=this.getXValue(a),e[s]="";var h=n?"paddingTop":"paddingBottom",u=n?"top":"bottom",d=n?"bottom":"top",l=this.position.y+t[h];e[u]=this.getYValue(l),e[d]="",this.css(e),this.emitEvent("layout",[this])},d.getXValue=function(t){var e=this.layout._getOption("horizontal");return this.layout.options.percentPosition&&!e?t/this.layout.size.width*100+"%":t+"px"},d.getYValue=function(t){var e=this.layout._getOption("horizontal");return this.layout.options.percentPosition&&e?t/this.layout.size.height*100+"%":t+"px"},d._transitionTo=function(t,e){this.getPosition();var i=this.position.x,n=this.position.y,o=parseInt(t,10),r=parseInt(e,10),s=o===this.position.x&&r===this.position.y;if(this.setPosition(t,e),s&&!this.isTransitioning)return void this.layoutPosition();var a=t-i,h=e-n,u={};u.transform=this.getTranslate(a,h),this.transition({to:u,onTransitionEnd:{transform:this.layoutPosition},isCleaning:!0})},d.getTranslate=function(t,e){var i=this.layout._getOption("originLeft"),n=this.layout._getOption("originTop");return t=i?t:-t,e=n?e:-e,"translate3d("+t+"px, "+e+"px, 0)"},d.goTo=function(t,e){this.setPosition(t,e),this.layoutPosition()},d.moveTo=d._transitionTo,d.setPosition=function(t,e){this.position.x=parseInt(t,10),this.position.y=parseInt(e,10)},d._nonTransition=function(t){this.css(t.to),t.isCleaning&&this._removeStyles(t.to);for(var e in t.onTransitionEnd)t.onTransitionEnd[e].call(this)},d.transition=function(t){if(!parseFloat(this.layout.options.transitionDuration))return void this._nonTransition(t);var e=this._transn;for(var i in t.onTransitionEnd)e.onEnd[i]=t.onTransitionEnd[i];for(i in t.to)e.ingProperties[i]=!0,t.isCleaning&&(e.clean[i]=!0);if(t.from){this.css(t.from);var n=this.element.offsetHeight;n=null}this.enableTransition(t.to),this.css(t.to),this.isTransitioning=!0};var l="opacity,"+o(a);d.enableTransition=function(){if(!this.isTransitioning){var t=this.layout.options.transitionDuration;t="number"==typeof t?t+"ms":t,this.css({transitionProperty:l,transitionDuration:t,transitionDelay:this.staggerDelay||0}),this.element.addEventListener(h,this,!1)}},d.onwebkitTransitionEnd=function(t){this.ontransitionend(t)},d.onotransitionend=function(t){this.ontransitionend(t)};var c={"-webkit-transform":"transform"};d.ontransitionend=function(t){if(t.target===this.element){var e=this._transn,n=c[t.propertyName]||t.propertyName;if(delete e.ingProperties[n],i(e.ingProperties)&&this.disableTransition(),n in e.clean&&(this.element.style[t.propertyName]="",delete e.clean[n]),n in e.onEnd){var o=e.onEnd[n];o.call(this),delete e.onEnd[n]}this.emitEvent("transitionEnd",[this])}},d.disableTransition=function(){this.removeTransitionStyles(),this.element.removeEventListener(h,this,!1),this.isTransitioning=!1},d._removeStyles=function(t){var e={};for(var i in t)e[i]="";this.css(e)};var f={transitionProperty:"",transitionDuration:"",transitionDelay:""};return d.removeTransitionStyles=function(){this.css(f)},d.stagger=function(t){t=isNaN(t)?0:t,this.staggerDelay=t+"ms"},d.removeElem=function(){this.element.parentNode.removeChild(this.element),this.css({display:""}),this.emitEvent("remove",[this])},d.remove=function(){return s&&parseFloat(this.layout.options.transitionDuration)?(this.once("transitionEnd",function(){this.removeElem()}),void this.hide()):void this.removeElem()},d.reveal=function(){delete this.isHidden,this.css({display:""});var t=this.layout.options,e={},i=this.getHideRevealTransitionEndProperty("visibleStyle");e[i]=this.onRevealTransitionEnd,this.transition({from:t.hiddenStyle,to:t.visibleStyle,isCleaning:!0,onTransitionEnd:e})},d.onRevealTransitionEnd=function(){this.isHidden||this.emitEvent("reveal")},d.getHideRevealTransitionEndProperty=function(t){var e=this.layout.options[t];if(e.opacity)return"opacity";for(var i in e)return i},d.hide=function(){this.isHidden=!0,this.css({display:""});var t=this.layout.options,e={},i=this.getHideRevealTransitionEndProperty("hiddenStyle");e[i]=this.onHideTransitionEnd,this.transition({from:t.visibleStyle,to:t.hiddenStyle,isCleaning:!0,onTransitionEnd:e})},d.onHideTransitionEnd=function(){this.isHidden&&(this.css({display:"none"}),this.emitEvent("hide"))},d.destroy=function(){this.css({position:"",left:"",right:"",top:"",bottom:"",transition:"",transform:""})},n}),function(t,e){"use strict";"function"==typeof define&&define.amd?define("outlayer/outlayer",["ev-emitter/ev-emitter","get-size/get-size","fizzy-ui-utils/utils","./item"],function(i,n,o,r){return e(t,i,n,o,r)}):"object"==typeof module&&module.exports?module.exports=e(t,require("ev-emitter"),require("get-size"),require("fizzy-ui-utils"),require("./item")):t.Outlayer=e(t,t.EvEmitter,t.getSize,t.fizzyUIUtils,t.Outlayer.Item)}(window,function(t,e,i,n,o){"use strict";function r(t,e){var i=n.getQueryElement(t);if(!i)return void(h&&h.error("Bad element for "+this.constructor.namespace+": "+(i||t)));this.element=i,u&&(this.$element=u(this.element)),this.options=n.extend({},this.constructor.defaults),this.option(e);var o=++l;this.element.outlayerGUID=o,c[o]=this,this._create();var r=this._getOption("initLayout");r&&this.layout()}function s(t){function e(){t.apply(this,arguments)}return e.prototype=Object.create(t.prototype),e.prototype.constructor=e,e}function a(t){if("number"==typeof t)return t;var e=t.match(/(^\d*\.?\d*)(\w*)/),i=e&&e[1],n=e&&e[2];if(!i.length)return 0;i=parseFloat(i);var o=m[n]||1;return i*o}var h=t.console,u=t.jQuery,d=function(){},l=0,c={};r.namespace="outlayer",r.Item=o,r.defaults={containerStyle:{position:"relative"},initLayout:!0,originLeft:!0,originTop:!0,resize:!0,resizeContainer:!0,transitionDuration:"0.4s",hiddenStyle:{opacity:0,transform:"scale(0.001)"},visibleStyle:{opacity:1,transform:"scale(1)"}};var f=r.prototype;n.extend(f,e.prototype),f.option=function(t){n.extend(this.options,t)},f._getOption=function(t){var e=this.constructor.compatOptions[t];return e&&void 0!==this.options[e]?this.options[e]:this.options[t]},r.compatOptions={initLayout:"isInitLayout",horizontal:"isHorizontal",layoutInstant:"isLayoutInstant",originLeft:"isOriginLeft",originTop:"isOriginTop",resize:"isResizeBound",resizeContainer:"isResizingContainer"},f._create=function(){this.reloadItems(),this.stamps=[],this.stamp(this.options.stamp),n.extend(this.element.style,this.options.containerStyle);var t=this._getOption("resize");t&&this.bindResize()},f.reloadItems=function(){this.items=this._itemize(this.element.children)},f._itemize=function(t){for(var e=this._filterFindItemElements(t),i=this.constructor.Item,n=[],o=0;o<e.length;o++){var r=e[o],s=new i(r,this);n.push(s)}return n},f._filterFindItemElements=function(t){return n.filterFindElements(t,this.options.itemSelector)},f.getItemElements=function(){return this.items.map(function(t){return t.element})},f.layout=function(){this._resetLayout(),this._manageStamps();var t=this._getOption("layoutInstant"),e=void 0!==t?t:!this._isLayoutInited;this.layoutItems(this.items,e),this._isLayoutInited=!0},f._init=f.layout,f._resetLayout=function(){this.getSize()},f.getSize=function(){this.size=i(this.element)},f._getMeasurement=function(t,e){var n,o=this.options[t];o?("string"==typeof o?n=this.element.querySelector(o):o instanceof HTMLElement&&(n=o),this[t]=n?i(n)[e]:o):this[t]=0},f.layoutItems=function(t,e){t=this._getItemsForLayout(t),this._layoutItems(t,e),this._postLayout()},f._getItemsForLayout=function(t){return t.filter(function(t){return!t.isIgnored})},f._layoutItems=function(t,e){if(this._emitCompleteOnItems("layout",t),t&&t.length){var i=[];t.forEach(function(t){var n=this._getItemLayoutPosition(t);n.item=t,n.isInstant=e||t.isLayoutInstant,i.push(n)},this),this._processLayoutQueue(i)}},f._getItemLayoutPosition=function(){return{x:0,y:0}},f._processLayoutQueue=function(t){this.updateStagger(),t.forEach(function(t,e){this._positionItem(t.item,t.x,t.y,t.isInstant,e)},this)},f.updateStagger=function(){var t=this.options.stagger;return null===t||void 0===t?void(this.stagger=0):(this.stagger=a(t),this.stagger)},f._positionItem=function(t,e,i,n,o){n?t.goTo(e,i):(t.stagger(o*this.stagger),t.moveTo(e,i))},f._postLayout=function(){this.resizeContainer()},f.resizeContainer=function(){var t=this._getOption("resizeContainer");if(t){var e=this._getContainerSize();e&&(this._setContainerMeasure(e.width,!0),this._setContainerMeasure(e.height,!1))}},f._getContainerSize=d,f._setContainerMeasure=function(t,e){if(void 0!==t){var i=this.size;i.isBorderBox&&(t+=e?i.paddingLeft+i.paddingRight+i.borderLeftWidth+i.borderRightWidth:i.paddingBottom+i.paddingTop+i.borderTopWidth+i.borderBottomWidth),t=Math.max(t,0),this.element.style[e?"width":"height"]=t+"px"}},f._emitCompleteOnItems=function(t,e){function i(){o.dispatchEvent(t+"Complete",null,[e])}function n(){s++,s==r&&i()}var o=this,r=e.length;if(!e||!r)return void i();var s=0;e.forEach(function(e){e.once(t,n)})},f.dispatchEvent=function(t,e,i){var n=e?[e].concat(i):i;if(this.emitEvent(t,n),u)if(this.$element=this.$element||u(this.element),e){var o=u.Event(e);o.type=t,this.$element.trigger(o,i)}else this.$element.trigger(t,i)},f.ignore=function(t){var e=this.getItem(t);e&&(e.isIgnored=!0)},f.unignore=function(t){var e=this.getItem(t);e&&delete e.isIgnored},f.stamp=function(t){t=this._find(t),t&&(this.stamps=this.stamps.concat(t),t.forEach(this.ignore,this))},f.unstamp=function(t){t=this._find(t),t&&t.forEach(function(t){n.removeFrom(this.stamps,t),this.unignore(t)},this)},f._find=function(t){return t?("string"==typeof t&&(t=this.element.querySelectorAll(t)),t=n.makeArray(t)):void 0},f._manageStamps=function(){this.stamps&&this.stamps.length&&(this._getBoundingRect(),this.stamps.forEach(this._manageStamp,this))},f._getBoundingRect=function(){var t=this.element.getBoundingClientRect(),e=this.size;this._boundingRect={left:t.left+e.paddingLeft+e.borderLeftWidth,top:t.top+e.paddingTop+e.borderTopWidth,right:t.right-(e.paddingRight+e.borderRightWidth),bottom:t.bottom-(e.paddingBottom+e.borderBottomWidth)}},f._manageStamp=d,f._getElementOffset=function(t){var e=t.getBoundingClientRect(),n=this._boundingRect,o=i(t),r={left:e.left-n.left-o.marginLeft,top:e.top-n.top-o.marginTop,right:n.right-e.right-o.marginRight,bottom:n.bottom-e.bottom-o.marginBottom};return r},f.handleEvent=n.handleEvent,f.bindResize=function(){t.addEventListener("resize",this),this.isResizeBound=!0},f.unbindResize=function(){t.removeEventListener("resize",this),this.isResizeBound=!1},f.onresize=function(){this.resize()},n.debounceMethod(r,"onresize",100),f.resize=function(){this.isResizeBound&&this.needsResizeLayout()&&this.layout()},f.needsResizeLayout=function(){var t=i(this.element),e=this.size&&t;return e&&t.innerWidth!==this.size.innerWidth},f.addItems=function(t){var e=this._itemize(t);return e.length&&(this.items=this.items.concat(e)),e},f.appended=function(t){var e=this.addItems(t);e.length&&(this.layoutItems(e,!0),this.reveal(e))},f.prepended=function(t){var e=this._itemize(t);if(e.length){var i=this.items.slice(0);this.items=e.concat(i),this._resetLayout(),this._manageStamps(),this.layoutItems(e,!0),this.reveal(e),this.layoutItems(i)}},f.reveal=function(t){if(this._emitCompleteOnItems("reveal",t),t&&t.length){var e=this.updateStagger();t.forEach(function(t,i){t.stagger(i*e),t.reveal()})}},f.hide=function(t){if(this._emitCompleteOnItems("hide",t),t&&t.length){var e=this.updateStagger();t.forEach(function(t,i){t.stagger(i*e),t.hide()})}},f.revealItemElements=function(t){var e=this.getItems(t);this.reveal(e)},f.hideItemElements=function(t){var e=this.getItems(t);this.hide(e)},f.getItem=function(t){for(var e=0;e<this.items.length;e++){var i=this.items[e];if(i.element==t)return i}},f.getItems=function(t){t=n.makeArray(t);var e=[];return t.forEach(function(t){var i=this.getItem(t);i&&e.push(i)},this),e},f.remove=function(t){var e=this.getItems(t);this._emitCompleteOnItems("remove",e),e&&e.length&&e.forEach(function(t){t.remove(),n.removeFrom(this.items,t)},this)},f.destroy=function(){var t=this.element.style;t.height="",t.position="",t.width="",this.items.forEach(function(t){t.destroy()}),this.unbindResize();var e=this.element.outlayerGUID;delete c[e],delete this.element.outlayerGUID,u&&u.removeData(this.element,this.constructor.namespace)},r.data=function(t){t=n.getQueryElement(t);var e=t&&t.outlayerGUID;return e&&c[e]},r.create=function(t,e){var i=s(r);return i.defaults=n.extend({},r.defaults),n.extend(i.defaults,e),i.compatOptions=n.extend({},r.compatOptions),i.namespace=t,i.data=r.data,i.Item=s(o),n.htmlInit(i,t),u&&u.bridget&&u.bridget(t,i),i};var m={ms:1,s:1e3};return r.Item=o,r}),function(t,e){"function"==typeof define&&define.amd?define(["outlayer/outlayer","get-size/get-size"],e):"object"==typeof module&&module.exports?module.exports=e(require("outlayer"),require("get-size")):t.Masonry=e(t.Outlayer,t.getSize)}(window,function(t,e){var i=t.create("masonry");return i.compatOptions.fitWidth="isFitWidth",i.prototype._resetLayout=function(){this.getSize(),this._getMeasurement("columnWidth","outerWidth"),this._getMeasurement("gutter","outerWidth"),this.measureColumns(),this.colYs=[];for(var t=0;t<this.cols;t++)this.colYs.push(0);this.maxY=0},i.prototype.measureColumns=function(){if(this.getContainerWidth(),!this.columnWidth){var t=this.items[0],i=t&&t.element;this.columnWidth=i&&e(i).outerWidth||this.containerWidth}var n=this.columnWidth+=this.gutter,o=this.containerWidth+this.gutter,r=o/n,s=n-o%n,a=s&&1>s?"round":"floor";r=Math[a](r),this.cols=Math.max(r,1)},i.prototype.getContainerWidth=function(){var t=this._getOption("fitWidth"),i=t?this.element.parentNode:this.element,n=e(i);this.containerWidth=n&&n.innerWidth},i.prototype._getItemLayoutPosition=function(t){t.getSize();var e=t.size.outerWidth%this.columnWidth,i=e&&1>e?"round":"ceil",n=Math[i](t.size.outerWidth/this.columnWidth);n=Math.min(n,this.cols);for(var o=this._getColGroup(n),r=Math.min.apply(Math,o),s=o.indexOf(r),a={x:this.columnWidth*s,y:r},h=r+t.size.outerHeight,u=this.cols+1-o.length,d=0;u>d;d++)this.colYs[s+d]=h;return a},i.prototype._getColGroup=function(t){if(2>t)return this.colYs;for(var e=[],i=this.cols+1-t,n=0;i>n;n++){var o=this.colYs.slice(n,n+t);e[n]=Math.max.apply(Math,o)}return e},i.prototype._manageStamp=function(t){var i=e(t),n=this._getElementOffset(t),o=this._getOption("originLeft"),r=o?n.left:n.right,s=r+i.outerWidth,a=Math.floor(r/this.columnWidth);a=Math.max(0,a);var h=Math.floor(s/this.columnWidth);h-=s%this.columnWidth?0:1,h=Math.min(this.cols-1,h);for(var u=this._getOption("originTop"),d=(u?n.top:n.bottom)+i.outerHeight,l=a;h>=l;l++)this.colYs[l]=Math.max(d,this.colYs[l])},i.prototype._getContainerSize=function(){this.maxY=Math.max.apply(Math,this.colYs);var t={height:this.maxY};return this._getOption("fitWidth")&&(t.width=this._getContainerFitWidth()),t},i.prototype._getContainerFitWidth=function(){for(var t=0,e=this.cols;--e&&0===this.colYs[e];)t++;return(this.cols-t)*this.columnWidth-this.gutter},i.prototype.needsResizeLayout=function(){var t=this.containerWidth;return this.getContainerWidth(),t!=this.containerWidth},i});
/*!
  hey, [be]Lazy.js - v1.5.4 - 2016.03.06
  A fast, small and dependency free lazy load script (https://github.com/dinbror/blazy)
  (c) Bjoern Klinggaard - @bklinggaard - http://dinbror.dk/blazy
*/
;
(function(root, blazy) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register bLazy as an anonymous module
        define(blazy);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = blazy();
    } else {
        // Browser globals. Register bLazy on window
        root.Blazy = blazy();
    }
})(this, function() {
    'use strict';

    //private vars
    var source, viewport, isRetina;

    // constructor
    return function Blazy(options) {
        //IE7- fallback for missing querySelectorAll support
        if (!document.querySelectorAll) {
            var s = document.createStyleSheet();
            document.querySelectorAll = function(r, c, i, j, a) {
                a = document.all, c = [], r = r.replace(/\[for\b/gi, '[htmlFor').split(',');
                for (i = r.length; i--;) {
                    s.addRule(r[i], 'k:v');
                    for (j = a.length; j--;) a[j].currentStyle.k && c.push(a[j]);
                    s.removeRule(0);
                }
                return c;
            };
        }

        //options and helper vars
        var scope = this;
        var util = scope._util = {};
        util.elements = [];
        util.destroyed = true;
        scope.options = options || {};
        scope.options.error = scope.options.error || false;
        scope.options.offset = scope.options.offset || 100;
        scope.options.success = scope.options.success || false;
        scope.options.selector = scope.options.selector || '.b-lazy';
        scope.options.separator = scope.options.separator || '|';
        scope.options.container = scope.options.container ? document.querySelectorAll(scope.options.container) : false;
        scope.options.errorClass = scope.options.errorClass || 'b-error';
        scope.options.breakpoints = scope.options.breakpoints || false;
        scope.options.loadInvisible = scope.options.loadInvisible || false;
        scope.options.successClass = scope.options.successClass || 'b-loaded';
        scope.options.validateDelay = scope.options.validateDelay || 25;
        scope.options.saveViewportOffsetDelay = scope.options.saveViewportOffsetDelay || 50;
        scope.options.src = source = scope.options.src || 'data-src';
        isRetina = window.devicePixelRatio > 1;
        viewport = {};
        viewport.top = 0 - scope.options.offset;
        viewport.left = 0 - scope.options.offset;


        /* public functions
         ************************************/
        scope.revalidate = function() {
            initialize(this);
        };
        scope.load = function(elements, force) {
            var opt = this.options;
            if (elements.length === undefined) {
                loadElement(elements, force, opt);
            } else {
                each(elements, function(element) {
                    loadElement(element, force, opt);
                });
            }
        };
        scope.destroy = function() {
            var self = this;
            var util = self._util;
            if (self.options.container) {
                each(self.options.container, function(object) {
                    unbindEvent(object, 'scroll', util.validateT);
                });
            }
            unbindEvent(window, 'scroll', util.validateT);
            unbindEvent(window, 'resize', util.validateT);
            unbindEvent(window, 'resize', util.saveViewportOffsetT);
            util.count = 0;
            util.elements.length = 0;
            util.destroyed = true;
        };

        //throttle, ensures that we don't call the functions too often
        util.validateT = throttle(function() {
            validate(scope);
        }, scope.options.validateDelay, scope);
        util.saveViewportOffsetT = throttle(function() {
            saveViewportOffset(scope.options.offset);
        }, scope.options.saveViewportOffsetDelay, scope);
        saveViewportOffset(scope.options.offset);

        //handle multi-served image src
        each(scope.options.breakpoints, function(object) {
            if (object.width >= window.screen.width) {
                source = object.src;
                return false;
            }
        });

        // start lazy load
        initialize(scope);
    };


    /* Private helper functions
     ************************************/
    function initialize(self) {
        setTimeout(function() {
            var util = self._util;
            // First we create an array of elements to lazy load
            util.elements = toArray(self.options.selector);
            util.count = util.elements.length;
            // Then we bind resize and scroll events if not already binded
            if (util.destroyed) {
                util.destroyed = false;
                if (self.options.container) {
                    each(self.options.container, function(object) {
                        bindEvent(object, 'scroll', util.validateT);
                    });
                }
                bindEvent(window, 'resize', util.saveViewportOffsetT);
                bindEvent(window, 'resize', util.validateT);
                bindEvent(window, 'scroll', util.validateT);
            }
            // And finally, we start to lazy load.
            validate(self);
        }, 1); // "dom ready" fix
    }

    function validate(self) {
        var util = self._util;
        for (var i = 0; i < util.count; i++) {
            var element = util.elements[i];
            if (elementInView(element) || hasClass(element, self.options.successClass)) {
                self.load(element);
                util.elements.splice(i, 1);
                util.count--;
                i--;
            }
        }
        if (util.count === 0) {
            self.destroy();
        }
    }

    function elementInView(ele) {
        var rect = ele.getBoundingClientRect();
        return (
            // Intersection
            rect.right >= viewport.left && rect.bottom >= viewport.top && rect.left <= viewport.right && rect.top <= viewport.bottom
        );
    }

    function loadElement(ele, force, options) {
        // if element is visible, not loaded or forced
        if (!hasClass(ele, options.successClass) && (force || options.loadInvisible || (ele.offsetWidth > 0 && ele.offsetHeight > 0))) {
            var dataSrc = ele.getAttribute(source) || ele.getAttribute(options.src); // fallback to default 'data-src'
            if (dataSrc) {
                var dataSrcSplitted = dataSrc.split(options.separator);
                var src = dataSrcSplitted[isRetina && dataSrcSplitted.length > 1 ? 1 : 0];
                var isImage = ele.nodeName.toLowerCase() === 'img';
                // Image or background image
                if (isImage || ele.src === undefined) {
                    var img = new Image();
                    img.onerror = function() {
                        if (options.error) options.error(ele, "invalid");
                        addClass(ele, options.errorClass);
                    };
                    img.onload = function() {
                        // Is element an image or should we add the src as a background image?
                        isImage ? ele.src = src : ele.style.backgroundImage = 'url("' + src + '")';
                        itemLoaded(ele, options);
                    };
                    img.src = src; //preload
                    // An item with src like iframe, unity, video etc
                } else {
                    ele.src = src;
                    itemLoaded(ele, options);
                }
            } else {
                if (options.error) options.error(ele, "missing");
                if (!hasClass(ele, options.errorClass)) addClass(ele, options.errorClass);
            }
        }
    }

    function itemLoaded(ele, options) {
        addClass(ele, options.successClass);
        if (options.success) options.success(ele);
        // cleanup markup, remove data source attributes
        each(options.breakpoints, function(object) {
            ele.removeAttribute(object.src);
        });
        ele.removeAttribute(options.src);
    }

    function hasClass(ele, className) {
        return (' ' + ele.className + ' ').indexOf(' ' + className + ' ') !== -1;
    }

    function addClass(ele, className) {
        ele.className = ele.className + ' ' + className;
    }

    function toArray(selector) {
        var array = [];
        var nodelist = document.querySelectorAll(selector);
        for (var i = nodelist.length; i--; array.unshift(nodelist[i])) {}
        return array;
    }

    function saveViewportOffset(offset) {
        viewport.bottom = (window.innerHeight || document.documentElement.clientHeight) + offset;
        viewport.right = (window.innerWidth || document.documentElement.clientWidth) + offset;
    }

    function bindEvent(ele, type, fn) {
        if (ele.attachEvent) {
            ele.attachEvent && ele.attachEvent('on' + type, fn);
        } else {
            ele.addEventListener(type, fn, false);
        }
    }

    function unbindEvent(ele, type, fn) {
        if (ele.detachEvent) {
            ele.detachEvent && ele.detachEvent('on' + type, fn);
        } else {
            ele.removeEventListener(type, fn, false);
        }
    }

    function each(object, fn) {
        if (object && fn) {
            var l = object.length;
            for (var i = 0; i < l && fn(object[i], i) !== false; i++) {}
        }
    }

    function throttle(fn, minDelay, scope) {
        var lastCall = 0;
        return function() {
            var now = +new Date();
            if (now - lastCall < minDelay) {
                return;
            }
            lastCall = now;
            fn.apply(scope, arguments);
        };
    }
});
/**
 * History.js jQuery Adapter
 * @author Benjamin Arthur Lupton <contact@balupton.com>
 * @copyright 2010-2011 Benjamin Arthur Lupton <contact@balupton.com>
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

// Closure
(function(window,undefined){
	"use strict";

	// Localise Globals
	var
		History = window.History = window.History||{},
		jQuery = window.jQuery;

	// Check Existence
	if ( typeof History.Adapter !== 'undefined' ) {
		throw new Error('History.js Adapter has already been loaded...');
	}

	// Add the Adapter
	History.Adapter = {
		/**
		 * History.Adapter.bind(el,event,callback)
		 * @param {Element|string} el
		 * @param {string} event - custom and standard events
		 * @param {function} callback
		 * @return {void}
		 */
		bind: function(el,event,callback){
			jQuery(el).bind(event,callback);
		},

		/**
		 * History.Adapter.trigger(el,event)
		 * @param {Element|string} el
		 * @param {string} event - custom and standard events
		 * @param {Object=} extra - a object of extra event data (optional)
		 * @return {void}
		 */
		trigger: function(el,event,extra){
			jQuery(el).trigger(event,extra);
		},

		/**
		 * History.Adapter.extractEventData(key,event,extra)
		 * @param {string} key - key for the event data to extract
		 * @param {string} event - custom and standard events
		 * @param {Object=} extra - a object of extra event data (optional)
		 * @return {mixed}
		 */
		extractEventData: function(key,event,extra){
			// jQuery Native then jQuery Custom
			var result = (event && event.originalEvent && event.originalEvent[key]) || (extra && extra[key]) || undefined;

			// Return
			return result;
		},

		/**
		 * History.Adapter.onDomLoad(callback)
		 * @param {function} callback
		 * @return {void}
		 */
		onDomLoad: function(callback) {
			jQuery(callback);
		}
	};

	// Try and Initialise History
	if ( typeof History.init !== 'undefined' ) {
		History.init();
	}

})(window);

/**
 * History.js Core
 * @author Benjamin Arthur Lupton <contact@balupton.com>
 * @copyright 2010-2011 Benjamin Arthur Lupton <contact@balupton.com>
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

(function(window,undefined){
	"use strict";

	// ========================================================================
	// Initialise

	// Localise Globals
	var
		console = window.console||undefined, // Prevent a JSLint complain
		document = window.document, // Make sure we are using the correct document
		navigator = window.navigator, // Make sure we are using the correct navigator
		sessionStorage = false, // sessionStorage
		setTimeout = window.setTimeout,
		clearTimeout = window.clearTimeout,
		setInterval = window.setInterval,
		clearInterval = window.clearInterval,
		JSON = window.JSON,
		alert = window.alert,
		History = window.History = window.History||{}, // Public History Object
		history = window.history; // Old History Object

	try {
		sessionStorage = window.sessionStorage; // This will throw an exception in some browsers when cookies/localStorage are explicitly disabled (i.e. Chrome)
		sessionStorage.setItem('TEST', '1');
		sessionStorage.removeItem('TEST');
	} catch(e) {
		sessionStorage = false;
	}

	// MooTools Compatibility
	JSON.stringify = JSON.stringify||JSON.encode;
	JSON.parse = JSON.parse||JSON.decode;

	// Check Existence
	if ( typeof History.init !== 'undefined' ) {
		throw new Error('History.js Core has already been loaded...');
	}

	// Initialise History
	History.init = function(options){
		// Check Load Status of Adapter
		if ( typeof History.Adapter === 'undefined' ) {
			return false;
		}

		// Check Load Status of Core
		if ( typeof History.initCore !== 'undefined' ) {
			History.initCore();
		}

		// Check Load Status of HTML4 Support
		if ( typeof History.initHtml4 !== 'undefined' ) {
			History.initHtml4();
		}

		// Return true
		return true;
	};


	// ========================================================================
	// Initialise Core

	// Initialise Core
	History.initCore = function(options){
		// Initialise
		if ( typeof History.initCore.initialized !== 'undefined' ) {
			// Already Loaded
			return false;
		}
		else {
			History.initCore.initialized = true;
		}


		// ====================================================================
		// Options

		/**
		 * History.options
		 * Configurable options
		 */
		History.options = History.options||{};

		/**
		 * History.options.hashChangeInterval
		 * How long should the interval be before hashchange checks
		 */
		History.options.hashChangeInterval = History.options.hashChangeInterval || 100;

		/**
		 * History.options.safariPollInterval
		 * How long should the interval be before safari poll checks
		 */
		History.options.safariPollInterval = History.options.safariPollInterval || 500;

		/**
		 * History.options.doubleCheckInterval
		 * How long should the interval be before we perform a double check
		 */
		History.options.doubleCheckInterval = History.options.doubleCheckInterval || 500;

		/**
		 * History.options.disableSuid
		 * Force History not to append suid
		 */
		History.options.disableSuid = History.options.disableSuid || false;

		/**
		 * History.options.storeInterval
		 * How long should we wait between store calls
		 */
		History.options.storeInterval = History.options.storeInterval || 1000;

		/**
		 * History.options.busyDelay
		 * How long should we wait between busy events
		 */
		History.options.busyDelay = History.options.busyDelay || 250;

		/**
		 * History.options.debug
		 * If true will enable debug messages to be logged
		 */
		History.options.debug = History.options.debug || false;

		/**
		 * History.options.initialTitle
		 * What is the title of the initial state
		 */
		History.options.initialTitle = History.options.initialTitle || document.title;

		/**
		 * History.options.html4Mode
		 * If true, will force HTMl4 mode (hashtags)
		 */
		History.options.html4Mode = History.options.html4Mode || false;

		/**
		 * History.options.delayInit
		 * Want to override default options and call init manually.
		 */
		History.options.delayInit = History.options.delayInit || false;


		// ====================================================================
		// Interval record

		/**
		 * History.intervalList
		 * List of intervals set, to be cleared when document is unloaded.
		 */
		History.intervalList = [];

		/**
		 * History.clearAllIntervals
		 * Clears all setInterval instances.
		 */
		History.clearAllIntervals = function(){
			var i, il = History.intervalList;
			if (typeof il !== "undefined" && il !== null) {
				for (i = 0; i < il.length; i++) {
					clearInterval(il[i]);
				}
				History.intervalList = null;
			}
		};


		// ====================================================================
		// Debug

		/**
		 * History.debug(message,...)
		 * Logs the passed arguments if debug enabled
		 */
		History.debug = function(){
			if ( (History.options.debug||false) ) {
				History.log.apply(History,arguments);
			}
		};

		/**
		 * History.log(message,...)
		 * Logs the passed arguments
		 */
		History.log = function(){
			// Prepare
			var
				consoleExists = !(typeof console === 'undefined' || typeof console.log === 'undefined' || typeof console.log.apply === 'undefined'),
				textarea = document.getElementById('log'),
				message,
				i,n,
				args,arg
				;

			// Write to Console
			if ( consoleExists ) {
				args = Array.prototype.slice.call(arguments);
				message = args.shift();
				if ( typeof console.debug !== 'undefined' ) {
					console.debug.apply(console,[message,args]);
				}
				else {
					console.log.apply(console,[message,args]);
				}
			}
			else {
				message = ("\n"+arguments[0]+"\n");
			}

			// Write to log
			for ( i=1,n=arguments.length; i<n; ++i ) {
				arg = arguments[i];
				if ( typeof arg === 'object' && typeof JSON !== 'undefined' ) {
					try {
						arg = JSON.stringify(arg);
					}
					catch ( Exception ) {
						// Recursive Object
					}
				}
				message += "\n"+arg+"\n";
			}

			// Textarea
			if ( textarea ) {
				textarea.value += message+"\n-----\n";
				textarea.scrollTop = textarea.scrollHeight - textarea.clientHeight;
			}
			// No Textarea, No Console
			else if ( !consoleExists ) {
				alert(message);
			}

			// Return true
			return true;
		};


		// ====================================================================
		// Emulated Status

		/**
		 * History.getInternetExplorerMajorVersion()
		 * Get's the major version of Internet Explorer
		 * @return {integer}
		 * @license Public Domain
		 * @author Benjamin Arthur Lupton <contact@balupton.com>
		 * @author James Padolsey <https://gist.github.com/527683>
		 */
		History.getInternetExplorerMajorVersion = function(){
			var result = History.getInternetExplorerMajorVersion.cached =
					(typeof History.getInternetExplorerMajorVersion.cached !== 'undefined')
				?	History.getInternetExplorerMajorVersion.cached
				:	(function(){
						var v = 3,
								div = document.createElement('div'),
								all = div.getElementsByTagName('i');
						while ( (div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->') && all[0] ) {}
						return (v > 4) ? v : false;
					})()
				;
			return result;
		};

		/**
		 * History.isInternetExplorer()
		 * Are we using Internet Explorer?
		 * @return {boolean}
		 * @license Public Domain
		 * @author Benjamin Arthur Lupton <contact@balupton.com>
		 */
		History.isInternetExplorer = function(){
			var result =
				History.isInternetExplorer.cached =
				(typeof History.isInternetExplorer.cached !== 'undefined')
					?	History.isInternetExplorer.cached
					:	Boolean(History.getInternetExplorerMajorVersion())
				;
			return result;
		};

		/**
		 * History.emulated
		 * Which features require emulating?
		 */

		if (History.options.html4Mode) {
			History.emulated = {
				pushState : true,
				hashChange: true
			};
		}

		else {

			History.emulated = {
				pushState: !Boolean(
					window.history && window.history.pushState && window.history.replaceState
					&& !(
						(/ Mobile\/([1-7][a-z]|(8([abcde]|f(1[0-8]))))/i).test(navigator.userAgent) /* disable for versions of iOS before version 4.3 (8F190) */
						|| (/AppleWebKit\/5([0-2]|3[0-2])/i).test(navigator.userAgent) /* disable for the mercury iOS browser, or at least older versions of the webkit engine */
					)
				),
				hashChange: Boolean(
					!(('onhashchange' in window) || ('onhashchange' in document))
					||
					(History.isInternetExplorer() && History.getInternetExplorerMajorVersion() < 8)
				)
			};
		}

		/**
		 * History.enabled
		 * Is History enabled?
		 */
		History.enabled = !History.emulated.pushState;

		/**
		 * History.bugs
		 * Which bugs are present
		 */
		History.bugs = {
			/**
			 * Safari 5 and Safari iOS 4 fail to return to the correct state once a hash is replaced by a `replaceState` call
			 * https://bugs.webkit.org/show_bug.cgi?id=56249
			 */
			setHash: Boolean(!History.emulated.pushState && navigator.vendor === 'Apple Computer, Inc.' && /AppleWebKit\/5([0-2]|3[0-3])/.test(navigator.userAgent)),

			/**
			 * Safari 5 and Safari iOS 4 sometimes fail to apply the state change under busy conditions
			 * https://bugs.webkit.org/show_bug.cgi?id=42940
			 */
			safariPoll: Boolean(!History.emulated.pushState && navigator.vendor === 'Apple Computer, Inc.' && /AppleWebKit\/5([0-2]|3[0-3])/.test(navigator.userAgent)),

			/**
			 * MSIE 6 and 7 sometimes do not apply a hash even it was told to (requiring a second call to the apply function)
			 */
			ieDoubleCheck: Boolean(History.isInternetExplorer() && History.getInternetExplorerMajorVersion() < 8),

			/**
			 * MSIE 6 requires the entire hash to be encoded for the hashes to trigger the onHashChange event
			 */
			hashEscape: Boolean(History.isInternetExplorer() && History.getInternetExplorerMajorVersion() < 7)
		};

		/**
		 * History.isEmptyObject(obj)
		 * Checks to see if the Object is Empty
		 * @param {Object} obj
		 * @return {boolean}
		 */
		History.isEmptyObject = function(obj) {
			for ( var name in obj ) {
				if ( obj.hasOwnProperty(name) ) {
					return false;
				}
			}
			return true;
		};

		/**
		 * History.cloneObject(obj)
		 * Clones a object and eliminate all references to the original contexts
		 * @param {Object} obj
		 * @return {Object}
		 */
		History.cloneObject = function(obj) {
			var hash,newObj;
			if ( obj ) {
				hash = JSON.stringify(obj);
				newObj = JSON.parse(hash);
			}
			else {
				newObj = {};
			}
			return newObj;
		};


		// ====================================================================
		// URL Helpers

		/**
		 * History.getRootUrl()
		 * Turns "http://mysite.com/dir/page.html?asd" into "http://mysite.com"
		 * @return {String} rootUrl
		 */
		History.getRootUrl = function(){
			// Create
			var rootUrl = document.location.protocol+'//'+(document.location.hostname||document.location.host);
			if ( document.location.port||false ) {
				rootUrl += ':'+document.location.port;
			}
			rootUrl += '/';

			// Return
			return rootUrl;
		};

		/**
		 * History.getBaseHref()
		 * Fetches the `href` attribute of the `<base href="...">` element if it exists
		 * @return {String} baseHref
		 */
		History.getBaseHref = function(){
			// Create
			var
				baseElements = document.getElementsByTagName('base'),
				baseElement = null,
				baseHref = '';

			// Test for Base Element
			if ( baseElements.length === 1 ) {
				// Prepare for Base Element
				baseElement = baseElements[0];
				baseHref = baseElement.href.replace(/[^\/]+$/,'');
			}

			// Adjust trailing slash
			baseHref = baseHref.replace(/\/+$/,'');
			if ( baseHref ) baseHref += '/';

			// Return
			return baseHref;
		};

		/**
		 * History.getBaseUrl()
		 * Fetches the baseHref or basePageUrl or rootUrl (whichever one exists first)
		 * @return {String} baseUrl
		 */
		History.getBaseUrl = function(){
			// Create
			var baseUrl = History.getBaseHref()||History.getBasePageUrl()||History.getRootUrl();

			// Return
			return baseUrl;
		};

		/**
		 * History.getPageUrl()
		 * Fetches the URL of the current page
		 * @return {String} pageUrl
		 */
		History.getPageUrl = function(){
			// Fetch
			var
				State = History.getState(false,false),
				stateUrl = (State||{}).url||History.getLocationHref(),
				pageUrl;

			// Create
			pageUrl = stateUrl.replace(/\/+$/,'').replace(/[^\/]+$/,function(part,index,string){
				return (/\./).test(part) ? part : part+'/';
			});

			// Return
			return pageUrl;
		};

		/**
		 * History.getBasePageUrl()
		 * Fetches the Url of the directory of the current page
		 * @return {String} basePageUrl
		 */
		History.getBasePageUrl = function(){
			// Create
			var basePageUrl = (History.getLocationHref()).replace(/[#\?].*/,'').replace(/[^\/]+$/,function(part,index,string){
				return (/[^\/]$/).test(part) ? '' : part;
			}).replace(/\/+$/,'')+'/';

			// Return
			return basePageUrl;
		};

		/**
		 * History.getFullUrl(url)
		 * Ensures that we have an absolute URL and not a relative URL
		 * @param {string} url
		 * @param {Boolean} allowBaseHref
		 * @return {string} fullUrl
		 */
		History.getFullUrl = function(url,allowBaseHref){
			// Prepare
			var fullUrl = url, firstChar = url.substring(0,1);
			allowBaseHref = (typeof allowBaseHref === 'undefined') ? true : allowBaseHref;

			// Check
			if ( /[a-z]+\:\/\//.test(url) ) {
				// Full URL
			}
			else if ( firstChar === '/' ) {
				// Root URL
				fullUrl = History.getRootUrl()+url.replace(/^\/+/,'');
			}
			else if ( firstChar === '#' ) {
				// Anchor URL
				fullUrl = History.getPageUrl().replace(/#.*/,'')+url;
			}
			else if ( firstChar === '?' ) {
				// Query URL
				fullUrl = History.getPageUrl().replace(/[\?#].*/,'')+url;
			}
			else {
				// Relative URL
				if ( allowBaseHref ) {
					fullUrl = History.getBaseUrl()+url.replace(/^(\.\/)+/,'');
				} else {
					fullUrl = History.getBasePageUrl()+url.replace(/^(\.\/)+/,'');
				}
				// We have an if condition above as we do not want hashes
				// which are relative to the baseHref in our URLs
				// as if the baseHref changes, then all our bookmarks
				// would now point to different locations
				// whereas the basePageUrl will always stay the same
			}

			// Return
			return fullUrl.replace(/\#$/,'');
		};

		/**
		 * History.getShortUrl(url)
		 * Ensures that we have a relative URL and not a absolute URL
		 * @param {string} url
		 * @return {string} url
		 */
		History.getShortUrl = function(url){
			// Prepare
			var shortUrl = url, baseUrl = History.getBaseUrl(), rootUrl = History.getRootUrl();

			// Trim baseUrl
			if ( History.emulated.pushState ) {
				// We are in a if statement as when pushState is not emulated
				// The actual url these short urls are relative to can change
				// So within the same session, we the url may end up somewhere different
				shortUrl = shortUrl.replace(baseUrl,'');
			}

			// Trim rootUrl
			shortUrl = shortUrl.replace(rootUrl,'/');

			// Ensure we can still detect it as a state
			if ( History.isTraditionalAnchor(shortUrl) ) {
				shortUrl = './'+shortUrl;
			}

			// Clean It
			shortUrl = shortUrl.replace(/^(\.\/)+/g,'./').replace(/\#$/,'');

			// Return
			return shortUrl;
		};

		/**
		 * History.getLocationHref(document)
		 * Returns a normalized version of document.location.href
		 * accounting for browser inconsistencies, etc.
		 *
		 * This URL will be URI-encoded and will include the hash
		 *
		 * @param {object} document
		 * @return {string} url
		 */
		History.getLocationHref = function(doc) {
			doc = doc || document;

			// most of the time, this will be true
			if (doc.URL === doc.location.href)
				return doc.location.href;

			// some versions of webkit URI-decode document.location.href
			// but they leave document.URL in an encoded state
			if (doc.location.href === decodeURIComponent(doc.URL))
				return doc.URL;

			// FF 3.6 only updates document.URL when a page is reloaded
			// document.location.href is updated correctly
			if (doc.location.hash && decodeURIComponent(doc.location.href.replace(/^[^#]+/, "")) === doc.location.hash)
				return doc.location.href;

			if (doc.URL.indexOf('#') == -1 && doc.location.href.indexOf('#') != -1)
				return doc.location.href;
			
			return doc.URL || doc.location.href;
		};


		// ====================================================================
		// State Storage

		/**
		 * History.store
		 * The store for all session specific data
		 */
		History.store = {};

		/**
		 * History.idToState
		 * 1-1: State ID to State Object
		 */
		History.idToState = History.idToState||{};

		/**
		 * History.stateToId
		 * 1-1: State String to State ID
		 */
		History.stateToId = History.stateToId||{};

		/**
		 * History.urlToId
		 * 1-1: State URL to State ID
		 */
		History.urlToId = History.urlToId||{};

		/**
		 * History.storedStates
		 * Store the states in an array
		 */
		History.storedStates = History.storedStates||[];

		/**
		 * History.savedStates
		 * Saved the states in an array
		 */
		History.savedStates = History.savedStates||[];

		/**
		 * History.noramlizeStore()
		 * Noramlize the store by adding necessary values
		 */
		History.normalizeStore = function(){
			History.store.idToState = History.store.idToState||{};
			History.store.urlToId = History.store.urlToId||{};
			History.store.stateToId = History.store.stateToId||{};
		};

		/**
		 * History.getState()
		 * Get an object containing the data, title and url of the current state
		 * @param {Boolean} friendly
		 * @param {Boolean} create
		 * @return {Object} State
		 */
		History.getState = function(friendly,create){
			// Prepare
			if ( typeof friendly === 'undefined' ) { friendly = true; }
			if ( typeof create === 'undefined' ) { create = true; }

			// Fetch
			var State = History.getLastSavedState();

			// Create
			if ( !State && create ) {
				State = History.createStateObject();
			}

			// Adjust
			if ( friendly ) {
				State = History.cloneObject(State);
				State.url = State.cleanUrl||State.url;
			}

			// Return
			return State;
		};

		/**
		 * History.getIdByState(State)
		 * Gets a ID for a State
		 * @param {State} newState
		 * @return {String} id
		 */
		History.getIdByState = function(newState){

			// Fetch ID
			var id = History.extractId(newState.url),
				str;

			if ( !id ) {
				// Find ID via State String
				str = History.getStateString(newState);
				if ( typeof History.stateToId[str] !== 'undefined' ) {
					id = History.stateToId[str];
				}
				else if ( typeof History.store.stateToId[str] !== 'undefined' ) {
					id = History.store.stateToId[str];
				}
				else {
					// Generate a new ID
					while ( true ) {
						id = (new Date()).getTime() + String(Math.random()).replace(/\D/g,'');
						if ( typeof History.idToState[id] === 'undefined' && typeof History.store.idToState[id] === 'undefined' ) {
							break;
						}
					}

					// Apply the new State to the ID
					History.stateToId[str] = id;
					History.idToState[id] = newState;
				}
			}

			// Return ID
			return id;
		};

		/**
		 * History.normalizeState(State)
		 * Expands a State Object
		 * @param {object} State
		 * @return {object}
		 */
		History.normalizeState = function(oldState){
			// Variables
			var newState, dataNotEmpty;

			// Prepare
			if ( !oldState || (typeof oldState !== 'object') ) {
				oldState = {};
			}

			// Check
			if ( typeof oldState.normalized !== 'undefined' ) {
				return oldState;
			}

			// Adjust
			if ( !oldState.data || (typeof oldState.data !== 'object') ) {
				oldState.data = {};
			}

			// ----------------------------------------------------------------

			// Create
			newState = {};
			newState.normalized = true;
			newState.title = oldState.title||'';
			newState.url = History.getFullUrl(oldState.url?oldState.url:(History.getLocationHref()));
			newState.hash = History.getShortUrl(newState.url);
			newState.data = History.cloneObject(oldState.data);

			// Fetch ID
			newState.id = History.getIdByState(newState);

			// ----------------------------------------------------------------

			// Clean the URL
			newState.cleanUrl = newState.url.replace(/\??\&_suid.*/,'');
			newState.url = newState.cleanUrl;

			// Check to see if we have more than just a url
			dataNotEmpty = !History.isEmptyObject(newState.data);

			// Apply
			if ( (newState.title || dataNotEmpty) && History.options.disableSuid !== true ) {
				// Add ID to Hash
				newState.hash = History.getShortUrl(newState.url).replace(/\??\&_suid.*/,'');
				if ( !/\?/.test(newState.hash) ) {
					newState.hash += '?';
				}
				newState.hash += '&_suid='+newState.id;
			}

			// Create the Hashed URL
			newState.hashedUrl = History.getFullUrl(newState.hash);

			// ----------------------------------------------------------------

			// Update the URL if we have a duplicate
			if ( (History.emulated.pushState || History.bugs.safariPoll) && History.hasUrlDuplicate(newState) ) {
				newState.url = newState.hashedUrl;
			}

			// ----------------------------------------------------------------

			// Return
			return newState;
		};

		/**
		 * History.createStateObject(data,title,url)
		 * Creates a object based on the data, title and url state params
		 * @param {object} data
		 * @param {string} title
		 * @param {string} url
		 * @return {object}
		 */
		History.createStateObject = function(data,title,url){
			// Hashify
			var State = {
				'data': data,
				'title': title,
				'url': url
			};

			// Expand the State
			State = History.normalizeState(State);

			// Return object
			return State;
		};

		/**
		 * History.getStateById(id)
		 * Get a state by it's UID
		 * @param {String} id
		 */
		History.getStateById = function(id){
			// Prepare
			id = String(id);

			// Retrieve
			var State = History.idToState[id] || History.store.idToState[id] || undefined;

			// Return State
			return State;
		};

		/**
		 * Get a State's String
		 * @param {State} passedState
		 */
		History.getStateString = function(passedState){
			// Prepare
			var State, cleanedState, str;

			// Fetch
			State = History.normalizeState(passedState);

			// Clean
			cleanedState = {
				data: State.data,
				title: passedState.title,
				url: passedState.url
			};

			// Fetch
			str = JSON.stringify(cleanedState);

			// Return
			return str;
		};

		/**
		 * Get a State's ID
		 * @param {State} passedState
		 * @return {String} id
		 */
		History.getStateId = function(passedState){
			// Prepare
			var State, id;

			// Fetch
			State = History.normalizeState(passedState);

			// Fetch
			id = State.id;

			// Return
			return id;
		};

		/**
		 * History.getHashByState(State)
		 * Creates a Hash for the State Object
		 * @param {State} passedState
		 * @return {String} hash
		 */
		History.getHashByState = function(passedState){
			// Prepare
			var State, hash;

			// Fetch
			State = History.normalizeState(passedState);

			// Hash
			hash = State.hash;

			// Return
			return hash;
		};

		/**
		 * History.extractId(url_or_hash)
		 * Get a State ID by it's URL or Hash
		 * @param {string} url_or_hash
		 * @return {string} id
		 */
		History.extractId = function ( url_or_hash ) {
			// Prepare
			var id,parts,url, tmp;

			// Extract
			
			// If the URL has a #, use the id from before the #
			if (url_or_hash.indexOf('#') != -1)
			{
				tmp = url_or_hash.split("#")[0];
			}
			else
			{
				tmp = url_or_hash;
			}
			
			parts = /(.*)\&_suid=([0-9]+)$/.exec(tmp);
			url = parts ? (parts[1]||url_or_hash) : url_or_hash;
			id = parts ? String(parts[2]||'') : '';

			// Return
			return id||false;
		};

		/**
		 * History.isTraditionalAnchor
		 * Checks to see if the url is a traditional anchor or not
		 * @param {String} url_or_hash
		 * @return {Boolean}
		 */
		History.isTraditionalAnchor = function(url_or_hash){
			// Check
			var isTraditional = !(/[\/\?\.]/.test(url_or_hash));

			// Return
			return isTraditional;
		};

		/**
		 * History.extractState
		 * Get a State by it's URL or Hash
		 * @param {String} url_or_hash
		 * @return {State|null}
		 */
		History.extractState = function(url_or_hash,create){
			// Prepare
			var State = null, id, url;
			create = create||false;

			// Fetch SUID
			id = History.extractId(url_or_hash);
			if ( id ) {
				State = History.getStateById(id);
			}

			// Fetch SUID returned no State
			if ( !State ) {
				// Fetch URL
				url = History.getFullUrl(url_or_hash);

				// Check URL
				id = History.getIdByUrl(url)||false;
				if ( id ) {
					State = History.getStateById(id);
				}

				// Create State
				if ( !State && create && !History.isTraditionalAnchor(url_or_hash) ) {
					State = History.createStateObject(null,null,url);
				}
			}

			// Return
			return State;
		};

		/**
		 * History.getIdByUrl()
		 * Get a State ID by a State URL
		 */
		History.getIdByUrl = function(url){
			// Fetch
			var id = History.urlToId[url] || History.store.urlToId[url] || undefined;

			// Return
			return id;
		};

		/**
		 * History.getLastSavedState()
		 * Get an object containing the data, title and url of the current state
		 * @return {Object} State
		 */
		History.getLastSavedState = function(){
			return History.savedStates[History.savedStates.length-1]||undefined;
		};

		/**
		 * History.getLastStoredState()
		 * Get an object containing the data, title and url of the current state
		 * @return {Object} State
		 */
		History.getLastStoredState = function(){
			return History.storedStates[History.storedStates.length-1]||undefined;
		};

		/**
		 * History.hasUrlDuplicate
		 * Checks if a Url will have a url conflict
		 * @param {Object} newState
		 * @return {Boolean} hasDuplicate
		 */
		History.hasUrlDuplicate = function(newState) {
			// Prepare
			var hasDuplicate = false,
				oldState;

			// Fetch
			oldState = History.extractState(newState.url);

			// Check
			hasDuplicate = oldState && oldState.id !== newState.id;

			// Return
			return hasDuplicate;
		};

		/**
		 * History.storeState
		 * Store a State
		 * @param {Object} newState
		 * @return {Object} newState
		 */
		History.storeState = function(newState){
			// Store the State
			History.urlToId[newState.url] = newState.id;

			// Push the State
			History.storedStates.push(History.cloneObject(newState));

			// Return newState
			return newState;
		};

		/**
		 * History.isLastSavedState(newState)
		 * Tests to see if the state is the last state
		 * @param {Object} newState
		 * @return {boolean} isLast
		 */
		History.isLastSavedState = function(newState){
			// Prepare
			var isLast = false,
				newId, oldState, oldId;

			// Check
			if ( History.savedStates.length ) {
				newId = newState.id;
				oldState = History.getLastSavedState();
				oldId = oldState.id;

				// Check
				isLast = (newId === oldId);
			}

			// Return
			return isLast;
		};

		/**
		 * History.saveState
		 * Push a State
		 * @param {Object} newState
		 * @return {boolean} changed
		 */
		History.saveState = function(newState){
			// Check Hash
			if ( History.isLastSavedState(newState) ) {
				return false;
			}

			// Push the State
			History.savedStates.push(History.cloneObject(newState));

			// Return true
			return true;
		};

		/**
		 * History.getStateByIndex()
		 * Gets a state by the index
		 * @param {integer} index
		 * @return {Object}
		 */
		History.getStateByIndex = function(index){
			// Prepare
			var State = null;

			// Handle
			if ( typeof index === 'undefined' ) {
				// Get the last inserted
				State = History.savedStates[History.savedStates.length-1];
			}
			else if ( index < 0 ) {
				// Get from the end
				State = History.savedStates[History.savedStates.length+index];
			}
			else {
				// Get from the beginning
				State = History.savedStates[index];
			}

			// Return State
			return State;
		};
		
		/**
		 * History.getCurrentIndex()
		 * Gets the current index
		 * @return (integer)
		*/
		History.getCurrentIndex = function(){
			// Prepare
			var index = null;
			
			// No states saved
			if(History.savedStates.length < 1) {
				index = 0;
			}
			else {
				index = History.savedStates.length-1;
			}
			return index;
		};

		// ====================================================================
		// Hash Helpers

		/**
		 * History.getHash()
		 * @param {Location=} location
		 * Gets the current document hash
		 * Note: unlike location.hash, this is guaranteed to return the escaped hash in all browsers
		 * @return {string}
		 */
		History.getHash = function(doc){
			var url = History.getLocationHref(doc),
				hash;
			hash = History.getHashByUrl(url);
			return hash;
		};

		/**
		 * History.unescapeHash()
		 * normalize and Unescape a Hash
		 * @param {String} hash
		 * @return {string}
		 */
		History.unescapeHash = function(hash){
			// Prepare
			var result = History.normalizeHash(hash);

			// Unescape hash
			result = decodeURIComponent(result);

			// Return result
			return result;
		};

		/**
		 * History.normalizeHash()
		 * normalize a hash across browsers
		 * @return {string}
		 */
		History.normalizeHash = function(hash){
			// Prepare
			var result = hash.replace(/[^#]*#/,'').replace(/#.*/, '');

			// Return result
			return result;
		};

		/**
		 * History.setHash(hash)
		 * Sets the document hash
		 * @param {string} hash
		 * @return {History}
		 */
		History.setHash = function(hash,queue){
			// Prepare
			var State, pageUrl;

			// Handle Queueing
			if ( queue !== false && History.busy() ) {
				// Wait + Push to Queue
				//History.debug('History.setHash: we must wait', arguments);
				History.pushQueue({
					scope: History,
					callback: History.setHash,
					args: arguments,
					queue: queue
				});
				return false;
			}

			// Log
			//History.debug('History.setHash: called',hash);

			// Make Busy + Continue
			History.busy(true);

			// Check if hash is a state
			State = History.extractState(hash,true);
			if ( State && !History.emulated.pushState ) {
				// Hash is a state so skip the setHash
				//History.debug('History.setHash: Hash is a state so skipping the hash set with a direct pushState call',arguments);

				// PushState
				History.pushState(State.data,State.title,State.url,false);
			}
			else if ( History.getHash() !== hash ) {
				// Hash is a proper hash, so apply it

				// Handle browser bugs
				if ( History.bugs.setHash ) {
					// Fix Safari Bug https://bugs.webkit.org/show_bug.cgi?id=56249

					// Fetch the base page
					pageUrl = History.getPageUrl();

					// Safari hash apply
					History.pushState(null,null,pageUrl+'#'+hash,false);
				}
				else {
					// Normal hash apply
					document.location.hash = hash;
				}
			}

			// Chain
			return History;
		};

		/**
		 * History.escape()
		 * normalize and Escape a Hash
		 * @return {string}
		 */
		History.escapeHash = function(hash){
			// Prepare
			var result = History.normalizeHash(hash);

			// Escape hash
			result = window.encodeURIComponent(result);

			// IE6 Escape Bug
			if ( !History.bugs.hashEscape ) {
				// Restore common parts
				result = result
					.replace(/\%21/g,'!')
					.replace(/\%26/g,'&')
					.replace(/\%3D/g,'=')
					.replace(/\%3F/g,'?');
			}

			// Return result
			return result;
		};

		/**
		 * History.getHashByUrl(url)
		 * Extracts the Hash from a URL
		 * @param {string} url
		 * @return {string} url
		 */
		History.getHashByUrl = function(url){
			// Extract the hash
			var hash = String(url)
				.replace(/([^#]*)#?([^#]*)#?(.*)/, '$2')
				;

			// Unescape hash
			hash = History.unescapeHash(hash);

			// Return hash
			return hash;
		};

		/**
		 * History.setTitle(title)
		 * Applies the title to the document
		 * @param {State} newState
		 * @return {Boolean}
		 */
		History.setTitle = function(newState){
			// Prepare
			var title = newState.title,
				firstState;

			// Initial
			if ( !title ) {
				firstState = History.getStateByIndex(0);
				if ( firstState && firstState.url === newState.url ) {
					title = firstState.title||History.options.initialTitle;
				}
			}

			// Apply
			try {
				document.getElementsByTagName('title')[0].innerHTML = title.replace('<','&lt;').replace('>','&gt;').replace(' & ',' &amp; ');
			}
			catch ( Exception ) { }
			document.title = title;

			// Chain
			return History;
		};


		// ====================================================================
		// Queueing

		/**
		 * History.queues
		 * The list of queues to use
		 * First In, First Out
		 */
		History.queues = [];

		/**
		 * History.busy(value)
		 * @param {boolean} value [optional]
		 * @return {boolean} busy
		 */
		History.busy = function(value){
			// Apply
			if ( typeof value !== 'undefined' ) {
				//History.debug('History.busy: changing ['+(History.busy.flag||false)+'] to ['+(value||false)+']', History.queues.length);
				History.busy.flag = value;
			}
			// Default
			else if ( typeof History.busy.flag === 'undefined' ) {
				History.busy.flag = false;
			}

			// Queue
			if ( !History.busy.flag ) {
				// Execute the next item in the queue
				clearTimeout(History.busy.timeout);
				var fireNext = function(){
					var i, queue, item;
					if ( History.busy.flag ) return;
					for ( i=History.queues.length-1; i >= 0; --i ) {
						queue = History.queues[i];
						if ( queue.length === 0 ) continue;
						item = queue.shift();
						History.fireQueueItem(item);
						History.busy.timeout = setTimeout(fireNext,History.options.busyDelay);
					}
				};
				History.busy.timeout = setTimeout(fireNext,History.options.busyDelay);
			}

			// Return
			return History.busy.flag;
		};

		/**
		 * History.busy.flag
		 */
		History.busy.flag = false;

		/**
		 * History.fireQueueItem(item)
		 * Fire a Queue Item
		 * @param {Object} item
		 * @return {Mixed} result
		 */
		History.fireQueueItem = function(item){
			return item.callback.apply(item.scope||History,item.args||[]);
		};

		/**
		 * History.pushQueue(callback,args)
		 * Add an item to the queue
		 * @param {Object} item [scope,callback,args,queue]
		 */
		History.pushQueue = function(item){
			// Prepare the queue
			History.queues[item.queue||0] = History.queues[item.queue||0]||[];

			// Add to the queue
			History.queues[item.queue||0].push(item);

			// Chain
			return History;
		};

		/**
		 * History.queue (item,queue), (func,queue), (func), (item)
		 * Either firs the item now if not busy, or adds it to the queue
		 */
		History.queue = function(item,queue){
			// Prepare
			if ( typeof item === 'function' ) {
				item = {
					callback: item
				};
			}
			if ( typeof queue !== 'undefined' ) {
				item.queue = queue;
			}

			// Handle
			if ( History.busy() ) {
				History.pushQueue(item);
			} else {
				History.fireQueueItem(item);
			}

			// Chain
			return History;
		};

		/**
		 * History.clearQueue()
		 * Clears the Queue
		 */
		History.clearQueue = function(){
			History.busy.flag = false;
			History.queues = [];
			return History;
		};


		// ====================================================================
		// IE Bug Fix

		/**
		 * History.stateChanged
		 * States whether or not the state has changed since the last double check was initialised
		 */
		History.stateChanged = false;

		/**
		 * History.doubleChecker
		 * Contains the timeout used for the double checks
		 */
		History.doubleChecker = false;

		/**
		 * History.doubleCheckComplete()
		 * Complete a double check
		 * @return {History}
		 */
		History.doubleCheckComplete = function(){
			// Update
			History.stateChanged = true;

			// Clear
			History.doubleCheckClear();

			// Chain
			return History;
		};

		/**
		 * History.doubleCheckClear()
		 * Clear a double check
		 * @return {History}
		 */
		History.doubleCheckClear = function(){
			// Clear
			if ( History.doubleChecker ) {
				clearTimeout(History.doubleChecker);
				History.doubleChecker = false;
			}

			// Chain
			return History;
		};

		/**
		 * History.doubleCheck()
		 * Create a double check
		 * @return {History}
		 */
		History.doubleCheck = function(tryAgain){
			// Reset
			History.stateChanged = false;
			History.doubleCheckClear();

			// Fix IE6,IE7 bug where calling history.back or history.forward does not actually change the hash (whereas doing it manually does)
			// Fix Safari 5 bug where sometimes the state does not change: https://bugs.webkit.org/show_bug.cgi?id=42940
			if ( History.bugs.ieDoubleCheck ) {
				// Apply Check
				History.doubleChecker = setTimeout(
					function(){
						History.doubleCheckClear();
						if ( !History.stateChanged ) {
							//History.debug('History.doubleCheck: State has not yet changed, trying again', arguments);
							// Re-Attempt
							tryAgain();
						}
						return true;
					},
					History.options.doubleCheckInterval
				);
			}

			// Chain
			return History;
		};


		// ====================================================================
		// Safari Bug Fix

		/**
		 * History.safariStatePoll()
		 * Poll the current state
		 * @return {History}
		 */
		History.safariStatePoll = function(){
			// Poll the URL

			// Get the Last State which has the new URL
			var
				urlState = History.extractState(History.getLocationHref()),
				newState;

			// Check for a difference
			if ( !History.isLastSavedState(urlState) ) {
				newState = urlState;
			}
			else {
				return;
			}

			// Check if we have a state with that url
			// If not create it
			if ( !newState ) {
				//History.debug('History.safariStatePoll: new');
				newState = History.createStateObject();
			}

			// Apply the New State
			//History.debug('History.safariStatePoll: trigger');
			History.Adapter.trigger(window,'popstate');

			// Chain
			return History;
		};


		// ====================================================================
		// State Aliases

		/**
		 * History.back(queue)
		 * Send the browser history back one item
		 * @param {Integer} queue [optional]
		 */
		History.back = function(queue){
			//History.debug('History.back: called', arguments);

			// Handle Queueing
			if ( queue !== false && History.busy() ) {
				// Wait + Push to Queue
				//History.debug('History.back: we must wait', arguments);
				History.pushQueue({
					scope: History,
					callback: History.back,
					args: arguments,
					queue: queue
				});
				return false;
			}

			// Make Busy + Continue
			History.busy(true);

			// Fix certain browser bugs that prevent the state from changing
			History.doubleCheck(function(){
				History.back(false);
			});

			// Go back
			history.go(-1);

			// End back closure
			return true;
		};

		/**
		 * History.forward(queue)
		 * Send the browser history forward one item
		 * @param {Integer} queue [optional]
		 */
		History.forward = function(queue){
			//History.debug('History.forward: called', arguments);

			// Handle Queueing
			if ( queue !== false && History.busy() ) {
				// Wait + Push to Queue
				//History.debug('History.forward: we must wait', arguments);
				History.pushQueue({
					scope: History,
					callback: History.forward,
					args: arguments,
					queue: queue
				});
				return false;
			}

			// Make Busy + Continue
			History.busy(true);

			// Fix certain browser bugs that prevent the state from changing
			History.doubleCheck(function(){
				History.forward(false);
			});

			// Go forward
			history.go(1);

			// End forward closure
			return true;
		};

		/**
		 * History.go(index,queue)
		 * Send the browser history back or forward index times
		 * @param {Integer} queue [optional]
		 */
		History.go = function(index,queue){
			//History.debug('History.go: called', arguments);

			// Prepare
			var i;

			// Handle
			if ( index > 0 ) {
				// Forward
				for ( i=1; i<=index; ++i ) {
					History.forward(queue);
				}
			}
			else if ( index < 0 ) {
				// Backward
				for ( i=-1; i>=index; --i ) {
					History.back(queue);
				}
			}
			else {
				throw new Error('History.go: History.go requires a positive or negative integer passed.');
			}

			// Chain
			return History;
		};


		// ====================================================================
		// HTML5 State Support

		// Non-Native pushState Implementation
		if ( History.emulated.pushState ) {
			/*
			 * Provide Skeleton for HTML4 Browsers
			 */

			// Prepare
			var emptyFunction = function(){};
			History.pushState = History.pushState||emptyFunction;
			History.replaceState = History.replaceState||emptyFunction;
		} // History.emulated.pushState

		// Native pushState Implementation
		else {
			/*
			 * Use native HTML5 History API Implementation
			 */

			/**
			 * History.onPopState(event,extra)
			 * Refresh the Current State
			 */
			History.onPopState = function(event,extra){
				// Prepare
				var stateId = false, newState = false, currentHash, currentState;

				// Reset the double check
				History.doubleCheckComplete();

				// Check for a Hash, and handle apporiatly
				currentHash = History.getHash();
				if ( currentHash ) {
					// Expand Hash
					currentState = History.extractState(currentHash||History.getLocationHref(),true);
					if ( currentState ) {
						// We were able to parse it, it must be a State!
						// Let's forward to replaceState
						//History.debug('History.onPopState: state anchor', currentHash, currentState);
						History.replaceState(currentState.data, currentState.title, currentState.url, false);
					}
					else {
						// Traditional Anchor
						//History.debug('History.onPopState: traditional anchor', currentHash);
						History.Adapter.trigger(window,'anchorchange');
						History.busy(false);
					}

					// We don't care for hashes
					History.expectedStateId = false;
					return false;
				}

				// Ensure
				stateId = History.Adapter.extractEventData('state',event,extra) || false;

				// Fetch State
				if ( stateId ) {
					// Vanilla: Back/forward button was used
					newState = History.getStateById(stateId);
				}
				else if ( History.expectedStateId ) {
					// Vanilla: A new state was pushed, and popstate was called manually
					newState = History.getStateById(History.expectedStateId);
				}
				else {
					// Initial State
					newState = History.extractState(History.getLocationHref());
				}

				// The State did not exist in our store
				if ( !newState ) {
					// Regenerate the State
					newState = History.createStateObject(null,null,History.getLocationHref());
				}

				// Clean
				History.expectedStateId = false;

				// Check if we are the same state
				if ( History.isLastSavedState(newState) ) {
					// There has been no change (just the page's hash has finally propagated)
					//History.debug('History.onPopState: no change', newState, History.savedStates);
					History.busy(false);
					return false;
				}

				// Store the State
				History.storeState(newState);
				History.saveState(newState);

				// Force update of the title
				History.setTitle(newState);

				// Fire Our Event
				History.Adapter.trigger(window,'statechange');
				History.busy(false);

				// Return true
				return true;
			};
			History.Adapter.bind(window,'popstate',History.onPopState);

			/**
			 * History.pushState(data,title,url)
			 * Add a new State to the history object, become it, and trigger onpopstate
			 * We have to trigger for HTML4 compatibility
			 * @param {object} data
			 * @param {string} title
			 * @param {string} url
			 * @return {true}
			 */
			History.pushState = function(data,title,url,queue){
				//History.debug('History.pushState: called', arguments);

				// Check the State
				if ( History.getHashByUrl(url) && History.emulated.pushState ) {
					throw new Error('History.js does not support states with fragement-identifiers (hashes/anchors).');
				}

				// Handle Queueing
				if ( queue !== false && History.busy() ) {
					// Wait + Push to Queue
					//History.debug('History.pushState: we must wait', arguments);
					History.pushQueue({
						scope: History,
						callback: History.pushState,
						args: arguments,
						queue: queue
					});
					return false;
				}

				// Make Busy + Continue
				History.busy(true);

				// Create the newState
				var newState = History.createStateObject(data,title,url);

				// Check it
				if ( History.isLastSavedState(newState) ) {
					// Won't be a change
					History.busy(false);
				}
				else {
					// Store the newState
					History.storeState(newState);
					History.expectedStateId = newState.id;

					// Push the newState
					history.pushState(newState.id,newState.title,newState.url);

					// Fire HTML5 Event
					History.Adapter.trigger(window,'popstate');
				}

				// End pushState closure
				return true;
			};

			/**
			 * History.replaceState(data,title,url)
			 * Replace the State and trigger onpopstate
			 * We have to trigger for HTML4 compatibility
			 * @param {object} data
			 * @param {string} title
			 * @param {string} url
			 * @return {true}
			 */
			History.replaceState = function(data,title,url,queue){
				//History.debug('History.replaceState: called', arguments);

				// Check the State
				if ( History.getHashByUrl(url) && History.emulated.pushState ) {
					throw new Error('History.js does not support states with fragement-identifiers (hashes/anchors).');
				}

				// Handle Queueing
				if ( queue !== false && History.busy() ) {
					// Wait + Push to Queue
					//History.debug('History.replaceState: we must wait', arguments);
					History.pushQueue({
						scope: History,
						callback: History.replaceState,
						args: arguments,
						queue: queue
					});
					return false;
				}

				// Make Busy + Continue
				History.busy(true);

				// Create the newState
				var newState = History.createStateObject(data,title,url);

				// Check it
				if ( History.isLastSavedState(newState) ) {
					// Won't be a change
					History.busy(false);
				}
				else {
					// Store the newState
					History.storeState(newState);
					History.expectedStateId = newState.id;

					// Push the newState
					history.replaceState(newState.id,newState.title,newState.url);

					// Fire HTML5 Event
					History.Adapter.trigger(window,'popstate');
				}

				// End replaceState closure
				return true;
			};

		} // !History.emulated.pushState


		// ====================================================================
		// Initialise

		/**
		 * Load the Store
		 */
		if ( sessionStorage ) {
			// Fetch
			try {
				History.store = JSON.parse(sessionStorage.getItem('History.store'))||{};
			}
			catch ( err ) {
				History.store = {};
			}

			// Normalize
			History.normalizeStore();
		}
		else {
			// Default Load
			History.store = {};
			History.normalizeStore();
		}

		/**
		 * Clear Intervals on exit to prevent memory leaks
		 */
		History.Adapter.bind(window,"unload",History.clearAllIntervals);

		/**
		 * Create the initial State
		 */
		History.saveState(History.storeState(History.extractState(History.getLocationHref(),true)));

		/**
		 * Bind for Saving Store
		 */
		if ( sessionStorage ) {
			// When the page is closed
			History.onUnload = function(){
				// Prepare
				var	currentStore, item, currentStoreString;

				// Fetch
				try {
					currentStore = JSON.parse(sessionStorage.getItem('History.store'))||{};
				}
				catch ( err ) {
					currentStore = {};
				}

				// Ensure
				currentStore.idToState = currentStore.idToState || {};
				currentStore.urlToId = currentStore.urlToId || {};
				currentStore.stateToId = currentStore.stateToId || {};

				// Sync
				for ( item in History.idToState ) {
					if ( !History.idToState.hasOwnProperty(item) ) {
						continue;
					}
					currentStore.idToState[item] = History.idToState[item];
				}
				for ( item in History.urlToId ) {
					if ( !History.urlToId.hasOwnProperty(item) ) {
						continue;
					}
					currentStore.urlToId[item] = History.urlToId[item];
				}
				for ( item in History.stateToId ) {
					if ( !History.stateToId.hasOwnProperty(item) ) {
						continue;
					}
					currentStore.stateToId[item] = History.stateToId[item];
				}

				// Update
				History.store = currentStore;
				History.normalizeStore();

				// In Safari, going into Private Browsing mode causes the
				// Session Storage object to still exist but if you try and use
				// or set any property/function of it it throws the exception
				// "QUOTA_EXCEEDED_ERR: DOM Exception 22: An attempt was made to
				// add something to storage that exceeded the quota." infinitely
				// every second.
				currentStoreString = JSON.stringify(currentStore);
				try {
					// Store
					sessionStorage.setItem('History.store', currentStoreString);
				}
				catch (e) {
					if (e.code === DOMException.QUOTA_EXCEEDED_ERR) {
						if (sessionStorage.length) {
							// Workaround for a bug seen on iPads. Sometimes the quota exceeded error comes up and simply
							// removing/resetting the storage can work.
							sessionStorage.removeItem('History.store');
							sessionStorage.setItem('History.store', currentStoreString);
						} else {
							// Otherwise, we're probably private browsing in Safari, so we'll ignore the exception.
						}
					} else {
						throw e;
					}
				}
			};

			// For Internet Explorer
			History.intervalList.push(setInterval(History.onUnload,History.options.storeInterval));

			// For Other Browsers
			History.Adapter.bind(window,'beforeunload',History.onUnload);
			History.Adapter.bind(window,'unload',History.onUnload);

			// Both are enabled for consistency
		}

		// Non-Native pushState Implementation
		if ( !History.emulated.pushState ) {
			// Be aware, the following is only for native pushState implementations
			// If you are wanting to include something for all browsers
			// Then include it above this if block

			/**
			 * Setup Safari Fix
			 */
			if ( History.bugs.safariPoll ) {
				History.intervalList.push(setInterval(History.safariStatePoll, History.options.safariPollInterval));
			}

			/**
			 * Ensure Cross Browser Compatibility
			 */
			if ( navigator.vendor === 'Apple Computer, Inc.' || (navigator.appCodeName||'') === 'Mozilla' ) {
				/**
				 * Fix Safari HashChange Issue
				 */

				// Setup Alias
				History.Adapter.bind(window,'hashchange',function(){
					History.Adapter.trigger(window,'popstate');
				});

				// Initialise Alias
				if ( History.getHash() ) {
					History.Adapter.onDomLoad(function(){
						History.Adapter.trigger(window,'hashchange');
					});
				}
			}

		} // !History.emulated.pushState


	}; // History.initCore

	// Try to Initialise History
	if (!History.options || !History.options.delayInit) {
		History.init();
	}

})(window);

/**
 * Google Maps with ACF
 * http://www.advancedcustomfields.com/resources/google-map/
 * ================================================== */ 

(function($) {

	/**
	 * new_map
	 * This function will render a Google Map onto the selected jQuery element
	 * @param	$el (jQuery element)
	 * @return	n/a
	 **/

	function new_map( $el ) {
		
		// Marker selector
		var $markers = $el.find('.marker');
		
		
		// Configuration
		var args = {
			zoom			    : 12,
			scrollwheel     : false,
			styles          : [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}],
			center		    : new google.maps.LatLng(0, 0),
			mapTypeId	    : google.maps.MapTypeId.ROADMAP,
			disableDefaultUI: true
		};
		
		
		// Create new map       	
		var map = new google.maps.Map( $el[0], args);
		
		
		// Add reference to markers
		map.markers = [];
		
		
		// Add markers
		$markers.each(function(){
			
	    	add_marker( $(this), map );
			
		});
		
		
		// Center newly created map
		center_map( map );
		
		
		// Return map
		return map;
		
	}


	/**
	 * add_marker
	 * This function will add a marker to the selected Google Map
	 * @param	$marker (jQuery element)
	 * @param	map (Google Map object)
	 * @return n/a
	 **/

	function add_marker( $marker, map ) {

		// Position
		var latlng = new google.maps.LatLng( $marker.attr('data-lat'), $marker.attr('data-lng') );

		// Create marker
		var marker = new google.maps.Marker({
			position		: latlng,
			map			: map,
			icon: {
				path				: google.maps.SymbolPath.CIRCLE,
				fillOpacity		: 1,
				fillColor		: '#FF6B00',
				strokeOpacity	: 0,
				scale				: 12
			}
		});

		// Add marker to array
		map.markers.push( marker );

		// If marker contains HTML, add it to an infoWindow
		if ( $marker.html() ) {
			// Create info window
			var infowindow = new google.maps.InfoWindow({
				content		: $marker.html()
			});

			// Show info window when marker is clicked
			google.maps.event.addListener(marker, 'click', function() {

				infowindow.open( map, marker );

			});
		}

	}


	/**
	 * center_map
	 * This function will center the map, showing all markers attached to this map
	 * @param	map (Google Map object)
	 * @return n/a
	 **/

	function center_map( map ) {

		// vars
		var bounds = new google.maps.LatLngBounds();

		// loop through all markers and create bounds
		$.each( map.markers, function( i, marker ){

			var latlng = new google.maps.LatLng( marker.position.lat(), marker.position.lng() );

			bounds.extend( latlng );

		});

		// only 1 marker?
		if ( map.markers.length == 1 )	{
			// set center of map
		    map.setCenter( bounds.getCenter() );
		    // map.setZoom( 16 );

		}	else	{
			// fit to bounds
			map.fitBounds( bounds );
		}

	}

	/**
	 * document ready
	 * This function will render each map when the document is ready (page has loaded)
	 * @param	n/a
	 * @return	n/a
	 **/

	// Global map variable
	var map = null;

	$(document).ready(function(){

		$('.google-map').each(function(){
			var $this = $(this);
		
			// Create new map for each maps selector if is visible
			if ( $this.is(':visible') ) {
				map = new_map( $this );
			}
		});

		$(window).on('statechangecomplete', function() {
			setTimeout( function() {
				$('.google-map').each(function(){
					// Create new map for each maps selector
					map = new_map( $(this) );
				});
			}, 500);
		})

	});

})(jQuery);
/**
 * Navigation handler
 * @author Theis Nygaard
 **/ 

;( function( $, window, document, undefined ) {

	'use strict';

	/**
	 * Prepare global variables
	 **/ 

	var History = window.History; 
	var $window = $(window);
	var $body = $(document.body);
	var rootUrl = History.getRootUrl();
	var relativeUrl = window.location.href.replace( rootUrl, '' );


	/**
	 * Defaults
	 **/ 

	var defaults = {

		// Navigation selectors
		navTrigger: '.nav-toggle',
		nav: '.nav',
		navList: '.nav__list',
		navItem: '.nav__item',
		navLink: '.nav__link',
		navDropdown: '.nav__dropdown',
		navDropdownTrigger: '.nav__dropdown-toggle',

		// Ajax settings and selectors
		loader: '#loader',
		contentSelector: '#main',

		// Body class states
		states: {
			body: 'is-open--nav',
			dropdown: 'is-open',
			ajax: 'is-loading'
		},

		// Breakpoints
		breakpoints: {
			mobile: 992
		}
	};


	/**
	 * Plugin constructor
	 **/ 

	function atwebNavigation( element, options ) {
		this.element = element;
		this.settings = $.extend( {}, defaults, options );

		// Global states
		this.navOpen = false;
		this.dropdownOpen = false;

		// Determine history API support
		this.supportsAjax = History.enabled;
		this.isLoading = false;

		// Viewport variables
		this.vW = $(window).width();
		this.isMobile = ( this.vW < this.settings.breakpoints.mobile );

		// Initialize
		this.init();
	}


	/**
	 * Helper functions
	 **/ 

	// Check if link is internal (custom jQuery expression selector)
	$.expr[':'].internalLink = function(obj, index, meta, stack){

		// Prepare
		var $this = $(obj);
		var url = $this.attr( 'href' ) || '';
		var isInternalLink;
		
		// Check link
		isInternalLink = url.substring( 0, rootUrl.length ) === rootUrl || url.indexOf( ':' ) === -1;
		
		// Ignore or Keep
		return isInternalLink;
	}


	/**
	 * Plugin methods
	 **/ 

	$.extend( atwebNavigation.prototype, {
		
		/**
		 * Initialize plugin methods
		 **/ 

		init: function() {
			var self = this;

			// Run bindEvents method
			self.bindEvents();

			// Set loader to "has-loaded" to remove it
			$(self.settings.loader).addClass('has-loaded');
		},


		/**
		 * Bind events
		 **/ 

		bindEvents: function() {
			var self = this;
			
			/**
			 * Trigger navigation visibility
			 **/ 

			$(self.settings.navTrigger).on( 'click', function(e) {
				e.preventDefault();

				if (self.navOpen) {
					self.closeNav();
				} else {
					self.openNav();
				}
			});


			/**
			 * Dropdown visibility trigger
			 **/ 

			$(document).on( 'click', self.settings.navDropdownTrigger, function(e) {
				if ( !self.isMobile ) {
					e.preventDefault();

					if ( self.dropdownOpen ) {
						self.closeDropdown( $(this) );
					} else {
						self.openDropdown( $(this) );
					}
				}
			});


			/**
			 * Ajax internal links if supported
			 **/ 

			if ( self.supportsAjax ) {
				self.initAjax();
			}

			
			/**
			 * Close navigation when clicking outside
			 **/ 

			$(document).on( 'click', function(e) {
				var target = $(e.target);

				if ( self.navOpen && !target.is(self.settings.navTrigger) && !target.is($(self.element)) && $(self.element).find($(target)).length === 0 ) {
					self.closeNav();
				}
			});

			
			/**
			 * Update window width on resize
			 **/ 

			$(window).on( 'resize', function() {
				self.vW = $(window).width();
			});
		},


		/**
		 * Open navigation
		 **/ 

		openNav: function() {
			var self = this;
			if ( !self.navOpen ) {
				$('html, body').animate({
					scrollTop: 0
				}, 'fast', function() {
					$('body').addClass('is-open--nav');
					self.navOpen = true;
				});
			}
		},


		/**
		 * Close navigation
		 **/ 

		closeNav: function() {
			if ( this.navOpen ) {
				$('body').removeClass('is-open--nav');
				this.navOpen = false;
			}
		},


		/**
		 * Open dropdown
		 * @param {object} element The clicked element
		 **/ 

		openDropdown: function(element) {
			if ( !this.dropdownOpen ) {
				element.parent().addClass('is-open');
				element.parent().find('.nav__dropdown').attr('aria-hidden', 'false');
				this.dropdownOpen = true;
			}
		},


		/**
		 * Close dropdown
		 * @param {object} element The clicked element
		 **/ 

		closeDropdown: function(element) {
			if ( this.dropdownOpen ) {
				element.parent().removeClass('is-open');
				element.parent().find('.nav__dropdown').attr('aria-hidden', 'true');
				this.dropdownOpen = false;
			}
		},


		/**
		 * Initialize ajax handling 
		 **/ 

		initAjax: function() {
			var self = this;

			// Bind ajax on internal links
			$('body').on('click','a:internalLink:not(.no-ajax, #load-comments, .nav__dropdown-toggle, [href^="#"], [href*="wp-login"], [href*="wp-admin"])' , function(e) {

				// Prepare
				var $this = $(this);
				var url = $this.attr('href');
				var title = $this.attr('title') || null;

				// Discard ajax if CMD or Control is pressed while clicking
				if ( event.which == 2 || event.metaKey ) return true;

				// Ajaxify the shit out of it
				History.pushState( null, title, url);

				return false;
			});

			// Set active class on loader
			$(self.settings.loader).addClass('has-loaded');

			// Activate hook on state change
			self.bindStateChange();
		},


		/**
		 * Bind on window statechange
		 **/ 

		bindStateChange: function() {
			var self = this;

			$window.on('statechange', function() {

				// Prepare
				var state = History.getState();
				var url = state.url;
				relativeUrl = url.replace( rootUrl, '' );

				// Make sure the navigation closes
				self.closeNav();
				self.closeDropdown($('.is-open .nav__link'));

				// Scroll to top and activate loader
				$('html, body').animate({ 
					scrollTop: 0 
				}, 'normal', self.activateLoader());

				// Perform actual AJAX request
				self.ajaxGetPage(url);
			});
		},


		/**
		 * Perform actual ajax function and replace all content with new page content
		 * @param {string} url URL of which to load via ajax
		 **/ 

		ajaxGetPage: function(url) {
			var self = this;

			// Imitate promise
			var promise = $.get( url, function(data) {

				// If no data available, continue
				if (!data) {
					document.location.href = url;
					return false;
				}

				// Get data ready for filtering
				var $data = $(data);

				// Meta
				var $dataMeta = $data.filter('meta');
				var $dataTitle = $data.filter('title').first().text(); 

				// Scripts and stylesheets
				var $dataStyles = $data.filter('style');
				var $dataScripts = $data.filter('.document-footer').find('script');
				var $dataStylesheets = $data.filter('.document-footer').find('link');

				// Content
				var $dataNavigation = $data.find(self.settings.navList);
				var $dataContent = $data.filter(self.settings.contentSelector);
				var $dataContentHtml = $dataContent.html() || $dataBody.html();
			
				// Update methods immediately
				self.ajaxUpdateTitle( $dataTitle );

				// Set timeout used for mimicking loading
				setTimeout(function() {
					
					// Update content
					self.ajaxUpdateMeta( $dataMeta );
					self.ajaxUpdateBodyClass( data );
					self.ajaxUpdateNavigation( $dataNavigation );
					self.ajaxUpdateContent( $dataContentHtml);
					self.ajaxUpdateScripts( $dataScripts);
					self.ajaxUpdateStylesheets( $dataStylesheets);

					// Trigger state change and update analytics tracking
					$window.trigger('statechangecomplete');
					self.updateGoogleAnalytics(url);
					self.updateFacebookPixel(url);

					// Deactivate and clear loader
					self.deactivateLoader();
					setTimeout(function() {
						self.clearLoader();
					}, 3000);

				}, 1500);	
			});

			promise.done(function(data) {

			});

			promise.fail(function(data) {
				self.ajaxUpdateContent(false);
			});
		},


		/**
		 * Update meta tags in head section
		 * @param {object} meta A collection of meta objects
		 **/ 

		ajaxUpdateMeta: function(meta) {
			var self = this;
			var currentMeta = $('meta');
			var newMeta = meta;

			currentMeta.remove();
			$('head').append(newMeta);
		},


		/**
		 * Update page title
		 * @param {string} title New page title
		 **/ 

		ajaxUpdateTitle: function(title) {
			document.title = title;
		},

	
		/**
		 * Update content with new page content
		 * @param {string} content HTML markup from new page 
		 **/ 

		ajaxUpdateContent: function(content) {
			var self = this;
			$(self.settings.contentSelector).html(content);
		},


		/**
		 * Updates body class with classes from new page
		 * @param {string} data String of classes
		 **/ 

		ajaxUpdateBodyClass: function(data) {
			var matches = data.match( /<body.*class=["']([^"']*)["'].*>/ );
			var classes = matches && matches[1];

			$('body').removeClass().addClass(classes);
		},


		/**
		 * Update navigation
		 * @param {string} data Navigation markup from new page (updates active classes etc.)
		 **/ 

		ajaxUpdateNavigation: function(data) {
			var self = this;
			var s = self.settings;

			$(s.navList).html(data);
		},


		/**
		 * Update scripts in footer
		 * @param {object} Collection of script objects
		 **/ 

		ajaxUpdateScripts: function(scripts) {
			var self = this;
			var currentScripts = $('.document-footer script').get();
			// $('.document-footer script').remove();

			// Loop trough all new scripts
			$.each(scripts, function() {

				// Prepare variables
				var scriptLoaded = false;
				var $newScript = $(this).get(0);
				var newScriptSrc = $newScript.src;
				var newScriptHTML = $newScript.innerHTML;

				// Loop through existing scripts
				$.each(currentScripts, function() {
					var $oldScript = $(this).get(0);
					var oldScriptSrc = $oldScript.src;
					var oldScriptHTML = $oldScript.innerHTML;

					// Compare script src
					if ( newScriptSrc !== '' && oldScriptSrc !== '' ) {
						if ( newScriptSrc === oldScriptSrc ) {
							scriptLoaded = true;
							return;
						}
					}

					// Compare inner HTML of script
					if ( newScriptHTML !== '' && oldScriptHTML !== '' ) {
						if ( newScriptHTML === oldScriptHTML ) {
							scriptLoaded = true;
							return;
						}
					}

				});

				// If new script does not exist, create a script element
				if ( !scriptLoaded ) {
					var scriptNode = document.createElement('script');

					// Check for script src
					if ( newScriptSrc ) {
						if ( !$newScript.async ) { 
							scriptNode.async = false; 
						}
						scriptNode.src = newScriptSrc;
					}
					
					// Insert innerHMTL
					scriptNode.appendChild(document.createTextNode(newScriptHTML));

					// Append to document footer
					$('.document-footer').append(scriptNode);	
				}
			});
		},


		/**
		 * Update stylesheets in footer
		 * @param {object} Collection of link objects
		 **/ 

		ajaxUpdateStylesheets: function(stylesheets) {
			var self = this;
			var currentStyles = $('.document-footer link').get();

			// Loop trough all new scripts
			$.each(stylesheets, function() {

				// Prepare variables
				var styleLoaded = false;
				var $newstyle = $(this).get(0);
				var newstyleHref = $newstyle.href;

				// Loop through existing styles
				$.each(currentStyles, function() {
					var $oldstyle = $(this).get(0);
					var oldstyleHref = $oldstyle.href;

					// Compare style Href
					if ( newstyleHref !== '' && oldstyleHref !== '' ) {
						if ( newstyleHref === oldstyleHref ) {
							styleLoaded = true;
							return;
						}
					}

				});

				// If new style does not exist, create a style element
				if ( !styleLoaded ) {
					var styleNode = document.createElement('link');

					styleNode.rel = 'stylesheet';

					// Check for style src
					if ( newstyleHref ) {
						styleNode.href = newstyleHref;
					}
					
					// Append to document footer
					$('.document-footer').append(styleNode);	
				}
			});
		},


		/**
		 * Update Facebook Pixel to track new URL
		 * @param {string} url The visited url
		 **/ 
	
		updateGoogleAnalytics: function(url) {
			if ( typeof window.ga !== 'undefined' ) {
				window.ga('send', 'pageview', url);
			}
		},


		/**
		 * Update Facebook Pixel to track new URL
		 * @param {string} url The visited url
		 **/ 

		updateFacebookPixel: function(url) {
			if ( typeof window.fbq !== 'undefined' ) {
				window.fbq('track', 'PageView');
			}
		},


		/**
		 * Legacy methods
		 **/ 

		// Retrieve page content
		getPageLegacy: function(location) {
			var self = this;

			self.closeNav();
			$('html, body').animate({ 
				scrollTop: 0 
			}, 'normal', self.activateLoader());

			// Regular GET request
			var promise = $.get( location, function(data) {
				var content = $(data).filter(self.settings.ajaxDynamic);
				$(self.settings.loader).onCSSTransitionEnd( function() {
					self.updateContent(content);
				});
			});

			promise.done( function(data) {
				document.title = $(data).filter(document.title).text();
				setTimeout( function() {
					self.deactivateLoader();
				}, 1500);
			});

			promise.fail( function(data) {

			});
		},


		/**
		 * Update content with new content
		 * @param {string} content Content HTML
		 **/ 

		updateContent: function(content) {
			$(this.settings.ajaxDynamic).html(content);
		},


		/**
		 * Loader methods
		 **/ 

		// Activate loader
		activateLoader: function() {
			if ( !this.isLoading ) {
				this.isLoading = true;
				$('body').addClass(this.settings.states.ajax);
				$(this.settings.loader).removeClass('has-loaded').addClass('is-loading');
			}
		},


		// Deactivate loader
		deactivateLoader: function() {
			if ( this.isLoading ) {
				this.isLoading = false;
				$('body').removeClass(this.settings.states.ajax);
				$(this.settings.loader).addClass('has-loaded');
			}
		},

		// Clear loader
		clearLoader: function() {
			$(this.settings.loader).removeClass('is-loading');
		},
	});


	/**
	 * Plugin instatiation
	 **/ 

	$.fn.atwebNavigation = function( options ) {
		return this.each( function() {
			if ( !$.data( this, 'atwebNavigation' ) ) {
				$.data( this, 'atwebNavigation', new atwebNavigation( this, options ) );
			}
		});
	};

})( jQuery, window, document );
/**
 * atriumWeb Slogan
 **/ 

;( function( $, window, document, undefined ) {

	'use strict';

	/**
	 * Plugin defaults
	 **/ 

	var defaults = {
		words: ['borg', 'bowlingborg'],
		delay: 3000,
		classes: {
			typer: 'typer',
			placeholder: 'placeholder',
			inactive: 'is-inactive',
			active: 'is-active',
		}
	};


	/**
	 * Plugin constructor
	 **/ 

	function atwebSlogan( element, options ) {
		this.element = element;
		this.settings = $.extend( true, {}, defaults, options );

		this.interval = null;
		this.init();
	}


	/**
	 * Helper functions
	 **/ 

	/**
	 * Get selector from string
	 * @param {string} str
	 * @return {mixed} false|jQuery Object
	 **/ 

	function getSelector(str) {
		if ( typeof str !== 'string' ) {
			console.log('A string must be passed to this function: ' + this);
			return false; 
		} else {
			return $('.' + str);
		}
	}


	/**
	 * Plugin methods
	 **/ 

	$.extend( atwebSlogan.prototype, {

		/**
		 * Initialize
		 **/ 

		init: function() {
			var $defaultWord = getSelector(this.settings.classes.typer);

			$defaultWord.remove();
			this.appendWords(this.settings.words);
		},


		/**
		 * appendWords
		 * @param {object} wordList Array of words
		 **/ 

		appendWords: function(wordList) {
			var $sloganPlaceholder = getSelector(this.settings.classes.placeholder);

			// Loop through wordlist
			for (var i = 0; i < wordList.length ; i++) {
				$sloganPlaceholder.append( '<span class="' + this.settings.classes.typer + '">' + wordList[i] + '</span>' );
			}

			// Add active class (sets up appropriate styling for words)
			$(this.element).addClass('slogan--loaded');
			this.startAnimation(wordList.length);
		},
		 

		/**
		 * Start animation
		 * @param {integer} listLength Length of wordList array of objects
		 **/ 

		startAnimation: function(listLength) {
			var self = this;
			var i = 1;
			var activeClass = self.settings.classes.active;
			var inactiveClass = self.settings.classes.inactive;
			var $word = getSelector(self.settings.classes.typer);
			$word.eq(0).addClass(self.settings.classes.active);

			self.interval = setInterval( function() {

				$word.eq(i).addClass(activeClass);

				if ( i !== 0 ) {
					$word.eq(i - 1).removeClass(activeClass).addClass(inactiveClass);
				}

				i++;

				if ( i === listLength ) {
					clearInterval(self.interval);
				}
			}, self.settings.delay);
		},


		/**
		 * End the animation
		 **/ 

		endAnimation: function() {
			clearInterval(this.interval);
		}
	});


	/**
	 * Plugin instatiation
	 **/ 

	$.fn.atwebSlogan = function( options ) {
		return this.each( function() {
			if ( !$.data( this, 'atwebSlogan' ) ) {
				$.data( this, 'atwebSlogan', new atwebSlogan( this, options ) );
			}
		});
	};

})( jQuery, window, document );
/**
 * atriumWeb Comments
 **/ 

;( function( $, window, document, undefined ) {

	'use strict';

	/**
	 * Defaults
	 **/ 

	var defaults = {
		loadComments: true,
		loadCommentsSelector: $('#comment-load'),

		postComment: true,
		formSelector: $('#comment-submit')
	};


	/**
	 * Plugin constructor
	 **/ 

	function atwebComments( element, options ) {
		this.element = element;
		this.settings = $.extend( {}, defaults, options );

		this.init();
	}


	/**
	 * Plugin methods
	 **/ 

	$.extend( atwebComments.prototype, {


		/**
		 * Initialize plugin
		 **/ 
	
		init: function() {
			var self = this;
			
			// Setup variables
			var loadCommentsSelector = self.settings.loadCommentsSelector;
			var formSelector = self.settings.formSelector;

			$(loadCommentsSelector).on( 'click', function(e) {
				var commentPage = $(this).data('comment-page');
				e.preventDefault();

				$(this).addClass('is-loading');
				self.getComments(commentPage);
			});
		},


		/**
		 * getComments
		 * @param {string} page The current page id
		 **/ 

		getComments: function(page) {
			var self = this;
			var loadCommentsSelector = self.settings.loadCommentsSelector;
			var ajax = WP.ajaxUrl;
			var data = {
				action: 'atweb_get_comments',
				page: page
			};

			var promise = $.get(ajax, data);

			promise.then(function(data) {
				$(loadCommentsSelector).removeClass('is-loading');
				self.replaceComments(data);
			});

			promise.fail(function(data) {
				console.log('Get request failed: ' + data);
			});
		},


		/**
		 * Replace comments
		 * @param {string} data Comment markup
		 **/ 

		replaceComments: function(data) {
			var self = this;
			$('#comments').find('.comment').remove();
			$('#comments').find('.comments__list > #respond').before(data);
			$(self.settings.loadCommentsSelector).parent().remove();
		}

	});


	/**
	 * Plugin instatiation
	 **/ 

	$.fn.atwebComments = function( options ) {
		return this.each( function() {
			if ( !$.data( this, 'atwebComments' ) ) {
				$.data( this, 'atwebComments', new atwebComments( this, options ) );
			}
		});
	};

})( jQuery, window, document );
/**
 * atriumWeb Social share buttons
 **/ 

;( function( $, window, document, undefined ) {

	'use strict';

	/**
	 * Defaults
	 **/ 

	var defaults = {
		appendScriptsTo: '.document-scripts',
		services: {
			facebook: true,
			twitter: true,
			linkedin: true,
			googleplus: true
		}
	};


	/**
	 * Plugin constructor
	 **/ 

	function atwebSocial( element, options ) {
		this.element = element;
		this.settings = $.extend( true, {}, defaults, options );

		this.init();
	}


	/**
	 * Plugin methods
	 **/ 

	$.extend( atwebSocial.prototype, {

		/**
		 * Init method
		 **/ 
	
		init: function() {
			var self = this;
			var services = self.settings.services;
			
			if ( services.facebook ) {
				self.initFacebook();
			}

			if ( services.twitter ) {
				self.initTwitter();
			}

			if ( services.linkedin ) {
				self.initLinkedIn();
			}

			if ( services.googleplus ) {
				self.initGooglePlus();
			}

		},


		/**
		 * Facebook
		 **/ 

		initFacebook: function() {

			if ( !$('#fb_root').length ) {
				$('body').append('<div id="fb-root"></div>');
			}

			if ( typeof FB !== 'undefined' ) {
				FB.init({
					appId: '855130884595916',
					version: 'v2.5',
					xfbml: 1
				});
			} else {
				$.getScript('//connect.facebook.net/da_DK/sdk.js', function() {
					FB.init({
						appId: '855130884595916',
						version: 'v2.5',
						xfbml: 1
					});
				});
			}
		},


		/**
		 * Twitter
		 **/ 

		initTwitter: function() {

			// Instantiate Twitter if scripts is available
			if (typeof twttr !== 'undefined'){
				twttr.widgets.load();
			} else {
				$.getScript('//platform.twitter.com/widgets.js');
			}
		},


		/**
		 * LinkedIn
		 **/ 

		initLinkedIn: function() {
			var self = this;

			// Instantiate LinkedIn if it is available
			if ( typeof IN !== 'undefined'  ) {
				IN.parse();
			} else {
				$.getScript('//platform.linkedin.com/in.js', function() {
					IN.init({
						lang: 'da_DK'
					});
				});
			}
		},


		/**
		 * Google+
		 **/ 

		initGooglePlus: function() {
			var self = this;

			// Instantiate Google API if it is available
			if ( typeof gapi != 'undefined') {
				$(".g-plus").each(function () {
					gapi.plusone.render($(this).get(0));
				});
			} else {
				$.getScript('https://apis.google.com/js/platform.js', function() {
				});
			}
		}

	});


	/**
	 * Plugin instatiation
	 **/ 

	$.fn.atwebSocial = function( options ) {
		return this.each( function() {
			if ( !$.data( this, 'atwebSocial' ) ) {
				$.data( this, 'atwebSocial', new atwebSocial( this, options ) );
			}
		});
	};

})( jQuery, window, document );
/**
 * atriumWeb Filter
 **/

;( function( $, window, document, undefined ) {

	'use strict';

	/**
	 * Plugin defaults
	 **/

	var defaults = {

		// Form
		form: '#filter-form',
		input: '.filter__input',
		selectList: '#filter-select-list',
		selectCurrent: '#filter-select-current',

		// Grid
		masonry: false,
		fixItUp: false,
		gridContainer: '#filter-grid',
		gridHidden: '#filter-hidden',
		gridItems: '.grid__item',
		columns: 6,
		breakAt: {},

		// Lazy loading
		lazyLoad: false,
		lazyLoadSelector: '.is-lazy',
		lazyLoadSucces: 'has-loaded'
	};


	/**
	 * Plugin constructor
	 **/

	function atwebFilter( element, options ) {
		this.element = element;
		this.settings = $.extend( true, {}, defaults, options );
		this.lazy = false;
		this.init();
	}


	/**
	 * Plugin methods
	 **/

	$.extend( atwebFilter.prototype, {

		/**
		 * Initialize
		 **/

		init: function() {
			this.bindEvents();
		},


		/**
		 * bindEvents
		 **/

		bindEvents: function() {
			var self = this;
			var s = self.settings;

			/**
			 * Initialize macy if supported and available
			 **/

			if ( s.masonry ) {
				if ( typeof Macy !== 'undefined' ) {
					self.initGrid();
				} else {
					console.log('Macy.js is required to enable masonry.');
				}
			}


			/**
			 * Init lazy loading
			 **/

			if ( s.lazyLoad ) {
				self.initLazyLoad();
			}


			/**
			 * Perform filtering on form input change
			 **/

			$(s.input).on('change', function() {
				var values = $(s.form).serializeArray();

				if ( values.length ) {
					self.filterItems(values);
					self.repackItems();

					if ( s.lazyLoad ) {
						self.revalidateLazyLoad();
					}
				} else {
					self.resetItems();
				}

			});
		},


		/**
		 * Initialize masonry grid
		 **/

		initGrid: function() {
			var s = this.settings;

			setTimeout(function() {
				Macy.init({
					container: s.gridContainer,
					waitForImages: true,
					columns: s.columns,
					breakAt: s.breakAt
				});
			}, 100);
		},


		/**
		 * Repack grid items
		 * @todo Create bLazy revalidation
		 **/

		repackItems: function() {
			var s = this.settings;

			if ( s.masonry ) {
				Macy.recalculate();
			}
		},


		/**
		 * Hide grid items
		 **/

		hideItems: function() {
			var s = this.settings;
			$(s.gridItems).addClass('is-hidden');
			if(s.fixItUp){
				$(s.gridItems).remove();
				Macy.recalculate();
			}
		},


		/**
		 * Reset grid
		 * @todo Setup listener on transition end
		 **/

		resetItems: function() {
			var self = this;
			var s = self.settings;

			$(s.gridItems).removeClass('is-hidden');
			//Macy.recalculate();
		},


		/**
		 * Lazy load images
		 **/

		initLazyLoad: function() {
			var self = this;
			var s = self.settings;

			setTimeout( function() {
				self.lazy = new Blazy({
					selector: s.lazyLoadSelector,
					offset: 100,
					successClass: s.lazyLoadSucces,
					// success: function(ele){
					// 	console.log(ele + ' has loaded');
					// },
					// error: function(ele, msg){
					// 	if(msg === 'missing'){
					// 		console.log('Data-src is missing');
					// 	}
					// 	else if(msg === 'invalid'){
					// 		console.log('Data-src is invalid');
					// 	}
					// }
				});
			}, 300);
		},


		/**
		 * Revalidate lazy loading
		 **/

		revalidateLazyLoad: function() {
			var self = this;

			setTimeout( function() {
				self.lazy.revalidate();
			}, 250);

			if ( self.settings.masonry ) {
				Macy.recalculate();
			}
		},

		sortData: function(wrapper, item){
			var self = this;

			wrapper.find(item).sort(function (a, b) {
			    return +b.getAttribute('data-timestamp') - +a.getAttribute('data-timestamp');
			})
			.appendTo( wrapper );

		},
		/**
		 * Filter items
		 * @param {object} input A collection of form input objects
		 **/

		filterItems: function(input) {
			var self = this;
			var s = self.settings;
			var $items = $(s.gridItems);
			var $hidden = $(s.hiddenContainer);
			var $grid = $(s.gridContainer);
			var fixIt = s.fixItUp;

			$items.each(function() {
				var inFilter = true;
				var itemFilters = $(this).data('filter').split(' ');

				// Loop through input objects
				for ( var i = input.length - 1; i >= 0; i-- ) {
					var value = input[i].value;

					// Make sure the value exists in itemFilters array
					if ( $.inArray( value, itemFilters ) === -1 ) {
						inFilter = false;
						break;
					}
				}

				if ( inFilter ) {
					$(this).removeClass('is-hidden');
					if (fixIt) $(this).appendTo($grid);


				} else {
					$(this).addClass('is-hidden');
					if (fixIt) $(this).appendTo($hidden);
				}
			});
			if (fixIt) {
				self.sortData($grid ,$items);
				Macy.recalculate();
			}
		},
	});


	/**
	 * Plugin instatiation
	 **/

	$.fn.atwebFilter = function( options ) {
		return this.each( function() {
			if ( !$.data( this, 'atwebFilter' ) ) {
				$.data( this, 'atwebFilter', new atwebFilter( this, options ) );
			}
		});
	};

})( jQuery, window, document );

function atwebApp() {

	/**
	 * Globals
	 **/
	var lazy;


	/**
	 * Navigation
	 **/

	var $nav = $('.nav');
	$nav.atwebNavigation();

 
	/**
	 * Initialize slogan
	 **/
	var $slogan = $('.slogan');
	var wordList;

	if ( $slogan.length ) {
		wordList = $slogan.data('words').split(', ');

		$('.slogan').atwebSlogan({
			words: wordList,
			classes: {
				typer: 'slogan__word--typer',
				placeholder: 'slogan__word--placeholder'
			}
		});
	}


	/**
	 * Comment plugin
	 **/

	$('#comments').atwebComments({
		loadComments: true,
		loadCommentsSelector: $('#load-comments'),

		postComment: true,
		formSelector: $('#commentform')
	});



	/**
	 * Social share buttons
	 **/

	$('#share').atwebSocial({
		services: {
			facebook: true,
			twitter: true,
			linkedin: true,
			googleplus: true
		}
	});



	/**
	 * Scroll to internal links
	 **/

	$('a[href^="#"]:not(.nav__dropdown-toggle)').on('click', function(e) {
		e.preventDefault();

		var target = this.hash;
		var $target = $(target);

		$('html, body').stop().animate({
			'scrollTop': $target.offset().top
		}, 900, 'swing');

	});


	/**
	 * Cases filter
	 **/

	// Initialize filter plugin
	$('#cases-filter').atwebFilter({
		form: '#cases-filter',
		input: '.filter__input',
		gridItems: '.cases__item',
		lazyLoad: true,
		lazyLoadSelector: '.cases__image',
		lazyLoadSucces: 'has-loaded'
	});


	/**
	 * Custom select box
	 **/

	(function(document) {

		/**
		 * Selectors and states
		 **/

		// Selectors
		var $select = $('.js-cases-filter-select');
		var $trigger = $('.js-cases-filter-trigger');
		var $current = $('.js-cases-filter-text');
		var $list = $('.js-cases-filter-list')
		var $input = $('.js-cases-filter-input');

		// State
		var isOpen = false;


		/**
		 * Visibility functions
		 **/

		// Open select dropdown
		function openDropdown() {
			$trigger.addClass('is-open');
			$list.addClass('is-open');
			isOpen = true;
		}

		// Close select dropdown
		function closeDropdown() {
			$trigger.removeClass('is-open');
			$list.removeClass('is-open');
			isOpen = false;
		}


		/**
		 * Set up event listeners
		 **/

		// Click on trigger
		$trigger.on('click', function(e) {
			if ( isOpen ) {
				closeDropdown();
			} else {
				openDropdown();
			}
		});

		// Click outside dropdown
		$(document).on('click', function(e) {
			var target = $(e.target);

			if ( isOpen && !target.is($select) && $select.find($(target)).length === 0 ) {
				closeDropdown();
			}
		});

		// Replace trigger text with checked input label
		$input.on('change', function() {
			var label = $(this).siblings('.filter__label').text();
			$current.text(label);
			closeDropdown();
		});

	})(document);



	/**
	 * Blog masonry
	 **/

	// Initialize filter plugin
	$('#blog-overview').atwebFilter({
		form: '#blog-filter',

		masonry: true,
		fixItUp: true,
		gridContainer: '#blog-overview',
		hiddenContainer: '#blog-hidden',
		gridItems: '.blog__item',
		columns: 5,
		breakAt: {
			1600: 4,
			1200: 3,
			992: 2,
			600: 1
		},

		lazyLoad: false,
		lazyLoadSelector: '.blog__image-lazy'
	});



	/**
	 * Lazy loading via bLazy
	 **/

	(function() {
		setTimeout(function() {
			lazy = new Blazy({
				selector: '.is-lazy',
				offset: 100,
				successClass: 'has-loaded'
			});
		}, 300);

	})();

	$(window).on('statechangecomplete', function() {
		if ( lazy !== 'undefined' ) {
			setTimeout( function() {
				lazy.revalidate();
			}, 300);
		}
	});


	/**
	 * Gravity Forms
	 **/

	$(document).trigger('gform_post_render', [1, 1]);

}

jQuery(document).ready(function($){
	atwebApp();

	// console.info('%cSå du er interesseret i koden, hva\'? Måske har vi et job til dig. :-) Se mere her: http://atriumweb.dk/om-os/jobs', 'color: grey;');

	$(window).on('statechangecomplete', function() {
		atwebApp();
	});
});

//# sourceMappingURL=main.js.map