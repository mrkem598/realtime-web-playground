# Goodow Realtime Store API Playground [![Build Status](https://travis-ci.org/goodow/realtime-web-playground.svg?branch=master)](https://travis-ci.org/goodow/realtime-web-playground)

[![Goodow Realtime Store API Playground Screenshot](https://github.com/goodow/realtime-web-playground/raw/master/screenshot.png)](http://realtimeplayground.goodow.com/)


## Overview

**Goodow Realtime Store API Playground**, is a web app that helps you to try out the features of the [Goodow Realtime Store API](https://github.com/goodow/realtime-store/).

You can try out the Goodow Realtime Store API Playground on its [live instance](http://realtimeplayground.goodow.com/).

Visit [Google groups](https://groups.google.com/forum/#!forum/goodow-realtime) for discussions and announcements.

## Getting Started

To get you started you can simply clone the realtime-web-playground repository and install the dependencies:

### Prerequisites

You need git to clone the realtime-web-playground repository. You can get it from
[http://git-scm.com/][git].

We also use a number of node.js tools to initialize and test realtime-web-playground. You must have node.js and
its package manager (npm) installed.  You can get them from [http://nodejs.org/][node].

### Clone realtime-web-playground

Clone the realtime-web-playground repository using [git][git]:

```
git clone https://github.com/goodow/realtime-web-playground.git
cd realtime-web-playground
```

### Install Dependencies

We have two kinds of dependencies in this project: tools and realtime-store library code.  The tools help
us manage and test the application.

* We get the tools we depend upon via `npm`, the [node package manager][npm].
* We get the realtime-store code via `bower`, a [client-side code package manager][bower].

We have preconfigured `npm` to automatically run `bower` so we can simply do:

```
npm install
```

Behind the scenes this will also call `bower install`.  You should find that you have two new
folders in your project.

* `node_modules` - contains the npm packages for the tools we need
* `app/bower_components` - contains the realtime-store library files

*Note that the `bower_components` folder would normally be installed in the root folder but
realtime-web-playground changes this location through the `.bowerrc` file.  Putting it in the app folder makes
it easier to serve the files by a webserver.*

### Run the Application

The project can run on any static web server, but we also have preconfigured the project with a
simple development web server.  The simplest way to start this server is:

```
gulp serve
```

This outputs an IP address you can use to locally test and another that can be used on devices connected to your network.


## Updating Realtime Store
You can update the tool dependencies by running:

```
npm update
```

This will find the latest versions that match the version ranges specified in the `package.json` file.

You can update the Realtime Store dependencies by running:

```
bower update
```

This will find the latest versions that match the version ranges specified in the `bower.json` file.


## Continuous Integration

### Travis CI

[Travis CI][travis] is a continuous integration service, which can monitor GitHub for new commits
to your repository and execute scripts such as building the app or running tests. The realtime-web-playground
project contains a Travis configuration file, `.travis.yml`, which will cause Travis to build and
deploy the app to Github Pages when you push to GitHub.

You will need to enable the integration between Travis and GitHub. See the Travis website for more
instruction on how to do this.

[git]: http://git-scm.com/
[bower]: http://bower.io
[npm]: https://www.npmjs.org/
[node]: http://nodejs.org
[travis]: https://travis-ci.org/