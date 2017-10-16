'use strict';

const Alexa = require('alexa-sdk');
const MFP_STATES = require('../enums').MFP_STATES;
var copyproperties = require('../copy.properties').copyProperties;


function removeSSML(s) {
  return s.replace(/<\/?[^>]+(>|$)/g, "");
};

module.exports = Alexa.CreateStateHandler(MFP_STATES.COPIESMODE, {
  'NewSession': function() {
    this.emit('NewSession'); // Uses the handler in newSessionHandlers
  },
  'GetCopies': function() {
    // Use this.t() to get corresponding language data
    console.log('GetCopies ' + JSON.stringify(this.event, null, '\t'));

    // set state to asking questions
    this.handler.state = MFP_STATES.COPIESMODE;
    if (this.event.request.dialogState === "STARTED") {

      var updatedIntent = this.event.request.intent;

      if (this.event.request.intent.slots.side != null &&
        this.event.request.intent.slots.side.value == undefined) {
        updatedIntent.slots.side.value = copyproperties.side;
      }

      if (this.event.request.intent.slots.colour != null &&
        this.event.request.intent.slots.colour.value == undefined) {
        updatedIntent.slots.colour.value = copyproperties.colour;
      }

      if (this.event.request.intent.slots.staple != null &&
        this.event.request.intent.slots.staple.value == undefined) {
        updatedIntent.slots.staple.value = copyproperties.staple;
      }

      if (this.event.request.intent.slots.copies != null &&
        this.event.request.intent.slots.copies.value == undefined) {
        updatedIntent.slots.copies.value = copyproperties.copies;
      }

      this.emit(":delegate", updatedIntent);
    } else if (this.event.request.dialogState == "IN_PROGRESS") {
      this.emit(":delegate");
    } else if (this.event.request.intent.confirmationStatus === 'DENIED') {
      if (this.event.request.intent.slots.side != null &&
        this.event.request.intent.slots.side.value == undefined) {
        copyproperties.side = this.event.request.intent.slots.side.value.toLowerCase();
      }

      if (this.event.request.intent.slots.colour != null &&
        this.event.request.intent.slots.colour.value == undefined) {
        copyproperties.colour = this.event.request.intent.slots.colour.value.toLowerCase();
      }

      if (this.event.request.intent.slots.staple != null &&
        this.event.request.intent.slots.staple.value == undefined) {
        copyproperties.staple = this.event.request.intent.slots.staple.value.toLowerCase();
      }

      const slotToElicit = 'copies'
      const speechOutput = 'Which setting you wish to update?';
      const repromptSpeech = 'say set with property name'
      return this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech)

    } else if (this.event.request.dialogState == "COMPLETED") {
      if (this.event.request.intent.confirmationStatus === 'CONFIRMED') {
        let speechOutput = "Slots Completed";
        console.log('GetCopies slot completed ' + JSON.stringify(this.event, null, '\t'));

        speechOutput = "Making " + copyproperties.side + "  sided ";
        speechOutput += copyproperties.colour + " ";
        speechOutput += copyproperties.copies + " copies ";
        speechOutput += copyproperties.staple;

        // Create speech output
        this.response.cardRenderer(this.t('SKILL_NAME'), removeSSML(speechOutput));
        this.response.speak(speechOutput);
        this.emit(':responseReady');
      }
    }
  }, //GetCopies intent
  'AMAZON.HelpIntent': function() {
    const speechOutput = this.t('HELP_MESSAGE');
    const reprompt = this.t('HELP_MESSAGE');
    console.log('copiesHandlers HelpIntent' + JSON.stringify(this.event.request, null, '\t'));
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
    console.log('copiesHandlers Unhandled' + JSON.stringify(this.event.request, null, '\t'));
    this.response.speak(speechOutput).listen(reprompt);
    this.emit(':responseReady');
  }
});
