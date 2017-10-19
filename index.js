const Authenticator = require('./authentication/authenticator');
const TransactionTrigger = require('./triggers/transaction');
const FundraiserTrigger = require('./triggers/fundraiser');

// We can roll up all our behaviors in an App.
const App = {
  // This is just shorthand to reference the installed dependencies you have. Zapier will
  // need to know these before we can upload
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  authentication: Authenticator.configuration,

  beforeRequest: [
      Authenticator.authorize
  ],

  afterResponse: [
      Authenticator.refresh
  ],

  triggers: {
    [TransactionTrigger.key]: TransactionTrigger,
    [FundraiserTrigger.key]: FundraiserTrigger,
  }
};

// Finally, export the app.
module.exports = App;
