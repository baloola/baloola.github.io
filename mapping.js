
 
    var addLegendActions,balla, clearMap, getUpdatedData, hash, hidden_legend, legend, map, proximityFromZoom, setFeatures,
      setTimeFrame, start_us, start_zoom;
      
  
    proximityFromZoom = function (z) {
      var miles, zoom, zz;
      zoom = parseInt(z.split('#')[1], 10);
      zz = Math.round(zoom)
      miles = [10000, 8000, 7000, 6000, 5000, 3000, 1000, 500, 300, 150, 150, 80, 30, 20, 10, 10, 5, 3, 1, 1, 0.5, 0.5,
        0.5, 0.5
      ];
      return "&proximity_square=" + miles[zoom];
    // return "&proximity_square=10000"   
    };
  
    // setFeatures = function (geojson, clear) {
      
    //   geojson.features.map(function (marker) {
    //     //   create a DOM element for the marker
    //     var color;
    //     var el = document.createElement('div');
    //     el.className = 'marker';
    //     color = marker.properties['marker-color'].split('#')[1];
    //     el.style.backgroundImage = "url('http://a.tiles.mapbox.com/v4/marker/pin-s+" + color +
    //       ".png?access_token=pk.eyJ1IjoiYmFsb29sYSIsImEiOiJjamMzMTVlenYwNWpuMzNxbTgwdjR2ZDFjIn0.AtizeK-yHUxFBHX95bfTIw')";
  
    //     el.style.width = '20px';
    //     el.style.height = '50px';
  
    //     var mas = new mapboxgl.Marker(el)
    //       .setLngLat(marker.geometry.coordinates)
    //       .setPopup(new mapboxgl.Popup({
    //           offset: {
    //             'top': [0, 0]
    //           }
    //         }) // add popups
    //         .setHTML('<h3>' + marker.properties.title + '</h3><p>' + marker.properties.description + '</p>'))
    //       .addTo(map);
    //     return window.markers.push(mas);
    //   });
  
      
    // };
  
    setHeatFeatures = function (geojson) {

      geojson.features.map(function (marker) {
        //   create a DOM element for the marker
        
    var fasd=Math.floor(Date.now() / 1000)
    
   var dass= Math.floor(new Date(marker.properties.occurred_at.slice(0,18)) / 1000);
    marker.properties.weight=fasd-dass
  
  
  
  
  
    // var color;
    //     var el = document.createElement('div');
    //     el.className = 'marker';
    //     color = marker.properties['marker-color'].split('#')[1];
    //     el.style.backgroundImage = "url('http://a.tiles.mapbox.com/v4/marker/pin-s+" + color +
    //       ".png?access_token=pk.eyJ1IjoiYmFsb29sYSIsImEiOiJjamMzMTVlenYwNWpuMzNxbTgwdjR2ZDFjIn0.AtizeK-yHUxFBHX95bfTIw')";
  
    //     el.style.width = '20px';
    //     el.style.height = '50px';
    //     var mas = new mapboxgl.Marker(el)
    //       .setLngLat(marker.geometry.coordinates)
    //       .setPopup(new mapboxgl.Popup({
    //           offset: {
    //             'top': [0, 0]
    //           }
    //         }) // add popups
    //         .setHTML('<h3>' + marker.properties.weight + '</h3><p>' + marker.properties.description + '</p>'))
    //       .addTo(map);
    //     return window.markers.push(mas);
    
      });
      
        return balla=geojson
      
      
      
    };
  
  
    
  
  
  
    getUpdatedData = function (url) {
      var l, lat, lng, zoom, zz;
      if (url == undefined) {
        url = window.location.href;
      }
      l = url.split('/');
      lng = l.pop();
      lat = l.pop();
      zoom = l.pop();
      
      url = window.base_url + "proximity=" + lat + "," + lng + (proximityFromZoom(zoom));
      if (window.limit != null) {
        url += "&limit=" + window.limit;
      }else{
        url += "&limit=100" 
      
        
      }
      if (window.query != null) {
        url += "&query=" + window.query;
      }
      if (window.occurred_after != null) {
        url += "&occurred_after=" + window.occurred_after;
      }
      
      if (!zoom.match('#')) {
        lng = start_us[1];
        lat = start_us[0];
        zoom = "" + start_zoom;
      }
     

      return $.ajax({
        dataType: 'json',
        url: url,
        success: function (geojson) {
         // return setFeatures(geojson);
         return setHeatFeatures(geojson)
         
         
       

        }
      });
    
    };
    
    clearMap = function () {
      var j, len, m, ref;
      ref = window.markers;
      for (j = 0, len = ref.length; j < len; j++) {
        m = ref[j];
        m.remove();
      }
      window.markers = [];
      
    };
    DrawHeatLayer=function (data){
        // map.removeLayer('theft_heat')
        map.addLayer({
            id: 'theft_heat',
            type: 'heatmap',
            source: data,
            maxzoom: 15,
            paint: {
              // increase weight as diameter breast height increases
              'heatmap-weight': {
                property: 'weight',
                type: 'categorical',//exponential, categrical,identity
                stops: [
                  [1, 0],
                  [Math.floor(Date.now() / 1000), 1388530800]
                ]
              },
              // increase intensity as zoom level increases
              'heatmap-intensity': {
                stops: [
                  [11, 1],
                  [15, 3]
                ]
              },
              // assign color values be applied to points depending on their density
              'heatmap-color': [
                'interpolate',
                ['linear'],
                ['heatmap-density'],
                0, 'rgba(236,222,239,0)',
                0.2, 'rgb(208,209,230)',
                0.4, 'rgb(166,189,219)',
                0.6, 'rgb(103,169,207)',
                0.8, 'rgb(28,144,153)'
              ],
              // increase radius as zoom increases
              'heatmap-radius': {
                stops: [
                  [11, 25],
                  [15, 35]
                ]
              },
              // decrease opacity to transition into the circle layer
              'heatmap-opacity': {
                default: 1,
                stops: [
                  [15, 1],
                  [16, 0]
                ]
              },
            }
          }, 'waterway-label');
    }
    addLegendActions = function () {
      var j, results, t;
      $('#toggle_legend').click(function () {
        if (this.className === 'active') {
          $('#legend').css('display', 'none');
  
        } else {
          $('#legend').css('display', 'block');
        }
        return addLegendActions();
      });
      $('#searchbtn').click(function () {
        clearMap();
        window.query = $('#thefts-location').val();
        return getUpdatedData();
  
      });
      $('#clear_map').click(function () {
        return clearMap();
      });
      $('#show_more').click(function () {
        if (this.className === 'active') {
          this.innerHTML = 'show 500 (slower)';
          window.limit = 100;
          return this.className = '';
        } else {
          window.limit =500;
          this.className = 'active';
          this.innerHTML = 'show 100 (default)';
          return getUpdatedData();
        }
        
      });
      results = [];
      for (t = j = 1; j <= 6; t = ++j) {
        results.push($("#time_" + t).click(function () {
          var above, below, i, int, k, n, o, p, ref, ref1, ref2, results1;
          clearMap();
          int = parseInt(this.id.match(/\d+/)[0], 10);
          if (this.className === 'active') {
            this.className = '';
            for (below = k = ref = int + 1; ref <= 6 ? k <= 6 : k >= 6; below = ref <= 6 ? ++k : --k) {
              $("#time_" + below).removeClass('active');
            }
          } else {
            this.className = 'active';
            for (above = n = ref1 = int - 1; ref1 <= 1 ? n <= 1 : n >= 1; above = ref1 <= 1 ? ++n : --n) {
              $("#time_" + above).addClass('active');
            }
            if (int !== 6) {
              for (below = o = ref2 = int + 1; ref2 <= 6 ? o <= 6 : o >= 6; below = ref2 <= 6 ? ++o : --o) {
                $("#time_" + below).removeClass('active');
              }
            }
          }
          $("#time_1").addClass('active');
          results1 = [];
          for (i = p = 6; p >= 1; i = --p) {
            if ($("#time_" + i).hasClass('active')) {
              setTimeFrame(i);
  
              break;
            } else {
              results1.push(void 0);
            }
          }
          return results1;
        }));
      }
      return results;
    };
  
    setTimeFrame = function (int) {
      var now, tframe;
      now = Math.floor(Date.now() / 1000);
     
      tframe = [now - 86400, now - 604800, now - 2592000, now - 15552000, now - 31557600, now - 157788000];
      if (int === 6) {
        window.occurred_after = null;
      } else {
        window.occurred_after = tframe[int - 1];
      }
      return getUpdatedData();
    };
  
    window.base_url = 'https://bikewise.org/api/v2/locations/markers?incident_type=theft&';
  
    start_us = [40.814, -94.702];
  
    start_zoom = 5;
  
    window.existing_features = {};
  
    window.markers = [];
  
  
    mapboxgl.accessToken = 'pk.eyJ1IjoiYmFsb29sYSIsImEiOiJjamMzMTVlenYwNWpuMzNxbTgwdjR2ZDFjIn0.AtizeK-yHUxFBHX95bfTIw';
  
    map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v9',
      center: start_us,
      zoom: start_zoom,
      hash: true
    });
  
    var nav = new mapboxgl.NavigationControl();
    map.addControl(nav, 'top-left');
  
    map.on('load',function () {
        
        map.addSource('trees', {
            
          type: 'geojson',
          data: balla
        });
      DrawHeatLayer('trees')
        
    })
  
    hidden_legend = document.getElementById('hidden_legend').innerHTML;
  
    legend = document.getElementById('legend').innerHTML;
  
  
  
    addLegendActions();
  
  
    getUpdatedData('https://baloola.github.io/index.html#6.32/41.911/-71.727');
    
  
  
    var maasd = window.location.href;
    var fs;
    var randog = function () {
      fs = window.location.href;
      if (fs != maasd) {
        for (i = p = 6; p >= 1; i = --p) {
          if ($("#time_" + i).hasClass('active')) {
            setTimeFrame(i);
  
            break;
          } else {
              
            getUpdatedData();
        
            
          }
        }
        return maasd = fs;
      }
    }
    
    setTimeFrame()
    map.on('zoom', function () {
        randog()
        map.getSource('trees').setData(balla)
    });
    map.on('move',  function () {
        randog()
        map.getSource('trees').setData(balla)
    });
    

                      
    
    // ---
    // generated by coffee-script 1.9.2
