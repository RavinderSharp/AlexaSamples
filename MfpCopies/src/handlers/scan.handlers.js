'use strict';

const Alexa = require('alexa-sdk');
const MFP_STATES = require('../enums').MFP_STATES;

module.exports = Alexa.CreateStateHandler(MFP_STATES.SCANMODE, {
  'NewSession': function() {
    console.log('scanHandler NewSession ' + JSON.stringify(this.event, null, '\t'));
    this.emit('NewSession'); // Uses the handler in newSessionHandlers
  },
  'ScanDocument': function() {
    // Use this.t() to get corresponding language data
    console.log('scanHandler ScanDocument' + JSON.stringify(this.event, null, '\t'));

    // set state to asking questions
    this.handler.state = MFP_STATES.STARTMODE;

    const speechOutput = 'scan completed' + this.t('HELP_MESSAGE');;
    const reprompt = this.t('HELP_MESSAGE');
    this.response.speak(speechOutput).listen(reprompt);
    this.emit(':responseReady');
  },
  'AMAZON.HelpIntent': function() {
    const speechOutput = this.t('HELP_MESSAGE');
    const reprompt = this.t('HELP_MESSAGE');
    console.log('scanHandler HelpIntent' + JSON.stringify(this.event, null, '\t'));
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
    console.log('scanHandler Unhandled' + +JSON.stringify(this.event, null, '\t'));
    this.response.speak(speechOutput).listen(reprompt);
    this.emit(':responseReady');
  }
});