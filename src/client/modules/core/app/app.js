import { LightningElement, api, track } from 'lwc';
import { getData } from '../../data/services/services';

const menuTabs = ['home', 'salesforce'];
const LOGO = './resources/lwc.png';

export default class App extends LightningElement {
    @api
    get pathName() {
        // validate path with existing tabs
        return menuTabs.includes(this._pathName) ? this._pathName : menuTabs[0];
    }
    set pathName(value) {
        this._pathName = `${value}`;
    }

    _pathName = 'home';
    logoImage = LOGO;

    @track alert = {};
    showAlert = false;

    message = 'Whoo hooo!!';
    @track _logger = 'Nothing to show yet';
    @track errors;
    loading = false;

    connectedCallback() {}

    // Change Tab and Browser path
    handleActiveTab(event) {
        event.preventDefault();
        const activeTab = event.target.value;
        this.navigate(activeTab);
    }

    // Intro input message
    handleInputChange(event) {
        this.message = event.target.value;
    }

    async handleSendMessage() {
        // Get Message Value
        const messageBody = this.message.length > 1 ? this.message : 'None';
        // Build query
        const graphQuery = {
            query: `{ hello(message:"${messageBody}") }`
        };
        // Run Query
        this.loading = true;
        try {
            const response = await getData(graphQuery);
            if (response.data) {
                console.log('SUCCESS ' + JSON.stringify(response));
                this.loading = false;
                this._logger = response.data;
            }

        } catch (err) {
            console.log('error : ' + JSON.stringify(err));
        }
    }

    // Handle Salesforce Login
    isOnline;
    isOffline = !this.isOnline;

    async handleLogin(event) {
        // gets input values from child component
        const credentials = event.detail;
        const graphQuery = {
            query: `{
                login( credentials: ${JSON.stringify(credentials.formInputs).replace(/"([^"]+)":/g, '$1:')} ){
                    userId
                    accessToken
                    loggedInDate
                    loggedInUser { Name }
                }
            }`
        }
        // Run Query
        this.loading = true;
        try {
            const response = await getData(graphQuery);
            if (response.data) {
                console.log('Login Succesfully ' + JSON.stringify(response));
                this.loading = false;
                this._logger = response.data;
                this.toggleOnline(true);
            }

        } catch (err) {
            console.log('Error on login : ' + JSON.stringify(err));
        }
    }

    async handleLogout(event) {
        const graphQuery = {
            query: `{
                logout{
                    success
                    timestamp
                }
            }`
        }
        try {
            this.loading = true;
            const response = await getData(graphQuery);
            if (response.data) {
                console.log('Logout Succesfully ' + JSON.stringify(response));
                this.loading = false;
                this._logger = response.data;
                this.toggleOnline(false);
            }

        } catch (err) {
            console.log('error : ' + JSON.stringify(err));
        }
    }

    toggleOnline(toggle) {
        this.isOnline = toggle;
        this.isOffline = !toggle;
    }

    // handle messages from child components
    handleNotifications(event) {
        const { title, message, type, sticky, errors } = event.detail;
        if (errors) { this.errors = errors; }
        this.showAlertPanel(title, message, type, sticky);
    }

    hideAlert() {
        this.showAlert = false;
    }

    showAlertPanel(title = 'Error', message = 'Something went wrong...', type = 'error', sticky = false) {
        this.alert = {
            title,
            message,
            type
        };
        this.showAlert = true;
        // hides alert automatically
        if (sticky) {
            window.setTimeout(() => { this.hideAlert() }, 3000);
        }
    }

    errorCallback(error, stack) {
        this.errors = error;
        this.showAlertPanel('Errors in child components', stack, 'error');
    }

    // Browser navigation
    navigate(pageName = 'home') {
        this._pathName = pageName;
        // add page to browser history
        window.history.pushState({ page: this._pathName },
            null,
            '#'.concat(this._pathName)
        );
        // set page title
        document.title = this._pathName;
    }

    // Display for DEBUG
    get logger() {
        return JSON.stringify(this._logger, null, ' ');
    }

  
}