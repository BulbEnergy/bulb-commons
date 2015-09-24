module BulbEnergy {
    'use strict';
    export interface IApiConfigParamsResponse  {
        stripe : IStripeClientConfig;
        auth0: IAuthConfig;
        mixpanel: IMixpanelConfig;
        topDomain: string;
        facebookId: string;
    }
}
