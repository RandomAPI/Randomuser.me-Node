/*
 * Konami Code For jQuery Plugin
 * 1.3.0, 7 March 2014
 *
 * Using the Konami code, easily configure and Easter Egg for your page or any element on the page.
 *
 * Copyright 2011 - 2014 Tom McFarlin, http://tommcfarlin.com
 * Released under the MIT License
 */

(function ( $ ) {
	"use strict";

	$.fn.konami = function( options ) {

		var opts, masterKey, controllerCode, code;
		opts = $.extend({}, $.fn.konami.defaults, options);

		return this.each(function() {

			controllerCode = [];

			$( window ).keyup(function( evt ) {

				code = evt.keyCode || evt.which;

				if ( opts.code.length > controllerCode.push( code ) ) {
					return;
				} // end if

				if ( opts.code.length < controllerCode.length ) {
					controllerCode.shift();
				} // end if

				if ( opts.code.toString() !== controllerCode.toString() ) {
					return;
				} // end for

				opts.cheat();

			}); // end keyup

		}); // end each

	}; // end opts

	$.fn.konami.defaults = {
		code : [38,38,40,40,37,39,37,39,66,65],
		cheat: null
	};

}( jQuery ));