/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/

'use strict';

const Alexa = require('alexa-sdk');

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

var states = {
  STARTMODE: '_STARTMODE',
  COPIESMODE: '_COPIESMODE', // Alexa is asking user the questions.
  SCANMODE: '_SCANMODE' // Alexa is describing the final choice and prompting to start again or quit
};


var newSessionHandlers = {
  'NewSession': function() {
    this.handler.state = states.STARTMODE;
    const speechOutput = this.t('LAUNCH_MESSAGE');
    const repromptOutput = this.t('LAUNCH_MESSAGE_REPROMPT');
    this.response.speak(speechOutput).listen(repromptOutput);
    this.emit(':responseReady');
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
    this.handler.state = states.STARTMODE;
    console.log('newSessionHandlers Unhandled' + JSON.stringify(this.event.request, null, '\t'));
    this.response.speak(speechOutput).listen(reprompt);
    this.emit(':responseReady');
  }
};

var startHandlers = Alexa.CreateStateHandler(states.STARTMODE, {
  'NewSession': function() {
    this.emit('NewSession'); // Uses the handler in newSessionHandlers
  },
  "GetCopies": function() {
    this.handler.state = states.COPIESMODE;
    this.emitWithState("GetCopies");
  },
  "ScanDocument": function() {
    this.handler.state = states.SCANMODE;
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
    this.handler.state = states.STARTMODE;
    console.log('startHandlers Unhandled' + JSON.stringify(this.event.request, null, '\t'));
    this.response.speak(speechOutput).listen(reprompt);
    this.emit(':responseReady');
  }
});

function removeSSML(s) {
  return s.replace(/<\/?[^>]+(>|$)/g, "");
};

var copies = 1;
var side = 'two';
var colour = 'colour';
var staple = 'stapled';

var copiesHandlers = Alexa.CreateStateHandler(states.COPIESMODE, {
  'NewSession': function() {
    this.emit('NewSession'); // Uses the handler in newSessionHandlers
  },
  'GetCopies': function() {
    // Use this.t() to get corresponding language data
    console.log('GetCopies ' + JSON.stringify(this.event.request, null, '\t'));

    // set state to asking questions
    this.handler.state = states.COPIESMODE;
    if (this.event.request.dialogState === "STARTED") {

      var updatedIntent = this.event.request.intent;
      //optionally pre-fill slots: update the intent object with slot values for which
      //you have defaults, then return Dialog.Delegate with this updated intent
      // in the updatedIntent property
      if (this.event.request.intent.slots.side != null &&
        this.event.request.intent.slots.side.value == undefined) {
        updatedIntent.slots.side.value = side;
      }

      if (this.event.request.intent.slots.colour != null &&
        this.event.request.intent.slots.colour.value == undefined) {
        updatedIntent.slots.colour.value = colour;
      }

      if (this.event.request.intent.slots.staple != null &&
        this.event.request.intent.slots.staple.value == undefined) {
        updatedIntent.slots.staple.value = staple;
      }

      if (this.event.request.intent.slots.copies != null &&
        this.event.request.intent.slots.copies.value == undefined) {
        updatedIntent.slots.copies.value = copies;
      }

      this.emit(":delegate", updatedIntent);
    } else if (this.event.request.dialogState == "IN_PROGRESS") {
        this.emit(":delegate");
    } else if (this.event.request.intent.confirmationStatus === 'DENIED') {
      if (this.event.request.intent.slots.side != null &&
        this.event.request.intent.slots.side.value == undefined) {
        side = this.event.request.intent.slots.side.value.toLowerCase();
      }

      if (this.event.request.intent.slots.colour != null &&
        this.event.request.intent.slots.colour.value == undefined) {
        colour = this.event.request.intent.slots.colour.value.toLowerCase();
      }

      if (this.event.request.intent.slots.staple != null &&
        this.event.request.intent.slots.staple.value == undefined) {
        staple = this.event.request.intent.slots.staple.value.toLowerCase();
      }

      const slotToElicit = 'copies'
      const speechOutput = 'Which setting you wish to update?';
      const repromptSpeech = 'say set with property name'
      return this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech)

    } else if (this.event.request.dialogState == "COMPLETED") {
      if (this.event.request.intent.confirmationStatus === 'CONFIRMED') {
        let speechOutput = "Slots Completed";
        console.log('GetCopies slot completed ' + JSON.stringify(this.event, null, '\t'));

        speechOutput = "Making "+ side +"  sided ";
        speechOutput += colour + " ";
        speechOutput += copies + " copies ";
        speechOutput += staple;

        // Create speech output
        this.response.cardRenderer(this.t('SKILL_NAME'), removeSSML(speechOutput));
        this.response.speak(speechOutput);
        this.emit(':responseReady');
      }
    }
  }, //GetCopies intent
  // 'ModifyCopies': function() {
  //
  //   // set state to asking questions
  //   this.handler.state = states.COPIESMODE;
  //
  //   console.log('ModifyCopies' + JSON.stringify(this.event.request, null, '\t'));
  //
  //   let speechOutput = "Updated "
  //   var updatedIntent = this.event.request.intent;
  //   updatedIntent.name = 'GetCopies';
  //   if (this.event.request.intent.slots.side != null &&
  //     this.event.request.intent.slots.side.value != undefined) {
  //     side = this.event.request.intent.slots.side.value.toLowerCase();
  //     speechOutput += side + " sided ";
  //     updatedIntent.slots.side.value = updatedIntent.slots.side.value = side;
  //   }
  //
  //   if (this.event.request.intent.slots.colour != null &&
  //     this.event.request.intent.slots.colour.value != undefined) {
  //     colour = this.event.request.intent.slots.colour.value.toLowerCase();
  //     speechOutput += colour + " copy ";
  //     updatedIntent.slots.colour.value = colour;
  //    }
  //
  //   if (this.event.request.intent.slots.staple != null &&
  //     this.event.request.intent.slots.staple.value != undefined) {
  //     staple = this.event.request.intent.slots.staple.value.toLowerCase();
  //     speechOutput += staple;
  //     updatedIntent.slots.staple.value = staple;
  //   }
  //
  //   if (this.event.request.intent.slots.copies != null &&
  //     this.event.request.intent.slots.copies.value != undefined) {
  //     copies = this.event.request.intent.slots.copies.value.toLowerCase();
  //     speechOutput += copies + " number of copies "
  //     updatedIntent.slots.copies.value = copies;
  //   }
  //
  //   // Create speech output
  //   this.response.cardRenderer(this.t('SKILL_NAME'), removeSSML(speechOutput));
  //   this.response.speak(speechOutput);
  //   this.emit(":delegate", updatedIntent);
  //
  // },
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
    this.handler.state = states.STARTMODE;
    console.log('copiesHandlers Unhandled' + JSON.stringify(this.event.request, null, '\t'));
    this.response.speak(speechOutput).listen(reprompt);
    this.emit(':responseReady');
  }
});

var scanHandler = Alexa.CreateStateHandler(states.SCANMODE, {
  'NewSession': function() {
    this.emit('NewSession'); // Uses the handler in newSessionHandlers
  },
  'ScanDocument': function() {
    // Use this.t() to get corresponding language data
    console.log(this.event.request);
    console.log(this.event.request.intent.slots);

    // set state to asking questions
    this.handler.state = states.STARTMODE;

    const speechOutput = 'scan completed' + this.t('HELP_MESSAGE');;
    const reprompt = this.t('HELP_MESSAGE');
    this.response.speak(speechOutput).listen(reprompt);
    this.emit(':responseReady');
  },
  'AMAZON.HelpIntent': function() {
    const speechOutput = this.t('HELP_MESSAGE');
    const reprompt = this.t('HELP_MESSAGE');
    console.log('scanHandler HelpIntent' + JSON.stringify(this.event.request, null, '\t'));
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
    console.log('scanHandler Unhandled' + +JSON.stringify(this.event.request, null, '\t'));
    this.response.speak(speechOutput).listen(reprompt);
    this.emit(':responseReady');
  }
});

exports.handler = (event, context) => {
  const alexa = Alexa.handler(event, context);
  alexa.appId = APP_ID;
  // To enable string internationalization (i18n) features, set a resources object.
  alexa.resources = languageStrings;
  alexa.registerHandlers(newSessionHandlers, startHandlers, copiesHandlers, scanHandler);
  alexa.execute();
};
