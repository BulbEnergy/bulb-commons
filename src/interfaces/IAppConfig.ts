module BulbEnergy {
    'use strict';
    export interface IAppConfig {
        getAuthConfig():IAuthConfig;
        getMixpanelConfig():IMixpanelConfig;
        getPaymentGatewayConfig():IStripeClientConfig;
    }
}
