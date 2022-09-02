import { LightningElement, api, track } from 'lwc';

import postListItem from './templates/postListItem.html';
import postTileItem from './templates/postTileItem.html';
const LAYOUT = {
    tile: 'tile',
    list:'list'
}
export default class PostTile extends LightningElement {
    @api post;
    @api layout;


    get postId() {
        return this.post.ID;
    }
    get title() {
        return this.post.title;
    }
    get blogImage() {
        return this.post.featured_image;
    }
    get blogExcerpt() {
        return this.post.excerpt;
    }
    get blogContent() {
        return this.post.content;
    }
    get tags() {
        return this.post.tags;
    }
    get categories() {
        return this.post.categories;
    }

    handleNavToPost() {
        this.dispatchEvent(new CustomEvent('selectedpost', {
            detail: {
                postId: this.postId,
                post: this.post
            },
            bubbles: true,
            composed:true
        }));
    }

    render() {
       switch (this.layout) {
        case LAYOUT.tile:
               return postTileItem;
            break;
        case LAYOUT.list:
               return postListItem;
            break;
       
           default:
            return postTileItem;
            break;
       }
      
    }
}