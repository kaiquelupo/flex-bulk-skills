# Apply Skills for Multiple Agents at Once 

This Flex plugin adds a feature to apply multiple skills to multiple agents at the same time using textual or query searches to select the agents: 

- **Textual**: type the name directly
- **Query**: use `data.` notation to search for any information related to workers such as `attributes`. For example, let's say you have an attribute called `team` and you want to select all workers with `team` equal to "Leads": 
`data.attributes.team == "Leads"`. As this notation is the same used in Flex Sync Live Query, please refer to this [documentation](https://www.twilio.com/docs/sync/live-query) for more details. 

<p align="center">
    <img src="screenshots/example2.png?raw=true" width="300" >
</p>

## How to use

1. Clone this repository

2. Copy `public/appConfig.example.js` to `public/appConfig.js`

3.  run `npm install`

4. cd back to the root folder and run `npm start` to run locally or `npm run-script build` and deploy the generated ./build/plugin-dialpad.js to [twilio assests](https://www.twilio.com/console/assets/public) to include plugin with hosted Flex. Also, you want to use Twilio Serverless, just run `npm run deploy` to send your plugin directly to your Flex.


## Todo

1. Create Serverless Function to apply skills to multiple agents. As it stands for now, just the front-end is ready.