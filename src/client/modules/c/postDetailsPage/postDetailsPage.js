import { LightningElement, api, track } from 'lwc';
import { getData } from '../../data/services/services';
import { GeneratePostQuery } from '../commonUtils/queryUtil';
const SAMPLE_POST = { "ID": "512", "title": "Salesforce Certified Development Lifecycle and Deployment Designer &#8211; Study guide", "featured_image": "", "excerpt": "<p>Capturing all details I&#8217;ve managed to find about this exam. Helped me organise my thoughts but might help other as well. About this Credential&nbsp; The Salesforce Certified Development Lifecycle and Deployment Designer credential is designed for professionals who have the requisite skills and experience in managing Lightning Platform development and deployment activities as well as [&hellip;]</p>\n", "tags": [{ "ID": "11198", "name": "Certification" }, { "ID": "21448", "name": "deploy" }, { "ID": "97017", "name": "salesforce" }], "categories": [{ "ID": "11198", "name": "Certification" }] };
const NO_IMAGE = './resources/no-image-icon.svg';

export default class PostDetailsPage extends LightningElement {
    @api articleId;
   
    loading = false;
    @track _post = SAMPLE_POST;


    connectedCallback() {
        if (this.articleId) {  
            console.log('this.articleId:' + this.articleId);
            this.fetchPost(this.articleId);
            
        }
    }

    @api
    async fetchPost(postId) {
        const query = GeneratePostQuery(postId)
        // Run Query
        this.loading = true;
        try {
            const response = await getData(query);
            if (response.data) {
            
                this.loading = false;
                this._post = response.data.get_post.post;
                console.log('POST : ' + JSON.stringify(this._post));
                
            }

        } catch (err) {
            console.log('error : ' + JSON.stringify(err));
        }
    }


    get post() {
        return this._post ? { ...this._post } : false;
    }
    get postId() {
        return this.post ? this.post.ID : '1';
    }
    get title() {
        return this.post ? this.post.title : 'Title';
    }
    get blogImage() {
        return this.post && this.post.featured_image ? this.post.featured_image : NO_IMAGE;
    }
    get blogExcerpt() {
        return this.post ? this.post.excerpt:'';
    }
    get blogContent() {
        return this.post ? this.post.content :'';
    }
    get tags() {
        return this.post ? this.post.tags : [];
    }
    get categories() {
        return this.post ? this.post.categories : [];
    }

}