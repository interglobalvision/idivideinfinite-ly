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

    _this.Layout.init();
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

    _this.windowHeight = $(window).height();
    _this.mainContainerTop = $('body').height() - _this.windowHeight;
    _this.mainContainerMarginTop();

  },

  mainContainerMarginTop: function() {
    var _this = this;

    $('#main-container').css('margin-top', _this.mainContainerTop * 0.95);
  }
}

Site.Organs = {
  init: function() {
    var _this = this;

    _this.svg = $('#organs-svg');

    _this.initSkrollr();
    _this.bindMouse();
  },

  initSkrollr: function() {
    var _this = this;

    var s = skrollr.init({
      easing: 'quadratic',
      render: function() {
        Site.Layout.init();
      }
    });
  },

  bindMouse: function() {
    var _this = this;

    $(window).mousemove(function(event) {
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

      _this.svg.css('transform', 'perspective(500px) rotate3d(' + skewX + ', ' + skewY + ', ' + skewY + ', ' + ((skewY * skewX) / 3) + 'deg)');
    });
  }
};

jQuery(document).ready(function () {
  'use strict';

  Site.init();

});
