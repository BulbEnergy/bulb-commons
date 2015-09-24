module BulbEnergy {
    'use strict';

    export class StripeService implements IPaymentGateway
    {
        public static $inject:Array<string> = ['$q', 'AppConfig'];

        constructor(private $q: ng.IQService, private appConfig: IAppConfig) {
        }

        public init() {
            var stripeConfig = this.appConfig.getPaymentGatewayConfig();
            Stripe.setPublishableKey(stripeConfig.publishable_key);
        }

        public authorizeCard(card:BulbEnergy.IPaymentCard):ng.IPromise<BulbEnergy.IAuthorizedCard> {
            var deferred:ng.IDeferred<any> = this.$q.defer();

            Stripe.card.createToken({
                name: card.cardHolder,
                number: card.number,
                exp_month: card.expMonth,
                exp_year: card.expYear,
                cvc: card.cvc
            }, function(status:number, response:StripeTokenResponse){
                if (response.error) {
                    deferred.reject({
                        'status' : status,
                        'message' : response.error.message
                    });
                } else {
                    deferred.resolve({
                        expMonth: response.card.exp_month,
                        expYear: response.card.exp_year,
                        last4: response.card.last4,
                        token: response.id,
                        funding: response.card.funding
                    });
                }
            });

            return deferred.promise;
        }

        public isCardNumberValid(number:string):boolean {
            return Stripe.validateCardNumber(number);
        }

        isCvcValid(cvc:string):boolean {
            return Stripe.validateCVC(cvc);
        }

        isExpValid(exp_month:string, exp_year: string) {
            return Stripe.validateExpiry(exp_month, exp_year);
        }

    }
}
