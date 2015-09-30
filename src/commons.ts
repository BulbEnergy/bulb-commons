/// <reference path='_all.ts'/>
/**
 * BulbEnergy Angular Commons module
 *
 * @type {angular.Module}
 */
module BulbEnergy {
    'use strict';

    angular.module('bulb.commons', ['auth0', 'angular-storage', 'angular-jwt'])
        .provider('UUID', UUIDProvider)
        .service('AuthorizationGateway', Auth0Service)
        .service('PaymentGateway', StripeService)
        .service('WebChatService', WebChatService)
        .service('StatsService', StatsService)
        .directive('statsOn', StatsOn.Factory())
        .filter('titleCase', function(){
            return function(input) {
                return input ? input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
            };
        })
        .filter('roundValue', function ($filter) {
            return function (input) {
                if (isNaN(input)) return input;
                return Math.round(input);
            };
        })
        // The core natural service
        .factory('naturalService', ['$locale', function($locale) {
            // the cache prevents re-creating the values every time, at the expense of
            // storing the results forever. Not recommended for highly changing data
            // on long-term applications.
            var natCache = {};
            // amount of extra zeros to padd for sorting
            var padding = function(value) {
                return '00000000000000000000'.slice(value.length);
            };

            // Calculate the default out-of-order date format (d/m/yyyy vs m/d/yyyy)
            var natDateMonthFirst = $locale.DATETIME_FORMATS.shortDate.charAt(0) == 'm';
            // Replaces all suspected dates with a standardized yyyy-m-d, which is fixed below
            var fixDates = function(value) {
                // first look for dd?-dd?-dddd, where "-" can be one of "-", "/", or "."
                return value.replace(/(\d\d?)[-\/\.](\d\d?)[-\/\.](\d{4})/, function($0, $m, $d, $y) {
                    // temporary holder for swapping below
                    var t = $d;
                    // if the month is not first, we'll swap month and day...
                    if(!natDateMonthFirst) {
                        // ...but only if the day value is under 13.
                        if(Number($d) < 13) {
                            $d = $m;
                            $m = t;
                        }
                    } else if(Number($m) > 12) {
                        // Otherwise, we might still swap the values if the month value is currently over 12.
                        $d = $m;
                        $m = t;
                    }
                    // return a standardized format.
                    return $y+'-'+$m+'-'+$d;
                });
            };

            // Fix numbers to be correctly padded
            var fixNumbers = function(value) {
                // First, look for anything in the form of d.d or d.d.d...
                return value.replace(/(\d+)((\.\d+)+)?/g, function ($0, integer, decimal, $3) {
                    // If there's more than 2 sets of numbers...
                    if (decimal !== $3) {
                        // treat as a series of integers, like versioning,
                        // rather than a decimal
                        return $0.replace(/(\d+)/g, function ($d) {
                            return padding($d) + $d;
                        });
                    } else {
                        // add a decimal if necessary to ensure decimal sorting
                        decimal = decimal || '.0';
                        return padding(integer) + integer + decimal + padding(decimal);
                    }
                });
            };

            // Finally, this function puts it all together.
            var natValue = function (value) {
                if(natCache[value]) {
                    return natCache[value];
                }
                var newValue = fixNumbers(fixDates(value));
                return natCache[value] = newValue;
            };

            // The actual object used by this service
            return {
                naturalValue: natValue,
                naturalSort: function(a, b) {
                    a = natValue(a);
                    b = natValue(b);
                    return (a < b) ? -1 : ((a > b) ? 1 : 0);
                }
            };
        }])
        .constant('_', _);
}
