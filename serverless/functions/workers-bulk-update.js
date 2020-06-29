const TokenValidator = require('twilio-flex-token-validator').functionValidator;

let path = Runtime.getFunctions()['dialpad-utils'].path;
let assets = require(path);

exports.handler = TokenValidator( async (context, event, callback) => {
  
  const { workerAttributes, workers } = event;
  const client = context.getTwilioClient();

  const attributes = JSON.parse(workerAttributes);
  const workersToUpdate = JSON.parse(workers);

  console.log(attributes);
  console.log(workersToUpdate);

  await Promise.all(workersToUpdate.map((worker) => {
    return client.taskrouter.workspaces(context.WORKSPACE_SID)
      .workers(worker.worker_sid)
      .update({
        attributes: JSON.stringify({
          ...worker.attributes,
          routing: attributes.routing,
          disabled_skills: attributes.disabled_skills
        })
      })
  }));

  callback(null, assets.response("json", {}));
});