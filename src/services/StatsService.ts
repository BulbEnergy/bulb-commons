module BulbEnergy {
    'use strict';

    export class StatsService implements IStatsService {
        public static $inject:Array<string> = ['AppConfig', '$timeout'];
        private initialized = false;
        private properties:{[index:string]:any} = {};

        constructor(private appConfig:IAppConfig, private $timeout:ng.ITimeoutService) {}

        init() {
            mixpanel.init(this.appConfig.getMixpanelConfig().token);
            mixpanel.track('Application initialization');
            this.initialized = true;
        }

        register(properties:{[index:string]:any}) {
            _.assign(this.properties, properties);
        }

        track(stat:string, data:any={}) {
            var options = this.properties,
                that = this;
            console.log('Tracking ' + stat + ' with data ', data);
            _.assign(options, data);

            if (!this.initialized) {
                console.log('Mixpanel is not initialized, delaying stats');
                return this.$timeout(function() {
                    that.track(stat, options);
                }, 500);
            }
            if (options) {
                mixpanel.track(stat, options);
            } else {
                mixpanel.track(stat);
            }
        }

    }
}
