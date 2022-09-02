import { LightningElement, api, track } from 'lwc';

const SAMPLE_DATA = [
    {
        order: 1,
        image: 'http://placekitten.com/g/1600/900',
        className: 'carousel__photo'
    },
    {
        order: 3,
        image: 'http://placekitten.com/1600/900',
        className: 'carousel__photo'
    },
    {
        order: 3,
        image: 'http://placekitten.com/g/1600/900',
        className: 'carousel__photo'
    }
];


export default class Carousel extends LightningElement { 

    slidesContainer;
    slide;
    slides;
    totalSlides = 2;
    totalWidth = 1450;
    rendered = false;

    currentSlide;
    itemClassName = "carousel__photo";
    moving = false;
    @track items = [];
    @track _banners = [];
    renderedCallback() {
        if (!this.rendered) {
        
            this.items = this.template.querySelectorAll(`.${this.itemClassName}`);
            this.totalSlides = this.items.length;
   
            this.currentSlide = 0;
            this.moving = false; 
            this.setInitialClasses();
            
            this.slidesContainer = this.template.querySelector('.slides-container');
            this.slides = this.template.querySelectorAll('.slide');

        
            this.slide = this.template.querySelector('.slide');
            const slideWidth = this.slide.clientWidth;
    
            this.rendered = true;
        }
    }
    get banners() {
        return this._banners;
    }
    initCarousel() { 
        this.moving = false;
    }
    setInitialClasses() {
        this.items[this.totalSlides - 1].classList.add("prev");
        this.items[0].classList.add("active");
        this.items[1].classList.add("next");
    }

    handleForward() {
        // Check if moving
        if (!this.moving) {

        // If it's the last slide, reset to 0, else +1
        if (this.currentSlide === (this.totalSlides - 1)) {
            this.currentSlide = 0;
        } else {
            this.currentSlide++;
        }
           
        // Move carousel to updated slide
        this.moveCarouselTo(this.currentSlide);
      }
    }

    handlePrevious() {
         // Check if moving
        if (!this.moving) {

        // If it's the first slide, set as the last slide, else -1
        if (this.currentSlide === 0) {
            this.currentSlide = (this.totalSlides - 1);
        } else {
            this.currentSlide--;
        }
  
        // Move carousel to updated slide
        this.moveCarouselTo(this.currentSlide);
      }
    }
    disableInteraction() {
        this.moving = true;
    
        window.setTimeout(()=>{
         this.moving = false
        }, 500);
    }

    // Scroll Carousel
    handleNext() {
        const slideWidth = this.slide.clientWidth;
        const maxScrollLeft = this.slidesContainer.scrollWidth - this.slide.offsetWidth;
        if(this.slidesContainer.scrollLeft <  maxScrollLeft){
            this.slidesContainer.scrollLeft += slideWidth;
        }
        else {
            this.slidesContainer.scrollLeft = 0
        }
    }
    handleScroll(event) { 
       // const currentLeft = event.target.scrollX;
        const slideWidth = this.slide.offsetWidth;
        const containerWidth = this.slidesContainer.scrollWidth ;
        // const max = (this.totalSlides - 1) * slideWidth;
        const maxScrollLeft = containerWidth - slideWidth -1.34;
        console.log('maxScrollLeft:' +maxScrollLeft);
        if(this.slidesContainer.scrollLeft ===  maxScrollLeft){
            this.slidesContainer.scrollLeft = 0;
            console.log('scrollWidth:' +this.slidesContainer.scrollLeft);
        }
        else if(this.slidesContainer.scrollLeft <= 2 ) {
            this.slidesContainer.scrollLeft = maxScrollLeft;
        }
    }
    handleBack(){
        const slideWidth = this.slide.clientWidth;
        this.slidesContainer.scrollLeft -= slideWidth;
        this.slide.style.transition = 'opacity 100ms';
    }


    moveCarouselTo(slide) {
        if(!this.moving) {
          // temporarily disable interactivity
          this.disableInteraction();
          const totalItems = this.totalSlides;
          let newPrevious = slide - 1,
              newNext = slide + 1,
              oldPrevious = slide - 2,
              oldNext = slide + 2;
            
        
          // Test if carousel has more than three items
          if ((totalItems - 1) > 3) {
            if (newPrevious <= 0) {
                oldPrevious = (totalItems - 1);
            } else if (newNext >= (totalItems - 1)){
                oldNext = 0;
            }
    
            // Check if current slide is at the beginning or end and sets slide numbers
            if (slide === 0) {
                newPrevious = (totalItems - 1);
                oldPrevious = (totalItems - 2);
                oldNext = (slide + 1);
            } else if (slide === (totalItems -1)) {
                newPrevious = (slide - 1);
                newNext = 0;
                oldNext = 1;
            }
    
            // Based on the current slide, reset to default classes.
            this.items[oldPrevious].className = this.itemClassName;
            this.items[oldNext].className = this.itemClassName;
    
            // Add the new classes
            this.items[newPrevious].className = this.itemClassName + " prev";
            this.items[slide].className = this.itemClassName + " active";
            this.items[newNext].className = this.itemClassName + " next";
          }
        }
    }
    

}