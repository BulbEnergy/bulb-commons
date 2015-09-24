module BulbEnergy {
    'use strict';
    export interface IPaymentCard {
        cardHolder: string;
        number: string;
        cvc: string;
        expMonth: number;
        expYear: number;
    }
}
