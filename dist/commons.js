

var BulbCommons;
(function (BulbCommons) {
    'use strict';
    angular.module('bulb.commons', [])
        .filter('titleCase', function () {
        return function (input) {
            return input ? input.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }) : '';
        };
    })
        .filter('roundValue', function ($filter) {
        return function (input) {
            if (isNaN(input))
                return input;
            return Math.round(input);
        };
    })
        .factory('naturalService', ['$locale', function ($locale) {
           
           
           
            var natCache = {};
           
            var padding = function (value) {
                return '00000000000000000000'.slice(value.length);
            };
           
            var natDateMonthFirst = $locale.DATETIME_FORMATS.shortDate.charAt(0) == 'm';
           
            var fixDates = function (value) {
               
                return value.replace(/(\d\d?)[-\/\.](\d\d?)[-\/\.](\d{4})/, function ($0, $m, $d, $y) {
                   
                    var t = $d;
                   
                    if (!natDateMonthFirst) {
                       
                        if (Number($d) < 13) {
                            $d = $m;
                            $m = t;
                        }
                    }
                    else if (Number($m) > 12) {
                       
                        $d = $m;
                        $m = t;
                    }
                   
                    return $y + '-' + $m + '-' + $d;
                });
            };
           
            var fixNumbers = function (value) {
               
                return value.replace(/(\d+)((\.\d+)+)?/g, function ($0, integer, decimal, $3) {
                   
                    if (decimal !== $3) {
                       
                       
                        return $0.replace(/(\d+)/g, function ($d) {
                            return padding($d) + $d;
                        });
                    }
                    else {
                       
                        decimal = decimal || '.0';
                        return padding(integer) + integer + decimal + padding(decimal);
                    }
                });
            };
           
            var natValue = function (value) {
                if (natCache[value]) {
                    return natCache[value];
                }
                var newValue = fixNumbers(fixDates(value));
                return natCache[value] = newValue;
            };
           
            return {
                naturalValue: natValue,
                naturalSort: function (a, b) {
                    a = natValue(a);
                    b = natValue(b);
                    return (a < b) ? -1 : ((a > b) ? 1 : 0);
                }
            };
        }])
        .constant('_', _);
})(BulbCommons || (BulbCommons = {}));
