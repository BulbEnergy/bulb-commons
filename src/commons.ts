/// <reference path='_all.ts'/>
/**
 * BulbEnergy Angular Commons module
 *
 * @type {angular.Module}
 */
module BulbEnergy {
    'use strict';

    angular.module('bulb.commons', [])
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
    }).constant('_', _);
}
