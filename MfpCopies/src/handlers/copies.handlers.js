'use strict';

const Alexa = require('alexa-sdk');
const MFP_STATES = require('../enums').MFP_STATES;

function removeSSML(s) {
  return s.replace(/<\/?[^>]+(>|$)/g, "");
};

module.exports = Alexa.CreateStateHandler(MFP_STATES.COPIESMODE, {
  'NewSession': function() {
    var copy = {
      "copies": "1",
      "colour": "colour",
      "side": "two",
      "staple": "stapled"
    };
    this.attributes['copy'] = copy;
    this.emit('NewSession'); // Uses the handler in newSessionHandlers
  },
  'GetCopies': function() {

    // set state to asking questions
    this.handler.state = MFP_STATES.COPIESMODE;

    console.log('GetCopies ' + JSON.stringify(this.event, null, '\t'));
    if (this.event.request.dialogState === "STARTED") {

      var updatedIntent = this.event.request.intent;

      if (this.event.request.intent.slots.side != null &&
        this.event.request.intent.slots.side.value == undefined) {
        updatedIntent.slots.side.value = this.event.session.attributes['copy'].side;
      }

      if (this.event.request.intent.slots.colour != null &&
        this.event.request.intent.slots.colour.value == undefined) {
        updatedIntent.slots.colour.value = this.event.session.attributes['copy'].colour;
      }

      if (this.event.request.intent.slots.staple != null &&
        this.event.request.intent.slots.staple.value == undefined) {
        updatedIntent.slots.staple.value = this.event.session.attributes['copy'].staple;
      }

      if (this.event.request.intent.slots.copies != null &&
        this.event.request.intent.slots.copies.value == undefined) {
        updatedIntent.slots.copies.value = this.event.session.attributes['copy'].copies;
      }

      this.emit(":delegate", updatedIntent);
    } else if (this.event.request.dialogState == "IN_PROGRESS") {
      this.emit(":delegate");
    } else if (this.event.request.intent.confirmationStatus === 'DENIED') {
      if (this.event.request.intent.slots.side != null &&
        this.event.request.intent.slots.side.value != undefined) {
        this.event.session.attributes['copy'].side = this.event.request.intent.slots.side.value.toLowerCase();
      }

      if (this.event.request.intent.slots.colour != null &&
        this.event.request.intent.slots.colour.value != undefined) {
        this.event.session.attributes['copy'].colour = this.event.request.intent.slots.colour.value.toLowerCase();
      }

      if (this.event.request.intent.slots.staple != null &&
        this.event.request.intent.slots.staple.value != undefined) {
        this.event.session.attributes['copy'].staple = this.event.request.intent.slots.staple.value.toLowerCase();
      }

      if (this.event.request.intent.slots.copies != null &&
        this.event.request.intent.slots.copies.value != undefined) {
        this.event.session.attributes['copy'].copies = this.event.request.intent.slots.copies.value.toLowerCase();
      }

      console.log('GetCopies Deny' + JSON.stringify(this.event, null, '\t'));
      const slotToElicit = 'copies'
      const speechOutput = 'Which setting you wish to update?';
      const repromptSpeech = 'say set with property name'
      return this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech)

    } else if (this.event.request.dialogState == "COMPLETED") {
      if (this.event.request.intent.confirmationStatus === 'CONFIRMED') {
        let speechOutput = "Slots Completed";
        console.log('GetCopies slot completed ' + JSON.stringify(this.event, null, '\t'));

        speechOutput = "Making " + this.event.request.intent.slots.side.value.toLowerCase() + "  sided ";
        speechOutput += this.event.request.intent.slots.colour.value.toLowerCase() + " ";
        speechOutput += this.event.request.intent.slots.copies.value.toLowerCase() + " copies ";
        speechOutput += this.event.request.intent.slots.staple.value.toLowerCase();

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
