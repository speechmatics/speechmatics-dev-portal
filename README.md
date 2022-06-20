# Speechmatics Portal

[Azure Static Web Apps](https://docs.microsoft.com/azure/static-web-apps/overview) allows you to easily build [Next.js](https://nextjs.org/) apps in minutes. Use this repo with the [Next.js tutorial](https://docs.microsoft.com/azure/static-web-apps/deploy-nextjs) to build and customize a new static site.

## Setting up

Once you've pulled the repo, you will need to do a few things.

1. Install node on your machine (if you haven't aready got it)
2. Install node packages for this repo. This requires you to run the command:

    ```
    npm install
    ```

## Running locally

To run locally, open the development server with the following command:

```bash
npm run dev
# or
yarn dev
```

Next, open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

You can start editing the app by modifying modifying `pages/index.js`. Notice how the the page auto-updates as you edit the file 🎉.

## Running on the cloud

This app is built as a static web app using azure webapp integrations. The pipeline that runs to build the static web app is defined in the .github/workflows folder. There is a plan to setup a serious of development branches allowing us to build to a set of constantly running free-tier static web apps for development, testing and demonstration purposes before submitting the work to more rigorous tests.

The dev environments we have for the UI are:

|branch              |usage       |url                                                    |
|--------------------|------------|-------------------------------------------------------|
|general_dev_jupiter |analytics   |https://witty-coast-02348be03.1.azurestaticapps.net/   |
|general_dev_mars    |general     |https://salmon-sea-0ca2c8e03.1.azurestaticapps.net/    |
|general_dev_mercury |ui tests    |https://thankful-island-01372b310.1.azurestaticapps.net|
|general_ui_test     |tester test |https://calm-island-0a73d9810.1.azurestaticapps.net    |

## Connecting to the backend

Connecting to the backend is done by providing a set of environment variables. Locally, these can be specified in a .env file at the root of the directory. To do this on the cloud, they should be added to the variables in the workflow that builds the app.

The UI communicates with two different APIs.

1. mp-api for generic data about usage, payments, accounts and authentication (ENDPOINT_API_URL)
2. Batch-jops-api for creating and viewing transcription jobs (RUNTIME_API_URL)

There are two main environments used for development against a backend. These are:

1. The mock server. Code can be found here https://github.com/zennzei/mock-server-smportal. This requires the addition of the following variables:

   ```
    ENDPOINT_API_URL="https://self-service-chargify-poc.azurewebsites.net/"
    RUNTIME_API_URL="https://self-service-chargify-poc.azurewebsites.net/"
   ```
2. The k8s cluster dev-eu-a. This requires the addition of the following variables:

   ```
    ENDPOINT_API_URL="https://speechmatics-mp-dev-ingress-a.westeurope.cloudapp.azure.com/v1"
    RUNTIME_API_URL="https://speechmatics-dev-ingress-a.westeurope.cloudapp.azure.com/v2"
   ```

## Release to production

Releasing to production requires merging into the production branch. This will trigger a build that will push the changes to the production environment.

A tag should also be produced after a production release with the version number of the release, so that a stable reference is kept for rollback and deploying old versions. To create a tag, run:

```
git tag -a vX.Y.Z -m "some message"
```