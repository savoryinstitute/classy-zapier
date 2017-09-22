const authenticate = (z, bundle) => {
    z.console.log('authenticating via session');
    const response = z.request('https://api.classy.org/oauth2/auth', {
        method: 'POST',
        form: {
            grant_type: 'client_credentials',
            client_id: bundle.authData.client_id,
            client_secret: bundle.authData.client_secret
        }
    }).then(function(res) {
        console.log('received the response');
        const data = JSON.parse(res.content);
        console.log(data);
        console.log('ACCESS TOKEN ' + data.access_token);
        return {
            token: data.access_token
        }
    });

    return response;
};

const authorize = (request, z, bundle) => {
    z.console.log('authorizing via middleware');
    z.console.log(bundle.authData);
    if (bundle.authData.token) {
        request.headers = request.headers || {};
        request.headers['Authorization'] = 'Bearer ' + bundle.authData.token;
    }

    return request;
};

const refresh = (response, z, bundle) => {
    z.console.log('REFRESH IT CHECK');
    if (bundle.authData.token && response.status === 401) {
        throw new z.errors.RefreshAuthError();
    }

    return response;
};

module.exports = {
    authorize: authorize,
    refresh: refresh,
    configuration: {
        type: 'session',
        test: function() {
            return true;
        },
        fields: [
            {key: 'client_id', type: 'string', required: true},
            {key: 'client_secret', type: 'string', required: true},
        ],
        sessionConfig: {
            perform: authenticate
        }
    }
};
