// triggers on transaction with a certain tag
const triggerActivity = (z, bundle) => {
  const responsePromise = z.request({
    url: 'https://api.classy.org/2.0/organizations/{{bundle.inputData.organization_id}}/campaigns'
  });
  return responsePromise
    .then(response => JSON.parse(response.content).data);
};

module.exports = {
  key: 'fundraiser',
  noun: 'Fundraiser',

  display: {
    label: 'Get Fundraiser',
    description: 'Triggers on a new fundraiser.'
  },

  operation: {
      type: 'polling',
      inputFields: [
          {key: 'organization_id', type: 'number',  helpText: 'Which organization to check for fundraisers on.'}
      ],
      perform: triggerActivity
  }
};
