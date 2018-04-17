 // triggers to pull in recurring donations and update them
const triggerRecurringDonations = (z, bundle) => {
    const responsePromise = z.request({
      url: 'https://api.classy.org/2.0/organizations/{{bundle.inputData.organization_id}}/recurring-donation-plans/?per_page=1000'
    });
    return responsePromise
      .then(response => {
        results = JSON.parse(response.content).data;
        
        for (var i = 0; i < results.length; i++) {
          // This ensures that zapier will only update the items when the recurring donation is updated. (filters on unique id automatically)
          results[i].id = results[i].id + results[i].updated_at;
        }

        return results;
      });
  };
  
  module.exports = {
    key: 'recurring_donation',
    noun: 'Recurring Donation',
  
    display: {
      label: 'Get Recurring Donations',
      description: 'Triggers to bring in recurring donations.'
    },
  
    operation: {
        type: 'polling',
        inputFields: [
            {key: 'organization_id', type: 'number',  helpText: 'Which organization to check for transactions on.'}
        ],
        perform: triggerRecurringDonations
    }
  };
  