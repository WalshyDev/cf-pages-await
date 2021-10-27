import * as core from '@actions/core';
import fetch, { Response } from 'node-fetch';
import { ApiResponse } from './types';

export default async function run() {
  const accountEmail = core.getInput('accountEmail', { required: true, trimWhitespace: true });
  const apiKey = core.getInput('apiKey', { required: true, trimWhitespace: true });
  const accountId = core.getInput('accountId', { required: true, trimWhitespace: true });
  const project = core.getInput('project', { required: true, trimWhitespace: true });

  console.log('Waiting for Pages to finish building...');
  let lastStage = '';

  let waiting = true;
  while (waiting) {
    // We want to wait a few seconds, don't want to spam the API :)
    await sleep();

    // curl -X GET "https://api.cloudflare.com/client/v4/accounts/:account_id/pages/projects/:project_name/deployments" \
    //   -H "X-Auth-Email: user@example.com" \
    //   -H "X-Auth-Key: c2547eb745079dac9320b638f5e225cf483cc5cfdda41"
    let res: Response;
    let body: ApiResponse;
    // Try and fetch, may fail due to a network issue
    try {
      res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${project}/deployments`, {
        headers: {
          'X-Auth-Email': accountEmail,
          'X-Auth-Key': apiKey,
        }
      });
    } catch(e) {
      core.error(`Failed to send request to CF API - network issue? ${e.message}`);
      core.setFailed(e);
      return;
    }

    // If the body isn't a JSON fail - CF seems to do this sometimes?
    try {
      body = await res.json() as ApiResponse;
    } catch(e) {
      core.error(`CF API did not return a JSON - Status code: ${res.status} (${res.statusText})`);
      core.setFailed(e);
      return;
    }

    if (!body.success) {
      waiting = false;
      const error = body.errors.length > 0 ? body.errors[0] : 'Unknown error!';
      core.setFailed(`Failed to check deployment status! Error: ${error}`);
      return;
    }

    const deployment = body.result[0];

    if (deployment.latest_stage.name !== lastStage) {
      lastStage = deployment.latest_stage.name;
      console.log('# Now at stage: ' + lastStage);
    }

    if (deployment.latest_stage.name === 'deploy') {
      waiting = false;

      const aliasUrl = deployment.aliases && deployment.aliases.length > 0 ? deployment.aliases[0] : deployment.url;

      // Set outputs
      core.setOutput('id', deployment.id);
      core.setOutput('environment', deployment.environment);
      core.setOutput('url', deployment.url);
      core.setOutput('alias', aliasUrl);
      core.setOutput('success', deployment.latest_stage.status === 'success' ? true : false);
    }
  }
}

async function sleep() {
  return new Promise((resolve) => setTimeout(resolve, 5000));
}

run();