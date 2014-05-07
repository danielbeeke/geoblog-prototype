L.Icon.Default.imagePath = 'images'

$(function() {

  var markers = {}
  var map = {}
  var articles = fixtures
  var currentArticle = null

  window.functions = {

    /***************************************************************************
     * INIT
     **************************************************************************/

    init: function () {
      $('body').addClass('layout-map')

      map = L.map('map', {
        zoomControl: false,
        attributionControl: false
      }).setView([51.505, -0.09], 13);

      map.on('click', function () {
        if ($('body').hasClass('layout-article')) {
          functions.selectMap()
        }
      })

      L.tileLayer('http://tilemill.studiofonkel.nl/style/{z}/{x}/{y}.png?id=tmstyle:///home/administrator/styles/geoblog.tm2').addTo(map);

      $.each(articles, function (id, article) {
        functions.createMarker(id, article)
      })

      functions.getOsrmRoute(articles)
    },

    /***************************************************************************
     * CREATE A MARKER
     **************************************************************************/

    createMarker: function (id, article) {
      markers[id] = L.pagerMarker([article.lat, article.long]).addTo(map)
      markers[id]._leaflet_id = parseInt(id)

      markers[id].on('click', function(e) {
        if (currentArticle == this._leaflet_id) {
          functions.selectMap()
        }
        else {
          functions.selectArticle(this._leaflet_id)
        }
      })

      markers[id].on('mouseover', function(e) {
        console.log('hoi')
      })
    },

    /***************************************************************************
     * SELECT ARTICLE
     **************************************************************************/

    selectArticle: function (articleId) {
      if (articles[articleId]) {
        currentArticle = articleId

        // Get the current state, if there is an article active or are we viewing the fullscreen map.
        if ($('body').hasClass('layout-map')) {
          var transitionCodeRoute = 'resizeMapAndSetView'
        }
        else {
          var transitionCodeRoute = 'setView'
        }

        $('body').removeClass('layout-map').addClass('layout-article')

        $('#article h1').text(articles[articleId].title)
        $('#article .body').text(articles[articleId].body)

        /***********************************************************************
         * FROM STATE MAP: RESIZE MAP AND SET VIEW
         **********************************************************************/
        if (transitionCodeRoute == 'resizeMapAndSetView') {
          map.panToOffset([articles[articleId].lat, articles[articleId].long], [0, -$(window).height() / 4])
          $("#map").one("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
            map.invalidateSize({
              pan: false
            })
          })
        }

        /***********************************************************************
         * FROM STATE ARTICLE: SET VIEW
         **********************************************************************/
        else if(transitionCodeRoute == 'setView') {
          map.setView([articles[articleId].lat, articles[articleId].long])
        }

      }
    },

    /***************************************************************************
     * SELECT MAP
     **************************************************************************/

    selectMap: function () {
      $('body').addClass('layout-map').removeClass('layout-article')

      map.panToOffset([articles[currentArticle].lat, articles[currentArticle].long], [0, $(window).height() / 4])
      $("#map").one("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
        map.invalidateSize({
          pan: false
        })
      })

      currentArticle = null
    },

    /***************************************************************************
     * OSRM ROUTING CALLBACK
     **************************************************************************/

    routeCallback: function (osrmData) {
      var points = functions.decodeOsrmData(osrmData.route_geometry, 6)
      var polyline = L.polyline(points, {color: 'red'}).addTo(map);
    },


    /***************************************************************************
     * OSRM ROUTING CALLBACK
     **************************************************************************/

    getOsrmRoute: function (articles) {
      var points = []

      $.each(articles, function (id, article) {
        points.push('&loc=' + encodeURIComponent(article.lat) + ',' + encodeURIComponent(article.long))
      })

      $.ajax({
        type: 'GET',
        url: 'http://router.project-osrm.org/viaroute?z=13&output=json&geomformat=cmp&instructions=true' + points.join(''),
        cache: true,
        jsonp: 'jsonp',
        jsonpCallback: 'functions.routeCallback',
        contentType: "application/json",
        dataType: 'jsonp',
      })

    },

    decodeOsrmData: function (encoded, precision) {
      precision = Math.pow(10, -precision);
      var len = encoded.length, index=0, lat=0, lng = 0, array = [];
      while (index < len) {
        var b, shift = 0, result = 0;
        do {
          b = encoded.charCodeAt(index++) - 63;
          result |= (b & 0x1f) << shift;
          shift += 5;
        } while (b >= 0x20);
        var dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lat += dlat;
        shift = 0;
        result = 0;
        do {
          b = encoded.charCodeAt(index++) - 63;
          result |= (b & 0x1f) << shift;
          shift += 5;
        } while (b >= 0x20);
        var dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lng += dlng;
        //array.push( {lat: lat * precision, lng: lng * precision} );
        array.push( [lat * precision, lng * precision] );
      }
      return array;
    }


  }

  functions.init()

})
