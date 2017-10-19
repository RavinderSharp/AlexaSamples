'use strict';

const MFP_STATES = require('../enums').MFP_STATES;

module.exports = {
  'NewSession': function() {
    var copy = {
      "copies": "1",
      "colour": "colour",
      "side": "two",
      "staple": "stapled"
    };
    this.attributes['copy'] = copy;
    this.handler.state = MFP_STATES.STARTMODE;
    const speechOutput = this.t('LAUNCH_MESSAGE');
    const repromptOutput = this.t('LAUNCH_MESSAGE_REPROMPT');
    this.response.speak(speechOutput).listen(repromptOutput);
    this.emit(':responseReady');
  },
  "GetCopies": function() {
    console.log('newSessionHandlers GetCopies ' + JSON.stringify(this.event, null, '\t'));
    this.handler.state = MFP_STATES.COPIESMODE;
    this.emitWithState("GetCopies");
  },
  "ScanDocument": function() {
    console.log('newSessionHandlers ScanDocument ' + JSON.stringify(this.event, null, '\t'));
    this.handler.state = MFP_STATES.SCANMODE;
    this.emitWithState("ScanDocument");
  },
  "AMAZON.StopIntent": function() {
    this.response.speak("Goodbye!");
    this.emit(':responseReady');
  },
  "AMAZON.CancelIntent": function() {
    this.response.speak("Goodbye!");
    this.emit(':responseReady');
  },
  'SessionEndedRequest': function() {
    console.log('session ended!');
    this.response.speak("Goodbye!");
    this.emit(':responseReady');
  },
  'Unhandled': function() {
    const speechOutput = this.t('HELP_MESSAGE');
    const reprompt = this.t('HELP_MESSAGE');
    this.handler.state = MFP_STATES.STARTMODE;
    console.log('newSessionHandlers Unhandled' + JSON.stringify(this.event.request, null, '\t'));
    this.response.speak(speechOutput).listen(reprompt);
    this.emit(':responseReady');
  }
};
