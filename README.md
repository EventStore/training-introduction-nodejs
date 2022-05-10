# Training Introduction to Event Sourcing, CQRS and DDD Modelling in NodeJS

# Instructions for setting up project

## Prerequisities

You'll need to have [NodeJS 16.15.0 (or later)](https://nodejs.org/en/download/) and [docker](https://www.docker.com/products/docker-desktop) installed to be able to run the project and tests. You'll need to also have Java IDE (e.g. Visual Studio Code, WebStorm or other preferred one).

## Steps

1. Clone this repository
2. Make sure you are on master branch.
3. Run:
   - `npm install` to install all of the dependencies,
   - `npm build` to build source code
4. To start EventStoreDB using Docker, run:

   - `docker-compose up` - for X86-based computers,
   - `docker-compose -f docker-compose.arm64.yml up` - for ARM-based computers like MacBook M1.

     To access the github packages docker images, you need to authenticate docker with a gitub personal access token. It should be [generated](https://github.com/settings/tokens/new). Select at least following scopes: `repo`, `read:packages`. Then login to github docker registry with:

     ```shell script
     docker login https://ghcr.io -u  -u YOUR_GITHUB_USERNAME -p YOUR_PERSONAL_ACCESS_TOKEN
     ```

     Check full instructions in the ["Authenticating to the Container registry"](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry#about-container-registry-support) guide.

5. Open solution in IDE and run all tests using
   - `npm test` command,
   - or run through your IDE test runner.

Any problems please contact training@eventstore.com
