module BulbEnergy {
    'use strict';
    export class StatsOn implements ng.IDirective {
        public restrict: string = 'A';
        public replace: boolean = false;
        public link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => void;
        constructor(statsService:IStatsService) {
            StatsOn.prototype.link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
                if (typeof attrs['statsOn'] == 'undefined')
                    return;
                element.on(attrs['statsOn'], function () {
                    var statName = typeof attrs['statsEvent'] != 'undefined' ? attrs['statsEvent'] : false;
                    if (statName == false) {
                        statName = 'User ' + attrs['statsOn'] + 'ed on "' + element.text() + '"';
                    }
                    var data = typeof attrs['statsData'] != 'undefined' ? JSON.parse(attrs['statsData']) : {};
                    statsService.track(statName, data);
                });
            };
        }
        public static Factory(): ng.IDirectiveFactory {
            var directive: ng.IDirectiveFactory =
                (statsService:IStatsService) => new StatsOn(statsService);
            directive['$inject'] = ['StatsService'];

            return directive;
        }
    }
}
