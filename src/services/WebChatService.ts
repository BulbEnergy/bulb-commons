module BulbEnergy {
    'use strict';

    interface ININStatic {
        webchat: {
            create(config:any, callback:any);
        };
    }
    declare var ININ: ININStatic;

    export class WebChatService {
        public static $inject:Array<string> = ['AppConfig'];

        constructor(private appConfig:IAppConfig) {}

        init() {
            //load extra things from backend, TODO
        }

        startChat(firstName, lastName, phone) {
            var chatConfig = this.initChatOptions(firstName, lastName, phone);
            ININ.webchat.create(chatConfig, function (err, webchat) {
                if (err) {
                    throw err;
                }
                // OR, render to popup
                webchat.renderPopup({
                    width: 400,
                    height: 400,
                    title: 'Chat'
                });
            });
        }

        initChatOptions(firstName, lastName, phone):any {
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
        }
    }
}
