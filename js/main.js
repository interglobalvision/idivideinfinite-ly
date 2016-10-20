/* jshint browser: true, devel: true, indent: 2, curly: true, eqeqeq: true, futurehostile: true, latedef: true, undef: true, unused: true */
/* global jQuery, $, document, Site, Modernizr */

Site = {
  mobileThreshold: 601,
  init: function() {
    var _this = this;

    $(window).resize(function(){
      _this.onResize();
    });

    $(document).ready(function() {
      _this.Organs.init();
    });

  },

  onResize: function() {
    var _this = this;

    _this.Layout.mainContainerMarginTop();
  },

  fixWidows: function() {
    // utility class mainly for use on headines to avoid widows [single words on a new line]
    $('.js-fix-widows').each(function(){
      var string = $(this).html();
      string = string.replace(/ ([^ ]*)$/,'&nbsp;$1');
      $(this).html(string);
    });
  },
};

Site.Layout = {
  init: function() {
    var _this = this;

  },

  mainContainerMarginTop: function() {
    $('#main-container').css('margin-top', $('body').height() - $(window).height());
  }
}

Site.Organs = {
  init: function() {
    var _this = this;

    _this.initSkrollr();
    _this.bindMouse();
  },

  initSkrollr: function() {
    var s = skrollr.init({
      easing: 'quadratic',
      render: function() {
        Site.Layout.mainContainerMarginTop();
      }
    });
  },

  bindMouse: function() {
    $(window).mousemove(function( event ) {
      var mouseX = event.clientX;
      var mouseY = event.clientY;

      var distanceX = (mouseX * 2) / $(window).width();
      var distanceY = (mouseY * 2) / $(window).height();

      var transX = distanceX * 10;
      var transY = distanceY * 10;

      var skewX = (distanceX - 1) * 10;
      var skewY = (distanceY - 1) * 10;

      $('#pngmask image').css({
        'x': transX + '%',
        'y': transY + '%',
      });

      $('svg').css('transform', 'skewX(' + skewX + 'deg) skewY(' + skewY + 'deg)');
    });
  }
};

jQuery(document).ready(function () {
  'use strict';

  Site.init();

});