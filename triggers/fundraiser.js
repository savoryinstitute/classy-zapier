// triggers on transaction with a certain tag
const triggerFundraiser = (z, bundle) => {
  const responsePromise = z.request({
    url: 'https://api.classy.org/2.0/organizations/{{bundle.inputData.organization_id}}/campaigns'
  })

  return responsePromise.then((response) => {
    var campaigns = JSON.parse(response.content).data;
    var fundraiserPromises = [];

    for (var i = 0; i < campaigns.length; i++) {
      fundraiserPromises.push(z.request({
        url: 'https://api.classy.org/2.0/campaigns/' + campaigns[i].id + '/fundraising-teams?with=team_lead&per_page=100&sort=updated_at:desc'
      }));
    }

    return Promise.all(fundraiserPromises).then(responses => {
      var fundraisers = [];

      for (var i = 0; i < responses.length; i++) {
        var fr = JSON.parse(responses[i].content).data;
        fundraisers = fundraisers.concat(fr);
      }

      return fundraisers;
    })
  });;
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
      perform: triggerFundraiser
  }
};
