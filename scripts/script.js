import { hideSlides, animateCards, addToCartClicked, updateProductPage, createButtonsContainer } from "./functions.js";

export class Router {
  data;

  constructor(pathToProducts, selectorContainer, linksMenu, categoryContainer) {
    this.container = document.querySelector(selectorContainer);
    this.menuLinks = document.querySelectorAll(linksMenu);
    this.categoryContainer = document.querySelector(categoryContainer);

    this.createNavigation();
    this.showCategory();
    this.setupCardButtonClickHandler();
    this.takeData(pathToProducts);
  }

  createNavigation() {
    this.addNavigationEvent('.submenu__small[data-category]');
    this.addNavigationEvent('nav a');
    this.addNavigationEvent('.sliders-second__button[data-category]');
  
    const sortSelect = document.querySelector('#sort-select');
    sortSelect.addEventListener('change', () => {
      const selectedOption = sortSelect.value;
      this.createCards(this.sortProductsByPrice(selectedOption));
    });
  }//sets up the navigation functionality by adding click event listeners to various navigation elements.

  addNavigationEvent(selector) {
    const links = document.querySelectorAll(selector);
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const category = link.dataset.category;
        this.navigateToCategory(category);
        hideSlides();
        
      });
    });
  }//adds a click event listener to the elements selected by the given selector. When clicked, it prevents the default action, retrieves the category from the data attribute, and navigates to the corresponding category by calling the navigateToCategory() method.
  
  sortProductsByPrice(selectedOption) {
    const products = [...this.data];
    if (selectedOption === '1') {
      return products.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else if (selectedOption === '2') {
      return products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    }
    return products;
  }

  showCategory() {
    if (location.hash.substring(1)) {
      this.categoryContainer.style.display = "block";
      this.categoryContainer.querySelector("h1").innerHTML = `${decodeURIComponent(
        location.hash
      ).substring(1)}`;
      const catalogCards = document.querySelector('.catalog__cards');
      const productPage = document.querySelector('.product-page');
      const catalogHeader = document.querySelector('.catalog-header');
      catalogCards.style.display = "flex";
      catalogHeader.style.display = "flex";
      productPage.style.display = "none";
    } else {
      this.categoryContainer.style.display = "none";
      const catalogCards = document.querySelector('.catalog__cards');
      catalogCards.style.display = "none";
    }
  }

  createCards(products) {
    this.container.innerHTML = "";
    let cards = [];
    products.forEach((product) => {
      if (`#${encodeURIComponent(product.rating.category)}` === location.hash) {
        const card = `
          <div class="catalog__cards__card" fade-in data-category="${encodeURIComponent(product.rating.category)}">
            <img src="${product.image}" alt="">
            <b class="catalog-title">${product.title}</b>
            <br>
            <span class="card-rate">${product.rating.rate} | ${product.rating.count}</span>
            <hr>
            <span class="card__price">${product.price} ${product.currency}</span>
            <button class="btn-card">BUY</button>
          </div>
        `;
        cards.push(card);
        this.container.insertAdjacentHTML("beforeend", card);
      }
    });
    
    localStorage.setItem('cards', JSON.stringify(cards));
    animateCards();
    this.setupCardButtonClickHandler();
  }//creates the catalog cards based on the selected category

  addEventListenersToButtons() {
    const addToCartButtons = document.querySelectorAll('.btn-card');

    addToCartButtons.forEach((button) => {
      button.addEventListener('click', addToCartClicked());
    });
  }//It adds click event listeners to the "BUY" buttons in the catalog cards. It triggers the addToCartClicked() function and createSlider() function.

  navigateToCategory(category) {
    location.hash = category;
    this.categoryContainer.querySelector("h1").innerHTML = category.toUpperCase();
    this.createCards(this.data);
    this.showCategory();
    animateCards();
        const navigation = document.querySelector('.navigation');
    let screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (screenWidth < 480) {
      navigation.style.display = 'none';
    }
  }//navigates to the specified category by updating the URL hash, updating the category container's heading, creating the cards for the selected category, and animating the cards.
  
  createTopSlider(data) {
    const sliderContainer = document.getElementById('slider_cards');
    sliderContainer.innerHTML = '';
  
    for (let i = 0; i < 3; i++) {
      const product = data[i];
  
      const card = `
        <div class="slider__card">
          <img src="${product.image}" alt="">
          <h2>${product.title}</h2>
          <br>
          <h4>700 UAH</h4>
          <h1>${product.price} ${product.currency}</h1>
          <button class="banner__btn" data-category="Sets">I Want It, NOW</button>
        </div>
      `;
  
      sliderContainer.insertAdjacentHTML('beforeend', card);
    }

    $('.slider_cards').slick({
      dots: true,
      arrows: false,
      dotsClass: 'slick-dots custom-dots'
    });
  
    this.setupCardButtonClickHandler();
    this.addNavigationClickEvent();
  }

  takeData(path) {
    fetch(path)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        this.data = data.menu;
        this.createCards(this.data);
        this.createSliders(this.data); 
      });
  }

  setupCardButtonClickHandler() {
    this.container.addEventListener("click", (e) => {
      if (e.target.tagName === "BUTTON" || e.target.tagName === "A") {
        e.preventDefault();
        const container = document.querySelector(".catalog__cards");
        const selectedDiv = e.target.closest(".catalog__cards__card");
        const selectedDivHTML = selectedDiv.outerHTML;
        const category = encodeURIComponent(selectedDiv.dataset.category);
        const productTitle = encodeURIComponent(selectedDiv.querySelector(".catalog-title").textContent);
  
        localStorage.setItem("selectedDiv", selectedDivHTML);
        localStorage.setItem("selectedCategory", category);
  
        const currentURL = window.location.href;
        const baseURL = currentURL.split('#')[0];
        const newHash = `${category}/${productTitle}`;
        const newURL = `${baseURL}#${newHash}`;
        window.location.assign(newURL);
  
        updateProductPage();
        createButtonsContainer();
        container.style.display = "none";
      }
    });
  }//When the button is clicked, it prevents the default action, retrieves information about the selected product (such as category, title), and stores it in the localStorage. It also updates the URL hash, calls the updateProductPage() function, creates the buttons container, and hides the catalog cards container.

  createSliders(data) {
    const sliderContainer = document.getElementById('slider_cards');
    sliderContainer.innerHTML = '';
  
    for (let i = 0; i < 3; i++) {
      const product = data[i];

      const card = `
        <div class="slider__card">
          <img src="${product.image}" alt="">
          <h2>${product.title}</h2>
          <br>
          <h4>700 UAH</h4>
          <h1>${product.price} ${product.currency}</h1>
          <button class="banner__btn" data-category="Sets">I Want It, NOW</button>
        </div>
      `;
  
      sliderContainer.insertAdjacentHTML('beforeend', card);
    }

    $('.slider_cards').slick({
      dots: true,
      arrows: false,
      dotsClass: 'slick-dots custom-dots'
    });
  
    this.setupCardButtonClickHandler();
    this.addNavigationClickEvent();
  }

  addNavigationClickEvent() {
    const buttons = document.querySelectorAll('.sliders-second__button, .banner__btn');
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const category = e.target.dataset.category;
        const navigationLink = document.querySelector(`aside nav a[data-category="${category}"]`);
        if (navigationLink) {
          navigationLink.click();
        }
      });
    });
  }//adds a click event listener to elements with the class "sliders-second__button" and "banner__btn". When clicked, it prevents the default action, retrieves the category from the dataset, and finds the corresponding navigation link element.
}

export const router = new Router(
  'https://run.mocky.io/v3/4293aeeb-ee99-40ba-884a-557796b57b27', 
  '.catalog__cards',
  'aside nav a',
  '.catalog'
);

const navLinks = document.querySelectorAll('nav a');
navLinks.forEach(link => {
  link.addEventListener('click', hideSlides);
});

const authorSearch = document.getElementById('authorSearch');
authorSearch.addEventListener('keyup', e => {
  let currentValue = e.target.value.toLowerCase();
  let cards = document.querySelectorAll('.catalog__cards__card');
  cards.forEach(card => {
    let title = card.querySelector('.catalog-title');
    if (title.textContent.toLowerCase().includes(currentValue)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
});

