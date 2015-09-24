module BulbEnergy {
    'use strict';
    export interface IStatsService {
        track(stat:string):void;
        track(stat:string, data:any):void;
        register(properties:{[index:string]:any}):void;
    }
}
