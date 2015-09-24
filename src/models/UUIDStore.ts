module BulbEnergy {
    'use strict';

    export class UUIDStore {
        private KEY = 'bulb:uuid';
        constructor(private store:any) {}

        isValid(now:Date):boolean {
            var data:{uuid:string, expiration:string} = this.store.get(this.KEY);
            if (data) {
                return now < new Date(data.expiration);
            }
            return null;
        }

        load():string {
            var data:{uuid:string, expiration:string} = this.store.get(this.KEY);
            if (data) {
                return data.uuid;
            }
            return null;
        }

        set(uuid:string, expiration:Date) {
            this.store.set(this.KEY, {
                'uuid': uuid,
                'expiration': expiration
            });
        }
    }
}
