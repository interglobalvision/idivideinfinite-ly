/* jshint browser: true, devel: true, indent: 2, curly: true, eqeqeq: true, futurehostile: true, latedef: true, undef: true, unused: true */
/* global jQuery, $, document, Site, Modernizr */

Site = {
  mobileThreshold: 601,
  init: function() {
    var _this = this;

    $(window).resize(function(){
      _this.onResize();
    });

    _this.FlickrBackgrounds.init();

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

Site.FlickrBackgrounds = {
  init: function() {
    var _this = this;

    // This is the text used in the search query
    _this.searchText = 'tropical+beach';

    // Element where the background is set
    _this.imageId = '#tropical-bg-';
    _this.imageNum = 1;

    // Flickr API key
    _this.apiKey = '6034ee53b5f4c9f50b9f7695b10b1298';

    // Make the request
    $.getJSON('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' + this.apiKey +'&text=' + _this.searchText + '&safe_search=1&content_type=1&media=photos&format=json&jsoncallback=?', function(data) {
      
      // If Flicker says YUZ
      if(data.stat === 'ok') {
        // We will get 5 images
        for(var t = 0; t < 5; t++) {
          // We will attempt to find an existing image 4 times
          for(var i = 0; i < 4; i++) {

            // Choose a random (0-99) photo from the data
            var randomPhoto = data.photos.photo[_this.getRandomNumber(0,99)];

            // Construct the photo url
            var url = _this.constructUrl(randomPhoto);

            // Check if image exist
            if (_this.imageExist(url)) {
              _this.setTropicalBg(url);
              break;
            } else if (i === 3) {
              _this.setTropicalBg('img/dist/island-beach.jpg');
            }
          }
        }

        $('body').css('overflow','initial');
        $('#organs').css('opacity',1);
      }
      

    });

  },

  imageExist: function(url) {
    var response = false;

    // Make the request to check if exists
    $.ajax({
      url: url,
      async: false,
    }).complete(function(jqXHR) {
      // If the photo exists
      if(jqXHR.status === 200) {
        response = true;
      }
    }).fail(function() {
      console.log('error');
    });

    return response;
  },

  constructUrl: function(photo) {
    return 'https://farm'+ photo.farm +'.staticflickr.com/' + photo.server +'/' + photo.id + '_' + photo.secret + '_h.jpg'

  },

  setTropicalBg: function(url) {
    var _this = this;

    if (_this.imageNum < 6) {
      $( _this.imageId + _this.imageNum ).attr('xlink:href',url);
      _this.imageNum++;
    }
  },

  getRandomNumber: function(min,max) {
    return Math.floor(Math.random() * max) + min;  
  },
};

jQuery(document).ready(function () {
  'use strict';

  Site.init();

});
