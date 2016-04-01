/*
 * Konami Code For jQuery Plugin
 * 1.3.0, 7 March 2014
 *
 * Using the Konami code, easily configure and Easter Egg for your page or any element on the page.
 *
 * Copyright 2011 - 2014 Tom McFarlin, http://tommcfarlin.com
 * Released under the MIT License
 */
!function(n){"use strict";n.fn.konami=function(t){var e,o,i;return e=n.extend({},n.fn.konami.defaults,t),this.each(function(){o=[],n(window).keyup(function(n){i=n.keyCode||n.which,e.code.length>o.push(i)||(e.code.length<o.length&&o.shift(),e.code.toString()===o.toString()&&e.cheat())})})},n.fn.konami.defaults={code:[38,38,40,40,37,39,37,39,66,65],cheat:null}}(jQuery);