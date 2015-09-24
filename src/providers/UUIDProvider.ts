module BulbEnergy {
    'use strict';

    export class UUIDProvider implements ng.IServiceProvider
    {
        private EXPIRATION = 7200000; //lets do two hours
        private FORMAT = 'xxxxxxxx-xxxx-4xxx-yxxx';

        private uuid:string;
        private storage:any;

        // Provider's factory function
        public $get(storage) : IUUIDService {
            this.uuid = this.warmup(storage);

            return {
                get: () => { return this.uuid; },
                prolong: () => { this.storage.set(this.uuid, this.calculateExpiration(new Date())); }
            };
        }

        constructor() {
            this.$get.$inject = ['storage'];
        }

        warmup($cookieService):string {
            var now = new Date(),
                uuid:string = null;
            this.storage = new UUIDStore(this.storage);

            if (this.storage.isValid(now)) {
                uuid = this.storage.load();
            } else {
                uuid = this.create(now);
                this.storage.set(uuid, this.calculateExpiration(now));
            }
            return uuid;
        }

        getUUID():string {
            return this.uuid;
        }

        private create(now:Date):string {
            var d = now.getTime();
            return this.FORMAT.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
            });
        }

        private calculateExpiration(now:Date) {
            var expiration = new Date();
            expiration.setTime(now.getTime() + this.EXPIRATION);
            return expiration;
        }

    }
}
