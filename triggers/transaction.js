// triggers on transaction with a certain tag
const triggerTransaction = (z, bundle) => {
  const responsePromise = z.request({
    url: 'https://api.classy.org/2.0/organizations/{{bundle.inputData.organization_id}}/transactions?per_page=100&sort=created_at:desc'
  });
  return responsePromise
    .then(response => {
      raw_results = JSON.parse(response.content).data;
      results = [];

      for (var i = 0; i < raw_results.length; i++) {
        if (raw_results[i].frequency === 'one-time') {
          results.push(raw_results[i]);
        }
      }

      return results;
    });
};

module.exports = {
  key: 'transaction',
  noun: 'Transaction',

  display: {
    label: 'Get Transaction',
    description: 'Triggers on a new transaction.'
  },

  operation: {
      type: 'polling',
      inputFields: [
          {key: 'organization_id', type: 'number',  helpText: 'Which organization to check for transactions on.'}
      ],
      perform: triggerTransaction
  }
};
