jQuery(function($) {


    var map;
    var infoWindow;
    var service;
    var filterType = [];
    var lastJson;
    var markers = [];
    var $helper_sideBar = $("._js_sideBar_toggle");
    var $filter_input = $("._js_filter-input");



    var addMarker = function(place) {

        var icon_prefix = "images/scb-";
        var icon_postfix = ".png";

        if (place.name.toLowerCase().indexOf("cdm") > -1) {
            icon = icon_prefix + "cdm" + icon_postfix;
        } else if (place.name.toLowerCase().indexOf("exchange") > -1) {
            icon = icon_prefix + "exchange" + icon_postfix;
        } else {
            if (place.types[0] == "atm")
                icon = icon_prefix + "atm" + icon_postfix;
            else
                icon = icon_prefix + "bank" + icon_postfix;
        }

        var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            icon: {
                url: icon,
                anchor: new google.maps.Point(10, 10),
                scaledSize: new google.maps.Size(30, 49)
            }
        });

        google.maps.event.addListener(marker, 'click', function() {
            service.getDetails(place, function(result, status) {
                if (status !== google.maps.places.PlacesServiceStatus.OK) {
                    console.error(status);
                    return;
                }
                infoWindow.setContent(result.name);
                infoWindow.open(map, marker);
            });
        });
        markers.push(marker);
    };

    var utils = {
        clearMarkers: function() {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }
            markers.length = 0;
        },
        performSearch: function(json) {
                var _this = this;
                json = json || lastJson;
                lastJson = json;
            if (lastJson.status.toLowerCase() == "ok") {
                if (filterType.length) {
                    var result = [];
                    var finalRes = [];
                    filterType.forEach(function(type) {
                        result = json["results"].filter(function(o) {
                            if (type == "cdm") {
                                return o.name.toLowerCase().indexOf("cdm") > -1;
                            } else if (type == "exchange") {
                                return o.name.toLowerCase().indexOf("exchange") > -1;
                            } else if (type == "atm" || type == "bank") {
                                return o.types[0] == type;
                            }
                        });
                        finalRes = finalRes.concat(result);
                    });
                    json = finalRes;
                } else {
                    json = json["results"];
                }

                for (var i = 0, result; result = json[i]; i++) {
                    addMarker(result);
                }
            } else console.warn(json.status);

        },
        getData: function(info, cb, searchData) {
            var _this = this;
            $.ajax({
                type: "post",
                url: "./datahelper/",
                data: {
                    data: JSON.stringify(info)
                },
                dataType: "JSON",
                success: function(json) {
                    cb(json)
                },
                error: function(err) {
                    console.log(err)
                }
            });
        },
        getLocation: function(cb) {
            var extras = {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            };

            var default_coords = {
                latitude: 13.7563,
                longitude: 100.5018
            };

            navigator.geolocation.getCurrentPosition(function(pos) {
                var coords = pos.coords;
                if (!coords) {
                    coords = default_coords
                }
                cb(coords)
            }, function(err) {
                console.log(err);
                cb(default_coords)
            }, extras);
        }
    };

    var init = function(coords) {

        map = new google.maps.Map(document.getElementById('mapview'), {
            center: {
                lat: coords.latitude,
                lng: coords.longitude
            },
            zoom: 12,
            zoomControl: true,
            mapTypeControl: false,
            scaleControl: true,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: true,
            styles: [{
                stylers: [{
                    visibility: 'simplified'
                }]
            }, {
                elementType: 'labels',
                stylers: [{
                    visibility: 'on'
                }]
            }]
        });

        infoWindow = new google.maps.InfoWindow();
        service = new google.maps.places.PlacesService(map);

        var info = {
            location: coords.latitude + "," + coords.longitude,
            lang: "en",
            pagetoken: ""
        };

        google.maps.event.addListener(map, "idle", function() {
            google.maps.event.trigger(map, 'resize');
        });
        utils.getData(info, utils.performSearch);

    };


    utils.getLocation(init); //init map after taking user location.


    //UI Controllers
    $helper_sideBar.on('click', function() {
        var $this = $(this);
        var $sideBar = $("#" + $this.attr('data-for'));
        $sideBar.add($this).toggleClass("active");
    });

    $(window).width() > 600 && $helper_sideBar.trigger("click");

    $filter_input.on('change', function() {
        utils.clearMarkers();

        var filter = $(this).val();
        var index = filterType.indexOf(filter);
        if (index == -1) {
            filterType.push(filter)
        } else {
            filterType.splice(index, 1);
        }
        utils.performSearch()

    });

});
