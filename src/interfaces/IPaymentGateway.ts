module BulbEnergy {
    'use strict';
    export interface IPaymentGateway {
        init() : void;
        authorizeCard(card:IPaymentCard): ng.IPromise<IAuthorizedCard>;

        isCardNumberValid(number:string):boolean;
        isCvcValid(cvc:string):boolean;
        isExpValid(exp_month:string, exp_year:string);

    }
}
