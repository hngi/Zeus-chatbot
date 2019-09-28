    // process-message.js

    const Dialogflow = require('dialogflow');
    const Pusher = require('pusher');

    // You can find your project ID in your Dialogflow agent settings
    const projectId = 'talky-xeuyfj'; //https://dialogflow.com/docs/agents#settings
    const sessionId = '123456';
    const languageCode = 'en-US';

    const config = {
      credentials: {
        private_key:  "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQClwMwZEBw+EAXa\neDOj2PQHOinXSLyMjdDFTjZAFx/6P7XO7KY3xpxzyg+YnhTi5ZZu+c1i2vGV9zh9\nTS5tvPgm54ck+4Kz5UPKS3i/SvEyieqp31a6WcrhKr3PnF90C0gxv+K9qMKGwEEY\n/beaJ/C/I1vHx0DCNbvsU6FvATLrOGonAOmyC6M9GZN6QVHVVI9GxAiCtKe7M0fM\n2It1ZEZFhp/AMGfRx7Fi1ftRtRVuWwDPr83kC1Oa0BKLpl5UkE14luNrF4/e0zgz\ns1PzqNdeAFRpgCHKF0NucC0/f9qa9PDvIhrMopmfDCrrEGWnf6sRA8aXpy94Qk5I\n+to0TTrXAgMBAAECggEAG6RzBS0AIMOITl5kcktAqyHij3Ika6ZM7lK0Tmzs2s2c\nMuWZdMzNE6xbfH7EifBy7ZAAVh+gUXu4soDYINn2YnqTObIuInU2IHsEqJZFckG4\n3lqOOqa15GY94G06J/6nrBBNroaB5noSgSny4CUQC7hIWqFapejTLb7mub3v8XUi\nZelDNZAzI96naXozSmlfST2o6/R3invpSE+UCSTwKfB53pw6yTFuvVdwgyyReAFS\nifgUW9+Wc8KKwlFKTmt2/Dcii/Nec5iZLpKJyL0iZL//hLpE9GsDpPcYIar3tsW3\n98g/lXCiT6VOd4tgiQyAN05/UhYcP8YcfC26rJgKjQKBgQDnfupBDi/6ReTSXeit\nTFh93UbvJopZgwyWjMqwX4dv2xOAdiwf1U2wf0jcqw4vKPEJMvStyrHxXBZOiAsX\n1KXJzN+9nKJ01V4XwoNpYbK3Nj+TANOvP2p0cYlEEdRoxu14mFVb1DQjfb4TfPDE\nXhRoZMHu6oELtfIgC3VUFnvzewKBgQC3TGJhykAOqoBGUzkt901sMkVEU5hYnseK\n4910wepwY4ZkWXA3Upvl3TwOgo4yXskoGjdRPcLfZZiTN0O0x/5YEJ5EOBKyYm2T\n+6hrIbWXsk03TXAVHYN6O5lwAYDsWPeVcSI7FWyC75NZqWkSC83pSLqAlpgqe+5K\nXUcm/R05VQKBgGgW7QXrdy81ljnw99pUZcXSZT7LOZIeFt7q14iOq7tj6lTszdJS\neuhNk1mFoI8b/aWBP/uVFIXOPkl5amOAvjsK39/GOlYGSpSsZaJQx6cRwWw8BvLZ\ntOg+1NXCnpuuNsDu3hK4S+lZdMoWd7wUAWEfTQQ8dWHqocA+5ra0lW9ZAoGASPv6\nJHPyo6RSJS5YEyxoQI+XswgSHh9C1tO6RxY7cfq+9VADdZPIDXPUyPZFBltlfzlJ\nE2kjIe6DHQMhS2dip9AeJI2rLCoy9Xx76ARpGPje9Ak6er3grxfyFX4Txof6NR/y\nAFKcfVpFcqsY8h2PJLdXw4GzHx9vl16iySx5qW0CgYBGkbIh1FLuRnWWW/SOLDMH\nnjD1BYBJpdv9ALNps7fe2B57iWERNyj9znS13zKjrelLVLLQKRHcZJoESusbDG1U\nj5pR1ujs7MSJqc4kLL0otL2AP7roVamYHCz0Lm24V7B5m2zTmMTwTWVOizzPB0o+\ncQGmJGR6jgeeVJ4D6V0ykA==\n-----END PRIVATE KEY-----\n",
        client_email: "dialogflow-ubemxw@talky-xeuyfj.iam.gserviceaccount.com"
      },
    };

    const pusher = new Pusher({
      appId: process.env.PUSHER_APP_ID,
      key: process.env.PUSHER_APP_KEY,
      secret: process.env.PUSHER_APP_SECRET,
      cluster: process.env.PUSHER_APP_CLUSTER,
      encrypted: true,
    });

    const sessionClient = new Dialogflow.SessionsClient(config);

    const sessionPath = sessionClient.sessionPath(projectId, sessionId);

    const processMessage = message => {
      const request = {
        session: sessionPath,
        queryInput: {
          text: {
            text: message,
            languageCode,
          },
        },
      };

      sessionClient
        .detectIntent(request)
        .then(responses => {
          const result = responses[0].queryResult;
          return pusher.trigger('bot', 'bot-response', {
            message: result.fulfillmentText,
          });
        })
        .catch(err => {
          console.error('ERROR:', err);
        });
    }

    module.exports = processMessage;