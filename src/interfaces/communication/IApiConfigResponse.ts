module BulbEnergy {
    'use strict';
    export interface IApiConfigResponse  {
        config : IApiConfigParamsResponse;
        links : Array<IApiLink>;
    }
}
