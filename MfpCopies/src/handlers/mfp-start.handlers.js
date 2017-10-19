'use strict';

const Alexa = require('alexa-sdk');
const MFP_STATES = require('../enums').MFP_STATES;

module.exports = Alexa.CreateStateHandler(MFP_STATES.STARTMODE, {
  'NewSession': function() {
    this.emit('NewSession'); // Uses the handler in newSessionHandlers
  },
  "GetCopies": function() {
    console.log('startHandlers GetCopies ' + JSON.stringify(this.event, null, '\t'));
    this.handler.state = MFP_STATES.COPIESMODE;
    this.emitWithState("GetCopies");
  },
  "ScanDocument": function() {
    console.log('startHandlers ScanDocument ' + JSON.stringify(this.event, null, '\t'));
    this.handler.state = MFP_STATES.SCANMODE;
    this.emitWithState("ScanDocument");
  },
  'AMAZON.HelpIntent': function() {
    const speechOutput = this.t('HELP_MESSAGE');
    const reprompt = this.t('HELP_MESSAGE');
    console.log('help' + JSON.stringify(this.event.request, null, '\t'));
    this.response.speak(speechOutput).listen(reprompt);
    this.emit(':responseReady');
  },
  'AMAZON.CancelIntent': function() {
    this.response.speak(this.t('STOP_MESSAGE'));
    this.emit(':responseReady');
  },
  'AMAZON.StopIntent': function() {
    this.response.speak(this.t('STOP_MESSAGE'));
    this.emit(':responseReady');
  },
  'SessionEndedRequest': function() {
    this.response.speak(this.t('STOP_MESSAGE'));
    this.emit(':responseReady');
  },
  'Unhandled': function() {
    const speechOutput = this.t('HELP_MESSAGE');
    const reprompt = this.t('HELP_MESSAGE');
    this.handler.state = MFP_STATES.STARTMODE;
    console.log('startHandlers Unhandled' + JSON.stringify(this.event.request, null, '\t'));
    this.response.speak(speechOutput).listen(reprompt);
    this.emit(':responseReady');
  }
});
