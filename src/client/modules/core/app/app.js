import { LightningElement, api, track } from 'lwc';

const menuTabs = ['home', 'details'];
const LOGO = './resources/lwc.png';
const SAMPLE_POST = { "ID": "512", "title": "Salesforce Certified Development Lifecycle and Deployment Designer &#8211; Study guide", "featured_image": "", "excerpt": "<p>Capturing all details I&#8217;ve managed to find about this exam. Helped me organise my thoughts but might help other as well. About this Credential&nbsp; The Salesforce Certified Development Lifecycle and Deployment Designer credential is designed for professionals who have the requisite skills and experience in managing Lightning Platform development and deployment activities as well as [&hellip;]</p>\n", "tags": [{ "ID": "11198", "name": "Certification" }, { "ID": "21448", "name": "deploy" }, { "ID": "97017", "name": "salesforce" }], "categories": [{ "ID": "11198", "name": "Certification" }] };

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

    siteId = '153067956';
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

    _selectedPostId;

    handleSelectedPost(event) {
        const { postId, post } = event.detail;
        this.navigate(`details`);
        this._selectedPostId = postId;
        console.log('postId ' + postId);
        const detailPage = this.template.querySelector('c-post-details-page');
        if(detailPage)
        detailPage.fetchPost(postId);
        
    }
    get selectedPostId() {
        return this._selectedPostId;
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