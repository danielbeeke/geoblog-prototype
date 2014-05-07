L.PagerMarker = L.Marker.extend({

  options: {
    // A pager item is also a leaflet icon so we can use popups and clicks etc.
    pagerItem: '<div class="leaflet-pager-item"></div>',
    sortValue: null
  },

  initialize: function (latlng, options) {
    L.Marker.prototype.initialize.call(this, latlng, options);

    // Set the sort value for sorting the pager items.
    if (this.options.sortValue == null) {
      var d = new Date();
      this._sortValue = d.getTime();
    } else {
      this._sortValue = this.options.sortValue;
    }

    this._pagerItem = this.options.pagerItem
  },

  onAdd: function (map) {
    L.Marker.prototype.onAdd.call(this, map);

    var tempParent = document.createElement('div');
    tempParent.innerHTML = this.options.pagerItem;

    this._pagerItem = L.Class.extend({
      includes: L.Mixin.Events,
      _container: tempParent.firstChild
    });

    // map.pagerControl._container.appendChild(this._pagerItem);

    // L.DomUtil.addClass(this._pagerItem, 'leaflet-clickable');

    this._initInteraction();

  },

  _initInteraction: function () {
    L.Marker.prototype._initInteraction.call(this);

    var pagerItem = this._pagerItem,
        events = ['dblclick', 'mousedown', 'mouseover', 'mouseout'];

    // for (var i = 0; i < events.length; i++) {
    //   L.DomEvent.on(pagerItem, events[i], this._fireMouseEvent, this);
    // }

    // L.DomEvent.on(pagerItem, 'click', this._onMouseClick, this);
    // L.DomEvent.on(pagerItem, 'keypress', this._onKeyPress, this);
  },

});

L.pagerMarker = function (latlng, options) {
  return new L.PagerMarker(latlng, options);
};
