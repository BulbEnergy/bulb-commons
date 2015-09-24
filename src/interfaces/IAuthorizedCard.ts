module BulbEnergy {
    'use strict';
    export interface IAuthorizedCard {
        expMonth : number;
        expYear: number;
        last4: number;
        token: string;
        funding: string;
    }
}
