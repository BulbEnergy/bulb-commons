var BulbEnergy;
(function (BulbEnergy) {
    'use strict';
})(BulbEnergy || (BulbEnergy = {}));
var BulbEnergy;
(function (BulbEnergy) {
    'use strict';
})(BulbEnergy || (BulbEnergy = {}));
var BulbEnergy;
(function (BulbEnergy) {
    'use strict';
})(BulbEnergy || (BulbEnergy = {}));
var BulbEnergy;
(function (BulbEnergy) {
    'use strict';
})(BulbEnergy || (BulbEnergy = {}));
var BulbEnergy;
(function (BulbEnergy) {
    'use strict';
})(BulbEnergy || (BulbEnergy = {}));
var BulbEnergy;
(function (BulbEnergy) {
    'use strict';
})(BulbEnergy || (BulbEnergy = {}));
var BulbEnergy;
(function (BulbEnergy) {
    'use strict';
})(BulbEnergy || (BulbEnergy = {}));
var BulbEnergy;
(function (BulbEnergy) {
    'use strict';
})(BulbEnergy || (BulbEnergy = {}));
var BulbEnergy;
(function (BulbEnergy) {
    'use strict';
})(BulbEnergy || (BulbEnergy = {}));
var BulbEnergy;
(function (BulbEnergy) {
    'use strict';
})(BulbEnergy || (BulbEnergy = {}));
var BulbEnergy;
(function (BulbEnergy) {
    'use strict';
})(BulbEnergy || (BulbEnergy = {}));
var BulbEnergy;
(function (BulbEnergy) {
    'use strict';
})(BulbEnergy || (BulbEnergy = {}));
var BulbEnergy;
(function (BulbEnergy) {
    'use strict';
})(BulbEnergy || (BulbEnergy = {}));
var BulbEnergy;
(function (BulbEnergy) {
    'use strict';
})(BulbEnergy || (BulbEnergy = {}));
var BulbEnergy;
(function (BulbEnergy) {
    'use strict';
})(BulbEnergy || (BulbEnergy = {}));
var BulbEnergy;
(function (BulbEnergy) {
    'use strict';
    var UUIDStore = (function () {
        function UUIDStore(store) {
            this.store = store;
            this.KEY = 'bulb:uuid';
        }
        UUIDStore.prototype.isValid = function (now) {
            var data = this.store.get(this.KEY);
            if (data) {
                return now < new Date(data.expiration);
            }
            return null;
        };
        UUIDStore.prototype.load = function () {
            var data = this.store.get(this.KEY);
            if (data) {
                return data.uuid;
            }
            return null;
        };
        UUIDStore.prototype.set = function (uuid, expiration) {
            this.store.set(this.KEY, {
                'uuid': uuid,
                'expiration': expiration
            });
        };
        return UUIDStore;
    })();
    BulbEnergy.UUIDStore = UUIDStore;
})(BulbEnergy || (BulbEnergy = {}));
var BulbEnergy;
(function (BulbEnergy) {
    'use strict';
    var UUIDProvider = (function () {
        function UUIDProvider() {
            this.EXPIRATION = 7200000;
            this.FORMAT = 'xxxxxxxx-xxxx-4xxx-yxxx';
            this.$get.$inject = ['storage'];
        }
       
        UUIDProvider.prototype.$get = function (storage) {
            var _this = this;
            this.uuid = this.warmup(storage);
            return {
                get: function () { return _this.uuid; },
                prolong: function () { _this.storage.set(_this.uuid, _this.calculateExpiration(new Date())); }
            };
        };
        UUIDProvider.prototype.warmup = function ($cookieService) {
            var now = new Date(), uuid = null;
            this.storage = new BulbEnergy.UUIDStore(this.storage);
            if (this.storage.isValid(now)) {
                uuid = this.storage.load();
            }
            else {
                uuid = this.create(now);
                this.storage.set(uuid, this.calculateExpiration(now));
            }
            return uuid;
        };
        UUIDProvider.prototype.getUUID = function () {
            return this.uuid;
        };
        UUIDProvider.prototype.create = function (now) {
            var d = now.getTime();
            return this.FORMAT.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
            });
        };
        UUIDProvider.prototype.calculateExpiration = function (now) {
            var expiration = new Date();
            expiration.setTime(now.getTime() + this.EXPIRATION);
            return expiration;
        };
        return UUIDProvider;
    })();
    BulbEnergy.UUIDProvider = UUIDProvider;
})(BulbEnergy || (BulbEnergy = {}));
var BulbEnergy;
(function (BulbEnergy) {
    'use strict';
    var Auth0Service = (function () {
        function Auth0Service($q, $http, appConfig) {
            this.$q = $q;
            this.$http = $http;
            this.appConfig = appConfig;
        }
        Auth0Service.prototype.init = function () {
            this.authConfig = this.appConfig.getAuthConfig();
            this.auth = new Auth0(this.getClientOptions());
        };
        Auth0Service.prototype.createUsingFacebook = function () {
            var deferred = this.$q.defer();
            this.auth.loginWithPopup({
                connection: 'facebook',
                popup: true
            }, function (err, profile, id_token, access_token, state) {
                if (err) {
                    deferred.reject(err);
                }
                else {
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
        };
        Auth0Service.prototype.createUser = function (credentials) {
            var deferred = this.$q.defer();
            this.auth.signup({
                connection: this.authConfig.connection,
                username: credentials.email,
                password: credentials.password,
                auto_login: true,
                sso: false
            }, function (err, profile, id_token, access_token, state) {
                if (err) {
                    deferred.reject(err);
                }
                else {
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
        };
        Auth0Service.prototype.loginUser = function (credentials) {
            var deferred = this.$q.defer();
            this.auth.login({
                connection: this.authConfig.connection,
                username: credentials.email,
                password: credentials.password,
                auto_login: true,
                sso: false
            }, function (err, profile, id_token, access_token, state) {
                if (err) {
                    deferred.reject(err);
                }
                else {
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
        };
        Auth0Service.prototype.loginFacebookUser = function () {
            var deferred = this.$q.defer();
            this.auth.loginWithPopup({
                connection: 'facebook',
                auto_login: true,
                sso: true
            }, function (err, profile, id_token, access_token, state) {
                if (err) {
                    deferred.reject(err);
                }
                else {
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
        };
        Auth0Service.prototype.getClientOptions = function () {
            return {
                clientID: this.authConfig.client_id,
                domain: this.authConfig.domain,
                callbackURL: '',
                forceJSONP: true
            };
        };
        Auth0Service.$inject = ['$q', '$http', 'AppConfig'];
        return Auth0Service;
    })();
    BulbEnergy.Auth0Service = Auth0Service;
})(BulbEnergy || (BulbEnergy = {}));
var BulbEnergy;
(function (BulbEnergy) {
    'use strict';
    var StatsService = (function () {
        function StatsService(appConfig, $timeout) {
            this.appConfig = appConfig;
            this.$timeout = $timeout;
            this.initialized = false;
            this.properties = {};
        }
        StatsService.prototype.init = function () {
            mixpanel.init(this.appConfig.getMixpanelConfig().token);
            mixpanel.track('Application initialization');
            this.initialized = true;
        };
        StatsService.prototype.register = function (properties) {
            _.assign(this.properties, properties);
        };
        StatsService.prototype.track = function (stat, data) {
            if (data === void 0) { data = {}; }
            var options = this.properties, that = this;
            console.log('Tracking ' + stat + ' with data ', data);
            _.assign(options, data);
            if (!this.initialized) {
                console.log('Mixpanel is not initialized, delaying stats');
                return this.$timeout(function () {
                    that.track(stat, options);
                }, 500);
            }
            if (options) {
                mixpanel.track(stat, options);
            }
            else {
                mixpanel.track(stat);
            }
        };
        StatsService.$inject = ['AppConfig', '$timeout'];
        return StatsService;
    })();
    BulbEnergy.StatsService = StatsService;
})(BulbEnergy || (BulbEnergy = {}));
var BulbEnergy;
(function (BulbEnergy) {
    'use strict';
    var StripeService = (function () {
        function StripeService($q, appConfig) {
            this.$q = $q;
            this.appConfig = appConfig;
        }
        StripeService.prototype.init = function () {
            var stripeConfig = this.appConfig.getPaymentGatewayConfig();
            Stripe.setPublishableKey(stripeConfig.publishable_key);
        };
        StripeService.prototype.authorizeCard = function (card) {
            var deferred = this.$q.defer();
            Stripe.card.createToken({
                name: card.cardHolder,
                number: card.number,
                exp_month: card.expMonth,
                exp_year: card.expYear,
                cvc: card.cvc
            }, function (status, response) {
                if (response.error) {
                    deferred.reject({
                        'status': status,
                        'message': response.error.message
                    });
                }
                else {
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
        };
        StripeService.prototype.isCardNumberValid = function (number) {
            return Stripe.validateCardNumber(number);
        };
        StripeService.prototype.isCvcValid = function (cvc) {
            return Stripe.validateCVC(cvc);
        };
        StripeService.prototype.isExpValid = function (exp_month, exp_year) {
            return Stripe.validateExpiry(exp_month, exp_year);
        };
        StripeService.$inject = ['$q', 'AppConfig'];
        return StripeService;
    })();
    BulbEnergy.StripeService = StripeService;
})(BulbEnergy || (BulbEnergy = {}));
var BulbEnergy;
(function (BulbEnergy) {
    'use strict';
    var WebChatService = (function () {
        function WebChatService(appConfig) {
            this.appConfig = appConfig;
        }
        WebChatService.prototype.init = function () {
           
        };
        WebChatService.prototype.startChat = function (firstName, lastName, phone) {
            var chatConfig = this.initChatOptions(firstName, lastName, phone);
            ININ.webchat.create(chatConfig, function (err, webchat) {
                if (err) {
                    throw err;
                }
               
                webchat.renderPopup({
                    width: 400,
                    height: 400,
                    title: 'Chat'
                });
            });
        };
        WebChatService.prototype.initChatOptions = function (firstName, lastName, phone) {
            return {
                'webchatAppUrl': 'https://apps.inindca.com/webchat',
                'webchatServiceUrl': 'https://realtime.inindca.com:443',
                'orgId': 158,
                'orgName': 'Bulb',
                'languageSkill': 'English - Written',
                'skills': ['Bulb'],
                'priority': 0,
                'logLevel': 'DEBUG',
                'locale': 'en',
                'data': {
                    'firstName': firstName,
                    'lastName': lastName,
                    'phoneNumber': phone
                }
            };
        };
        WebChatService.$inject = ['AppConfig'];
        return WebChatService;
    })();
    BulbEnergy.WebChatService = WebChatService;
})(BulbEnergy || (BulbEnergy = {}));
var BulbEnergy;
(function (BulbEnergy) {
    'use strict';
    var StatsOn = (function () {
        function StatsOn(statsService) {
            this.restrict = 'A';
            this.replace = false;
            StatsOn.prototype.link = function (scope, element, attrs) {
                if (typeof attrs['statsOn'] == 'undefined')
                    return;
                element.on(attrs['statsOn'], function () {
                    var statName = typeof attrs['statsEvent'] != 'undefined' ? attrs['statsEvent'] : false;
                    if (statName == false) {
                        statName = 'User ' + attrs['statsOn'] + 'ed on "' + element.text() + '"';
                    }
                    var data = typeof attrs['statsData'] != 'undefined' ? JSON.parse(attrs['statsData']) : {};
                    statsService.track(statName, data);
                });
            };
        }
        StatsOn.Factory = function () {
            var directive = function (statsService) { return new StatsOn(statsService); };
            directive['$inject'] = ['StatsService'];
            return directive;
        };
        return StatsOn;
    })();
    BulbEnergy.StatsOn = StatsOn;
})(BulbEnergy || (BulbEnergy = {}));

var BulbEnergy;
(function (BulbEnergy) {
    'use strict';
    angular.module('bulb.commons', ['auth0', 'angular-storage', 'angular-jwt'])
        .provider('UUID', BulbEnergy.UUIDProvider)
        .service('AuthorizationGateway', BulbEnergy.Auth0Service)
        .service('PaymentGateway', BulbEnergy.StripeService)
        .service('WebChatService', BulbEnergy.WebChatService)
        .service('StatsService', BulbEnergy.StatsService)
        .directive('statsOn', BulbEnergy.StatsOn.Factory())
        .filter('titleCase', function () {
        return function (input) {
            return input ? input.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }) : '';
        };
    })
        .filter('roundValue', function ($filter) {
        return function (input) {
            if (isNaN(input))
                return input;
            return Math.round(input);
        };
    })
        .factory('naturalService', ['$locale', function ($locale) {
           
           
           
            var natCache = {};
           
            var padding = function (value) {
                return '00000000000000000000'.slice(value.length);
            };
           
            var natDateMonthFirst = $locale.DATETIME_FORMATS.shortDate.charAt(0) == 'm';
           
            var fixDates = function (value) {
               
                return value.replace(/(\d\d?)[-\/\.](\d\d?)[-\/\.](\d{4})/, function ($0, $m, $d, $y) {
                   
                    var t = $d;
                   
                    if (!natDateMonthFirst) {
                       
                        if (Number($d) < 13) {
                            $d = $m;
                            $m = t;
                        }
                    }
                    else if (Number($m) > 12) {
                       
                        $d = $m;
                        $m = t;
                    }
                   
                    return $y + '-' + $m + '-' + $d;
                });
            };
           
            var fixNumbers = function (value) {
               
                return value.replace(/(\d+)((\.\d+)+)?/g, function ($0, integer, decimal, $3) {
                   
                    if (decimal !== $3) {
                       
                       
                        return $0.replace(/(\d+)/g, function ($d) {
                            return padding($d) + $d;
                        });
                    }
                    else {
                       
                        decimal = decimal || '.0';
                        return padding(integer) + integer + decimal + padding(decimal);
                    }
                });
            };
           
            var natValue = function (value) {
                if (natCache[value]) {
                    return natCache[value];
                }
                var newValue = fixNumbers(fixDates(value));
                return natCache[value] = newValue;
            };
           
            return {
                naturalValue: natValue,
                naturalSort: function (a, b) {
                    a = natValue(a);
                    b = natValue(b);
                    return (a < b) ? -1 : ((a > b) ? 1 : 0);
                }
            };
        }])
        .constant('_', _);
})(BulbEnergy || (BulbEnergy = {}));
























