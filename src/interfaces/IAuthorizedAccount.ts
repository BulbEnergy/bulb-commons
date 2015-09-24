module BulbEnergy {
    'use strict';
    export interface IAuthorizedAccount {
        email: string;
        state: string;

        profile?: Auth0UserProfile;
        id_token: string;
        access_token?: any;
        partnershipCode ?: string;
    }
}
