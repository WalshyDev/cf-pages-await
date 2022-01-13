# CF Pages Await

Wait for a Cloudflare Pages build to finish so you can do actions like purge cache, update Workers, etc.

## Usage
```yml
- name: Await CF Pages
  uses: WalshyDev/cf-pages-await@v1
  with:
    accountEmail: ${{ secrets.CF_ACCOUNT_EMAIL  }}
    apiKey: ${{ secrets.CF_API_KEY  }}
    accountId: '4e599df4216133509abaac54b109a647'
    project: 'example-pages-project'
    # Add this if you want GitHub Deployments (see below)
    githubToken: ${{ secrets.GITHUB_TOKEN }}
```

### Example
```yml
name: Deploy
on: push
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Wait for CF Pages
      id: cf-pages
      uses: WalshyDev/cf-pages-await@v1
      with:
        accountEmail: ${{ secrets.CF_ACCOUNT_EMAIL  }}
        apiKey: ${{ secrets.CF_API_KEY  }}
        accountId: '4e599df4216133509abaac54b109a647'
        project: 'test'
        # Add this if you want GitHub Deployments (see below)
        githubToken: ${{ secrets.GITHUB_TOKEN }}
    - run: |
        curl -X \
          -H "X-Auth-Email: ${{ secrets.CF_ACCOUNT_EMAIL }}" \
          -H "X-Auth-Key: ${{ secrets.CF_API_KEY }}" \
          -H "Content-Type: application/json" \
          --data '{"purge_everything":true}' \
          https://api.cloudflare.com/client/v4/zones/8d0c8239f88f98a8cb82ec7bb29b8556/purge_cache
```

## Outputs
* `id`          - Deployment ID, example: `50ff553c-da5d-4846-8188-25ae82a3bb7d`
* `environment` - Envrionment for this deployment, either `production` or `preview`
* `url`         - URL for this deployment
* `alias`       - Alias URL (Will be the branch URL such as `fix-issue.project.pages.dev` or be the deployment URL)
* `success`     - If the deployment was successful

## GitHub Deployments
GitHub Deployments will show if the deployment was successful or failed right inside GitHub! You can easily see the status, view the website (exact deployment) and see the logs.

> **Note**: You need to add the `githubToken` input in order for deployments to work!

### Overview
![Successful production deployment](https://user-images.githubusercontent.com/8492901/149387681-25ec860d-0c8e-4075-8ab0-4d289b86127b.png)

### Pull Requests
**In Progress**
![In progress deployment in PR](https://user-images.githubusercontent.com/8492901/149388796-6bbd4ae9-b7b3-4d06-80c5-c18b3737f51f.png)

**Successful**
![Successful deployment in PR](https://user-images.githubusercontent.com/8492901/149388892-14a7ea25-6865-4d52-b403-30e8cec449d2.png)
