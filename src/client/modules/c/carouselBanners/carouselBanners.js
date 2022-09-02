import { LightningElement, api, track } from 'lwc';

const ItemClassName = 'carousel-slide-item';
const ACTIVE = 'active';
const INITIAL = 'initial';
const PREV = 'prev';
const NEXT = 'next';

const SAMPLE_DATA = [
    {
        order: 0,
        image: 'http://placekitten.com/g/1600/900',
        className: ItemClassName,
        title:"Image 1"
    },
    {
        order: 1,
        image: 'http://placekitten.com/1600/900',
        className: ItemClassName,
        title:"Image 2"
    },
    {
        order: 2,
        image: 'http://placekitten.com/200/300',
        className: ItemClassName,
        title:"Image 3"
    },
    {
        order: 4,
        image: 'http://placekitten.com/1600/900',
        className: ItemClassName,
        title:"Image 5"
    },
    {
        order: 3,
        image: 'http://placekitten.com/g/1600/900',
        className: ItemClassName,
        title:"Image 4"
    },
];


export default class CarouselBanners extends LightningElement { 

    @track _banners = [];
    
    currentSlideIndex = 0;
    intervalTimeInMs = 1000;
    autoplayTimer;
    moving = false;

    showDots = true;
    isAutoPlay = false;
    rendered = false;
    connectedCallback() {
        this.currentSlideIndex = 0;
        this.moving = false;      
    }

    renderedCallback() {
        if (!this.rendered) {
            const sorted = SAMPLE_DATA.sort((a, b) => a.order - b.order);
            let items = this.slideCarouselToIndex(sorted, this.currentSlideIndex);
            // Sets initial
            items[0].className = `${ItemClassName} ${ACTIVE} ${INITIAL}`;
            this._banners = items;

            this.rendered = true;
        }
    }

    @api
    get banners() {
        return this._banners ? this._banners  : [];
    }
    set banners(val) {
        this._banners = val;
    }

    get totalBanners() {
        return this.banners ? this.banners.length : 0;
    }
    get hasRecords() {
        return this.banners && this.banners.length;
    }

    get playButtonIcon() {
        return this.isAutoPlay ? "utility:stop" :"utility:play";
    }
   
    get dots() {
        const total = this.totalBanners;
        return total > 0 ? new Array(total).fill(0).map((item, index) => ({ index:index, current: this.currentSlideIndex === index, className: this.currentSlideIndex === index ? 'carousel-dot current-slide-dot' : 'carousel-dot' })) : [];
    }

 
    handleAutoPlay() {
        this.isAutoPlay = !this.isAutoPlay;
        if(this.isAutoPlay){
            this.autoplayTimer = window.setInterval(() => {
                this.handleForward();
            }, this.intervalTimeInMs);
        }
        else {
            window.clearInterval(this.autoplayTimer);
        }
    }

    handleForward() {
         // Check if moving
        if (!this.moving) {

            // If it's the last slide, reset to 0, else +1
            if (this.currentSlideIndex === (this.totalBanners - 1)) {
                this.currentSlideIndex = 0;
            } else {
                this.currentSlideIndex++;
            }
            const currentItems = this.banners;
            this._banners = this.slideCarouselToIndex(currentItems, this.currentSlideIndex);
      }
    }
    handlePrevious() {
        // Check if moving
        if (!this.moving) {
            if (this.currentSlideIndex === 0) {
                this.currentSlideIndex = (this.totalBanners - 1);
            } else {
                this.currentSlideIndex--;
            }
            const currentItems = this.banners;
            this._banners = this.slideCarouselToIndex(currentItems, this.currentSlideIndex);
        }
    }
    handleSelectedDot(event) {
        const selectedDotIndex = Number(event.target.dataset.index);
        if (!this.moving && selectedDotIndex >=0) {
            // Sets current Dot as current slide
            this.currentSlideIndex = selectedDotIndex;
            const currentItems = this.banners;
            this._banners = this.slideCarouselToIndex(currentItems, this.currentSlideIndex);
        }
    }
    disableInteraction() {
        this.moving = true;
    
        window.setTimeout(()=>{
         this.moving = false
        }, 500);
    }
    
    /*
    * Format payload of items according to current order of classes
    */
    slideCarouselToIndex(items, currentIndex = 0) {
        this.disableInteraction();
        return items.map((item, index) => ({
            ...item,
            index:index,
            current: index === currentIndex,
            className: this.getClassNameToBanner(items.length, index, currentIndex)
        }));
    }

    /*
    * Evaluate and assign class name to current slide
    */
    getClassNameToBanner(total, index, currentIndex) {
        const lastIndex = total - 1;
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : lastIndex;
        const nextIndex = Number(currentIndex) === lastIndex ? 0 :  Number(currentIndex) +1;
        switch ( Number(index) ) {
            case prevIndex:
                return `${ItemClassName} ${PREV}`;
                break;
            case currentIndex:
                return `${ItemClassName} ${ACTIVE}`;
                break;
            case nextIndex:
                return `${ItemClassName} ${NEXT}`;
                break;
            default:
                return `${ItemClassName}`;
                break;
        }
    }
   
}