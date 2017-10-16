/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/

'use strict';

const Alexa = require('alexa-sdk');
const newSessionHandlers = require('./handlers/new-session.handlers');
const startHandlers = require('./handlers/mfp-start.handlers');
const copiesHandlers = require('./handlers/copies.handlers');
const scanHandler = require ('./handlers/scan.handlers');

const APP_ID = ""; // TODO replace with your app ID (OPTIONAL).

const languageStrings = {
  'en-US': {
    translation: {
      SKILL_NAME: 'MFP Copies',
      GET_FACT_MESSAGE: "Here's an interesting one: ",
      HELP_MESSAGE: 'You can say make copies or, you can say exit... What can I help you with?',
      HELP_REPROMPT: 'What can I help you with?',
      STOP_MESSAGE: 'Goodbye!',
      LAUNCH_MESSAGE: 'Welcome to Sharp MFP. I can get you copies and scan documents',
      LAUNCH_MESSAGE_REPROMPT: 'Try asking me to make copies or perform scan.'
    },
  }
};


exports.handler = (event, context) => {
  const alexa = Alexa.handler(event, context);
  alexa.appId = = event.session.application.applicationId;;
  // To enable string internationalization (i18n) features, set a resources object.
  alexa.resources = languageStrings;
  alexa.registerHandlers(newSessionHandlers, startHandlers, copiesHandlers, scanHandler);
  alexa.execute();
};
