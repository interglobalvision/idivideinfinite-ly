/* jshint browser: true, devel: true, indent: 2, curly: true, eqeqeq: true, futurehostile: true, latedef: true, undef: true, unused: true */
/* global $, document, Site, skrollr */

Site = {
  mobileThreshold: 601,
  skrollrHeight: 7000,
  init: function() {
    var _this = this;

    $(window).resize(function(){
      _this.onResize();
    });

    Site.Layout.init();
    Site.FlickrBackgrounds.init();

    $(document).ready(function() {
      _this.Organs.init();
      _this.Audio.init();
    });
  },

  onResize: function() {
    var _this = this;

    _this.Layout.onResize();
  },

  fixWidows: function() {
    // utility class mainly for use on headines to avoid widows [single words on a new line]
    $('.js-fix-widows').each(function(){
      var string = $(this).html();
      string = string.replace(/ ([^ ]*)$/,'&nbsp;$1');
      $(this).html(string);
    });
  },

  isMobile: function() {
    return (/Android|iPhone|iPad|iPod|BlackBerry/i).test(navigator.userAgent || navigator.vendor || window.opera);
  },
};

Site.Layout = {
  init: function() {
    var _this = this;

    _this.layout();
  },

  onResize: function() {
    var _this = this;

    _this.layout();

  },

  layout: function() {
    $('#main-container').css('padding-top', Site.skrollrHeight);
  }
};

Site.Organs = {
  init: function() {
    var _this = this;

    _this.$svg = $('#organs-svg');

    _this.initSkrollr();
    _this.bindMouse();
  },

  initSkrollr: function() {
    var _this = this;

    _this.skrollrInstance = skrollr.init({
      easing: 'quadratic',
      skrollrBody: 'main-container',
      forceHeight: false
    });
  },

  bindMouse: function() {
    var _this = this;

    if (Site.isMobile()) {
      if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', function(event) {
          // gamma and beta are values from -100 - 100
          var distanceX = (event.gamma + 100) / 100;
          var distanceY = (event.beta + 100) / 100;

          var transX = distanceX * 10;
          var transY = distanceY * 10;

          var skewX = (distanceX - 1) * 10;
          var skewY = (distanceY - 1) * 10;

          // leaving this here for testing
          //console.log('distanceX: ' + distanceX, 'distanceY: ' + distanceY, 'transX: ' + transX, 'transY: ' + transY, 'skewX: ' + skewX, 'skewY: ' + skewY);

          _this.skewImage(transX, transY, skewX, skewY);
        });
      }
    } else {
      $(window).mousemove(function(event) {
        var distanceX = (event.clientX * 2) / $(window).width();
        var distanceY = (event.clientY * 2) / $(window).height();

        var transX = distanceX * 10;
        var transY = distanceY * 10;

        var skewX = (distanceX - 1) * 10;
        var skewY = (distanceY - 1) * 10;

        // leaving this here for testing
        //console.log('distanceX: ' + distanceX, 'distanceY: ' + distanceY, 'transX: ' + transX, 'transY: ' + transY, 'skewX: ' + skewX, 'skewY: ' + skewY);
          
        _this.skewImage(transX, transY, skewX, skewY);
      });
    }
  },

  skewImage: function(transX, transY, skewX, skewY) {
    var _this = this;

    $('#pngmask image').css({
        'x': transX + '%',
        'y': transY + '%',
      });

    _this.$svg.css('transform', 'perspective(500px) rotate3d(' + skewX + ', ' + skewY + ', ' + skewY + ', ' + ((skewY * skewX) / 3) + 'deg)');
  }
};

Site.FlickrBackgrounds = {
  init: function() {
    var _this = this;

    // This is the text used in the search query
    _this.searchText = 'desert+beach+paradise+tropical';

    // Element where the background is set
    _this.imageNum = 1;

    // Flickr API key
    _this.apiKey = '6034ee53b5f4c9f50b9f7695b10b1298';

    // Make the request
    $.getJSON('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' + _this.apiKey + '&text=' + _this.searchText + '&safe_search=1&content_type=1&media=photos&format=json&jsoncallback=?', function(data) {

      // If Flicker says YUZ
      if(data.stat === 'ok') {
        // We will get 5 images
        for(var t = 1; t <= 5; t++) {
          // We will attempt to find an existing image 4 times
          for(var i = 0; i < 4; i++) {

            // Choose a random (0-99) photo from the data
            var randomPhoto = data.photos.photo[_this.getRandomNumber(0, 99)];

            // Construct the photo url
            var url = _this.constructUrl(randomPhoto);

            // Check if image exist
            if (_this.doesImageExist(url)) {
              _this.setTropicalBackground(url, t);
              break;
            } else if (i === 3) {
              _this.setTropicalBackground('img/dist/island-beach.jpg', t);
            }
          }
        }

        $('body').css('overflow','initial');
        $('#organs').css('opacity',1);
      }

    });

  },

  doesImageExist: function(url) {
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
    return 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_h.jpg';
  },

  setTropicalBackground: function(url, bgNum) {
    $('#tropical-bg-' + bgNum).attr('xlink:href', url);
  },

  getRandomNumber: function(min,max) {
    return Math.floor(Math.random() * max) + min;
  },
};

Site.Audio = {
  init: function() {
    var _this = this;

    _this.playlistId = '269048127';
    _this.clientId = 'tlpRScA9YMg119ZZrHZ6lAWCom7Rje9c';
    _this.playlistJson = 'http://api.soundcloud.com/playlists/' + _this.playlistId + '?client_id=' + _this.clientId;

    _this.getTrack();
  },

  getTrack: function() {
    var _this = this;

    $.getJSON(_this.playlistJson, function(data) {
      if (data) {
        var tracks = data.tracks;
        var randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
        var trackUrl = randomTrack.stream_url + '?client_id=' + _this.clientId;

        _this.addElement(trackUrl);
      }
    });
  },

  addElement: function(url) {
    var _this = this;
    var audioElem = '<audio id="audio" src="' + url + '" preload="auto" loop volume="1.0"></audio>';

    $('body').prepend(audioElem);
    $('#audio').trigger('play');

    _this.bindVolume();
  },

  bindVolume: function() {
    var audio = document.getElementById('audio');

    $(window).on('scroll', function() {
      var volume = (($('#gradient-background').offset().top - $(window).scrollTop()) + $('#gradient-background').height()) / $('#gradient-background').height();

      audio.volume = volume > 0.1 ? volume : 0.1;
    });
  },
};

Site.init();