/*
 * L.Control.Zoom is used for the default zoom buttons on the map.
 */

L.Control.Pager = L.Control.extend({
  options: {
    position: 'bottomleft',
  },

  onAdd: function (map) {
    var pagerName = 'leaflet-control-pager',
        container = L.DomUtil.create('div', pagerName + ' leaflet-bar');

    this._map = map;

    // map.on('zoomend zoomlevelschange', this._updateDisabled, this);

    return container;
  },

  onRemove: function (map) {
    // map.off('zoomend zoomlevelschange', this._updateDisabled, this);
  },
});

L.Map.mergeOptions({
  pagerControl: true
});

L.Map.addInitHook(function () {
  if (this.options.pagerControl) {
    this.pagerControl = new L.Control.Pager();
    this.addControl(this.pagerControl);
  }
});

L.control.pager = function (options) {
  return new L.Control.Pager(options);
};

