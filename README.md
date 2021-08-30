# Lightning Web Components OSS - Starter Kit
- Official Documentation - https://lwc.dev/ 
- This Project is using Lightning Web Components OSS
- It Includes Salesforce [Lightning Design System (SLDS)](https://www.lightningdesignsystem.com/) amd [Lightning Base Components](https://developer.salesforce.com/docs/atlas.en-us.lightning.meta/lightning/lightning_overview.htm)
- Basic setup using [Express JS](https://expressjs.com/) Server on [NodeJS](https://nodejs.org/en/)
- Browser Navigation routes and some basic API sample calls.
- Start reusing LWC both for *in and out* a Salesforce Org and allow local development with hot reloading for LWC. 

## Quick Preview
![Preview](./docs/Hola.png)


## How to start?
- Clone this repository and all will be setup for you. 
- `git clone https://github.com/vyuvalv/lwc-oss.git` 
- Run `npm install` from this project directory.
- `npm run build` - will build our package
- Then Start simple by running `yarn watch` (or `npm run watch`


# The Steps to follow for DIY
- Run on your terminal `npx create-lwc-app my-app` - it will create the base app project to start from.
- Take the simple setup route, as we will change the files as we go.

    - The command will create the basic structure and ask a few questions:
        * Do you want to use the simple setup? Yes
        * Standard Web App
        * Do you want a basic Express API server? Yes

        Once its done intalling all dependencies go into your project.

    Open in VS Code:
    *   `code my-app`

1. Install the latest following dependencies with `npm install`
    - Go to your `project.json` file
    - Add the following dependencies:
        * `@salesforce-ux/design-system` - Salesforce lightning design system
        * `lightning-base-components` - The open source UI base components.
        * `@lwc/synthetic-shadow` - Add the shaddow dom
    - Optional:
        * `jsforce` - Connection to Salesforce
        * `axios` - Making Rest Calls easier
        * `dotenv`- Storing parameters used for the connection to Salesforce Connected App option

    ```json
    "dependencies": {
            "@lwc/synthetic-shadow": "^1.17.6",
            "@salesforce-ux/design-system": "^2.14.3",
            "compression": "^1.7.4",
            "cors": "^2.8.5",
            "express": "^4.17.1",
            "helmet": "^3.23.3",
            "lightning-base-components": "^1.11.5-alpha"
        },
        "devDependencies": {
            "dotenv": "^8.2.0",
            "eslint": "^6.8.0",
            "husky": "^4.3.8",
            "lint-staged": "^10.5.4",
            "lwc-services": "^2.3.2",
            "npm-run-all": "^4.1.5",
            "prettier": "^1.19.1"
        },
    ```

2. Setup the LWC services processes (Very similar to webpack configuration file):
    - Go to your lwc-services configuration file - `lwc-services.config.js`
    - This will build the our bundled package on `./dist` filder.
    - Transfer the SLDS assets folder into our Resources folder

    ```js
    // Find the full example of all available configuration options at
    // https://github.com/muenzpraeger/create-lwc-app/blob/main/packages/lwc-services/example/lwc-services.config.js
    const srcFolder = 'src/client';
    const buildFolder = './dist';

    module.exports = {
        resources: [
            {
                from: 'node_modules/@salesforce-ux/design-system/assets',
                to: `${srcFolder}/resources/assets`
            },
            {
                from: 'src/client/resources', to: 'dist/resources/'
            },
            ],
            buildDir: `${buildFolder}`,
            sourceDir: './src/client',

            devServer: {
                proxy: { '/': 'http://localhost:5000' }
            }
            
    };
    ```
3. Add Lightning Base Components
    - lwc.config.json - to include the LWC base components
    - It provides a powerful reusable base components to get started with UI build. 

    ```js
        {
            "modules": [{
                    "dir": "src/client/modules"
                },
                {
                    "npm": "lightning-base-components"
                }
            ]
        }
    ```

4. Setup your Express Server File
    - Go `src/server/api.js` - this is currently setup as the server file. 
    - I typically like to change it to `main.js` - if you do that make sure to reference it on your `package.json` scripts. 

    ```js
        // Simple Express server setup to serve for local testing/dev 
        const compression = require('compression');
        const helmet = require('helmet');
        const express = require('express');
        const path = require('path');
        // Express server
        const app = express();
        app.use(helmet(), compression(), express.json());

        const HOST = process.env.HOST || 'localhost';
        const PORT = process.env.PORT || 5000;
        const SERVER_URL = `http://${HOST}:${PORT}`;
        // PRODUCTION BUILD
        const DIST_DIR = './dist';

        app.use(express.static(DIST_DIR));
        // Use SPA and ignore any url path locations and always serves index
        app.use('*', (req, res) => {
            res.sendFile(path.resolve(DIST_DIR, 'index.html'));
        });
        app.listen(PORT, () => {
            console.log(`✅  Local Server started: ${SERVER_URL}`)
        });

    ```

- I've also added here some sample API Calls
    ```js
        // GET
        app.get("/api/v1/data", (req, res) => {
            // Grab query parameters from URL
            const query = req.query;
            res.send({ data: { query, success: true } });
        });
        // POST
        app.post("/api/v1/service/:type", (req, res) => {
            // Grab parameters from URL Path
            const parameters = req.params.type;
            // Grab body request payload
            const body = req.body;
            res.send({ data: { parameters, body } });
        });
    ```

5. Our Client App
    -  Now let's setup our `index` files that runs our LWC app as a container. 
    -  Setup your `index.js`
    -  Include Shaddow Dom and append the LWC App

    ```js
        import '@lwc/synthetic-shadow';
        import { createElement } from 'lwc';
        import MyApp from 'core/app';

        const app = createElement('core-app', { is: MyApp });
        // Get the div element that will hold our LWC App
        const element = document.querySelector('#main');
        // To append the LWC
        element.appendChild(app);
    ```

    - I also like to add browser history control for navigation here which adds the Browser Url path as a public paramater for the main app.

    ```js
    window.addEventListener("DOMContentLoaded", () => {
        // sets page in browser history 
        const pageName = setHistoryPage();
        // passing the value into our app
        app.pathName = pageName;
        element.appendChild(app);
    });

    // handle any address type change or browser history
    window.onpopstate = function(event) {
        let pageName = event.state && event.state.page ? event.state.page : '';
        pageName = setHistoryPage(pageName);
        // assign the history page name to app
        app.pathName = pageName;
    };

    function setHistoryPage(statePage) {
        let pageName = statePage ? statePage : window.location.hash.substring(1, window.location.hash.length);

        window.history.pushState({ page: pageName.toLowerCase() },
            null,
            '#'.concat(pageName)
        );
        // scroll to top of the page
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        return pageName;
    }

    ```

- Inside your `index.html`
- We Just need to change the reference to our Lightning Design resources, which we setup earlier to be copied into our `resources` folder.
- Change the path to each resource link

```html
<!--  index.html  -->  
<!DOCTYPE html>
<html lang="en">
    
<head>
    <meta charset="utf-8" />
    <title>LWC OSS - Starter Kit By Yuval Vardi</title>
    <!--  SLDS  -->
    <link rel="stylesheet" type="text/css" href="./resources/assets/styles/salesforce-lightning-design-system.min.css" />
    <!--  Base Styling  -->  
    <link rel="stylesheet" href="./resources/styles/main.css" />
    <!-- Viewport -->
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <link rel="shortcut icon" href="./resources/favicon.ico" />
</head>

<body>
    <!--  Lightning Web Component  -->  
    <div id="main"></div>
</body>

</html>


```

### Add LWC Components
* That's it we are ready to start building more components inside this template.
* To add new components simply create the component folder inside the modules folder
* We will add it into `./client/modules/c` folder in our modules to match the way Salesforce Project use it. 


> Component bundle will have the following structure

```html
 <template></template>
```

```js
import { LightningElement, api, track } from 'lwc';
export default class ComponentName extends LightningElement {}
```
> Calling your component from parent html

- use `folderName-component-name` 
```html
<c-component-name></c-component-name>
```

## Build and Run it

- `npm run build` - will build our package
- Then Start simple by running `yarn watch` (or `npm run watch`
- View on your port - by default `http://localhost:3001` for DEV and hor reloading and  `http://localhost:5000` for production view.