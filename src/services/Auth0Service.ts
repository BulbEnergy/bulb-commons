module BulbEnergy {
    'use strict';

    export class Auth0Service implements IAuthorizationGateway
    {
        public static $inject:Array<string> = ['$q', '$http', 'AppConfig'];

        private auth: Auth0Static;
        private authConfig: BulbEnergy.IAuthConfig;

        constructor(private $q: ng.IQService, private $http: ng.IHttpService, private appConfig: IAppConfig) {
        }

        public init() {
            this.authConfig = this.appConfig.getAuthConfig();
            this.auth = new Auth0(this.getClientOptions());
        }

        public createUsingFacebook():ng.IPromise<BulbEnergy.IAuthorizedAccount> {
            var deferred:ng.IDeferred<any> = this.$q.defer();

            this.auth.loginWithPopup({
                connection: 'facebook',
                popup: true
            }, function(err, profile, id_token, access_token, state) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve({
                        profile: profile,
                        id: id_token,
                        access_token: access_token,
                        state: state,
                        email: profile.email
                    });
                }
            });

            return deferred.promise;
        }

        public createUser(credentials:BulbEnergy.IAuthorizationCredentials):ng.IPromise<BulbEnergy.IAuthorizedAccount> {
            var deferred:ng.IDeferred<any> = this.$q.defer();

            this.auth.signup({
                connection: this.authConfig.connection,
                username: credentials.email,
                password: credentials.password,
                auto_login: true,
                sso: false
            }, function(err, profile, id_token, access_token, state) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve({
                        profile: profile,
                        id: id_token,
                        access_token: access_token,
                        state: state,
                        email: profile.email
                    });
                }
            });

            return deferred.promise;
        }
        public loginUser(credentials:BulbEnergy.IAuthorizationCredentials):ng.IPromise<BulbEnergy.IAuthorizedAccount> {
            var deferred:ng.IDeferred<any> = this.$q.defer();

            this.auth.login({
                connection: this.authConfig.connection,
                username: credentials.email,
                password: credentials.password,
                auto_login: true,
                sso: false
            }, function(err, profile, id_token, access_token, state) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve({
                        profile: profile,
                        id_token: id_token,
                        access_token: access_token,
                        state: state,
                        email: profile.email
                    });
                }
            });

            return deferred.promise;
        }
        public loginFacebookUser() {
            var deferred:ng.IDeferred<any> = this.$q.defer();
            this.auth.loginWithPopup({
                connection: 'facebook',
                auto_login: true,
                sso: true
            }, function(err, profile, id_token, access_token, state) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve({
                        profile: profile,
                        id_token: id_token,
                        access_token: access_token,
                        state: state,
                        email: profile.email
                    });
                }
            });
            return deferred.promise;
        }
        private  getClientOptions():Auth0ClientOptions {
            return {
                clientID: this.authConfig.client_id,
                domain: this.authConfig.domain,
                callbackURL: '',
                forceJSONP: true
            };
        }
    }
}
