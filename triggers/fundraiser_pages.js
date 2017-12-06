var request = require('sync-request');

function auth_request_url(z, bundle, url) {
  var res = request('GET', url, {
    'headers': {
      'Authorization': 'Bearer ' + bundle.authData.token
    }
  });
  return JSON.parse(res.getBody());
}

const triggerFundraiserPage = (z, bundle) => {
  // Getting all the classy campaigns
  var url = "https://api.classy.org/2.0/organizations/" + bundle.inputData.organization_id + "/campaigns";
  var campaigns = auth_request_url(z, bundle, url).data;

  var pages = [];
  for (var c = 0; c < campaigns.length; c++) {
    campaign = campaigns[c];

    // Getting all the fundraiser pages under a given campaign (only up to 100 of the most recent)
    url = "https://api.classy.org/2.0/campaigns/" + campaign.id + "/fundraising-pages?with=member&per_page=100&sort=updated_at:desc";
    var fundraiserPages = auth_request_url(z, bundle, url).data;
    
    for (f = 0; f < fundraiserPages.length; f++) {
      var fundraiserPage = fundraiserPages[f];

      // Getting the overview info for a given fundraiser page
      url = "https://api.classy.org/2.0/fundraising-pages/" + fundraiserPage.id + "/overview";
      var fundraiserOverview = auth_request_url(z, bundle, url).metrics;

      var page = {
        owner_id: fundraiserPage.member.id,
        owner_email: fundraiserPage.member.email_address,
        owner_first_name: fundraiserPage.member.first_name,
        owner_last_name: fundraiserPage.member.last_name,
        id: fundraiserPage.id,
        url: fundraiserPage.canonical_url,
        goal: fundraiserPage.goal,
        raised_gross: fundraiserOverview.gross_amount,
        raised_net: fundraiserOverview.net_amount,
        raised_fees: fundraiserOverview.fees_amount,
        donor_count: fundraiserOverview.donor_count
      };

      pages.push(page);
    }
  }
  return pages;
};

module.exports = {
  key: 'fundraiserPage',
  noun: 'FundraiserPage',

  display: {
    label: 'Get Fundraiser Page',
    description: 'Triggers on a new fundraiser page.'
  },

  operation: {
    type: 'polling',
    inputFields: [
      {key: 'organization_id', type: 'number',  helpText: 'Which organization to check for fundraiser pages on.'}
    ],
    perform: triggerFundraiserPage
  }
};
