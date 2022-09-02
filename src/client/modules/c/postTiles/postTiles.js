import { LightningElement, api, track } from 'lwc';

import { getData } from '../../data/services/services';
import { CATEGORIES_QUERY, TAGS_QUERY, GeneratePostsQuery } from '../commonUtils/queryUtil';


export default class PostTiles extends LightningElement {

    loading = false;
    @track _postItems = [];
    pageNumber = 1;
    itemsPerPage = 6;
    totalPostsFound = 0;

    keyword;

    selectedPostId;
    _selectedPost;

    selectedCategory;
    selectedTag;
    _categories = [];
    _tags = [];

    connectedCallback() {
        this.init();
    }
    
    async init() {
        await this.fetchPosts();
        await this.fetchCategories();
        await this.fetchTags();
    }

    handleBlogSearch(event) {
        this.keyword = event.target.value;
        console.log(this.keyword);
    }
    // handleSelectedPost(event) {
    //     const { postId, post } = event.detail;
    //     this.selectedPostId = postId;
    // }
    handleCategoryChange(event) {
        this.selectedCategory = event.detail.value;
        const option = this.categoriesOptions.find(cat => cat.value === this.selectedCategory );
        if (option)
        this.keyword = option.label;
    }
    handleTagChange(event) {
        this.selectedTag = event.detail.value;
        const option = this.tagsOptions.find(tag => tag.value === this.selectedTag );
        if(option)
        this.keyword = option.label;
    }

    handleSearch() {
        this.fetchPosts();
    }
    
    

    async fetchPosts() {
        // Run Query
        this.loading = true;
        const query = GeneratePostsQuery(this.itemsPerPage, this.pageNumber, this.keyword);
        try {
            const response = await getData(query);
            if (response.data) {
                this.loading = false;
                this.totalPostsFound = response.data.posts.found;
                console.log('this.totalPostsFound ' + this.totalPostsFound);
                this._postItems = response.data.posts.posts;

                
            }

        } catch (err) {
            console.log('error : ' + JSON.stringify(err));
        }
    }


    async fetchCategories() {
        // Run Query
        this.loading = true;
        try {
            const response = await getData(CATEGORIES_QUERY,);
            if (response.data) {
            
                this.loading = false;
                this._categories = response.data.categories.categories;
            }

        } catch (err) {
            console.log('error : ' + JSON.stringify(err));
        }
    }
    async fetchTags() {
        // Run Query
        this.loading = true;
        try {
            const response = await getData(TAGS_QUERY);
            if (response.data) {
            
                this.loading = false;
                this._tags = response.data.tags.tags;
            }

        } catch (err) {
            console.log('error : ' + JSON.stringify(err));
        }
    }

    goBack() {
        const pageNum = this.pageNumber;
        this.pageNumber = pageNum > 1 ? this.pageNumber - 1 : 1;
        this.fetchPosts();
    }
    goNext() {
        this.pageNumber += 1
        this.fetchPosts();
    }

    get totalPages() {
        const _totalRecords = this.totalPostsFound >= 0 ? this.totalPostsFound : 0;
        const _pageSize = this.itemsPerPage >= 1 ? this.itemsPerPage : 1;
        return Math.ceil(_totalRecords / _pageSize);
    }

    get currentPage() {
        return this.pageNumber;
    }

    get isFirstPage() {
        return this.pageNumber === 1;
    }
    get isLastPage() {
        return this.currentPage === this.totalPages;
    }


    get categoriesOptions() {
        return this._categories.length ? this._categories.map(cat => ({
            value: cat.ID,
            label: cat.name
        })):[];
    }
    get tagsOptions() {
        return this._tags.length ? this._tags.map(tag => ({
            value: tag.ID,
            label: tag.name
        })):[];
    }

    get posts() {
        return this._postItems.length ? this._postItems :[];
    }

   

   
}