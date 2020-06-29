# Apply Skills for Multiple Agents at Once 

This Flex plugin adds a feature to apply multiple skills to multiple agents at the same time using textual or query searches to select the agents: 

- **Textual**: type the name directly
- **Query**: use `data.` notation to search for any information related to workers such as `attributes`. For example, let's say you have an attribute called `team` and you want to select all workers with `team` equal to "Leads": 
`data.attributes.team == "Leads"`. As this notation is the same used in Flex Sync Live Query, please refer to this [documentation](https://www.twilio.com/docs/sync/live-query) for more details. 

<p align="center">
    <img src="screenshots/example2.png?raw=true" width="300" >
</p>

## Twilio Serverless 

You will need the [Twilio CLI](https://www.twilio.com/docs/twilio-cli/quickstart) and the [serverless plugin](https://www.twilio.com/docs/labs/serverless-toolkit/getting-started) to deploy the functions inside the ```serverless``` folder of this project. You can install the necessary dependencies with the following commands:

`npm install twilio-cli -g`

and then

`twilio plugins:install @twilio-labs/plugin-serverless`

## How to use

1. Setup all dependency above: Twilio CLI

2. Clone this repository

3. Copy ./serverless/.env.example to ./serverless/.env and populate the appropriate environment variables.

4. cd into ./serverless/ then run `npm install` and then `twilio serverless:deploy` (optionally you can run locally with `twilio serverless:start --ngrok=""`

5. Copy .env.example to .env.development and to .env.production and set the following variables:

    - REACT_APP_SERVICE_BASE_URL: your Twilio Functions base url (this will be available after you deploy your functions). In local development environment, it could be your localhost base url. 

6. Copy `public/appConfig.example.js` to `public/appConfig.js`

7. Run `npm install`

8. cd back to the root folder and run `npm start` to run locally or `npm run-script build` and deploy the generated ./build/plugin-dialpad.js to [twilio assests](https://www.twilio.com/console/assets/public) to include plugin with hosted Flex. Also, you want to use Twilio Serverless, just run `npm run deploy` to send your plugin directly to your Flex.


Note: as the bulk update is updating many workers at the same time, for large lists of workers, it is possible to hit API limits. To handle that, you can change the `worker-bulk-update` implementing some strategy to send the requests with some timeout between them.