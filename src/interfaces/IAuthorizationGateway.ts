module BulbEnergy {
    'use strict';
    export interface IAuthorizationGateway {
        init(): void;
        createUser(credentials:IAuthorizationCredentials):ng.IPromise<IAuthorizedAccount>;
        loginUser(credentials:IAuthorizationCredentials):ng.IPromise<IAuthorizedAccount>;
        createUsingFacebook():ng.IPromise<IAuthorizedAccount>;
    }
}
