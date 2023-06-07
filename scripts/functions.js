import { addCardItem } from "./basketFunction.js";

export function hideSlides() {
  const elementsToHide = ['#slider_cards', '.sliders__second', '.promo__slides', '.submenu'];

    elementsToHide.forEach(selector => {
      const element = document.querySelector(selector);
      const navigation = document.querySelector('.navigationBlock');
      let screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

      if (element) {
        element.style.display = 'none';
      }
      if (screenWidth < 480) {
          navigation.style.display = 'none';
      }
    });
}

export function animateCards() {
    const cards = document.querySelectorAll('.catalog__cards__card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('show-card');
      }, index * 100);
    });
}

export function addToCartClicked(event) {
    const button = event.target;
    const shopItem = button.parentElement;
    const title = shopItem.querySelector('.catalog-title').textContent;
    const price = shopItem.querySelector('.card__price').textContent;
    const imageSrc = shopItem.querySelector('img').src;

      // Виклик методу addCardItem з розширеними даними
    addCardItem(title, price, imageSrc);   
} //triggered when the "BUY" button is clicked on a catalog card. It retrieves the relevant information (title, price, image source) of the selected product and passes it to the addCardItem() function from basketFunction.js to add the item to the shopping cart.

export function updateProductPage() {
    const selectedDivHTML = localStorage.getItem("selectedDiv");
    const category = localStorage.getItem("selectedCategory");
    const productTitle = decodeURIComponent(window.location.hash.substring(1).split("/")[1]);
    const productPageContainer = document.querySelector(".selected-div-container");
    const productPage = document.querySelector('.product-page');
    const catalogHeader = document.querySelector('.catalog-header');
    const catalog = document.querySelector('.catalog');
    const recomended = document.querySelector(".recomended__cards__drinks");

    if (selectedDivHTML && category && productPageContainer) {
      productPage.style.display = "block";
      catalogHeader.style.display = "none";
      catalog.style.backgroundColor = "white";
      recomended.style.display = "block";

      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = selectedDivHTML;
  
      const image = tempDiv.querySelector("img").getAttribute("src");
      const title = tempDiv.querySelector(".catalog-title").textContent;
      const price = tempDiv.querySelector(".card__price").textContent;
      const currency = tempDiv.querySelector(".card__price").nextSibling.textContent.trim();
      const rate = tempDiv.querySelector(".card-rate").textContent;
    
      const cardHTML = `
        <div class="catalog__cards__card">
          <img src="${image}" alt="Product Image">
          <b class="">Great Choice!</b>
            <b class="catalog-title">${title}</b>
            <span class="card-rate rate-selected">${rate}</span>
            <hr>
            <p class="card__price price-selected">${price} ${currency}</p>
            <button class="btn-card btn-selected">BUY</button>
        </div>
      `;
      localStorage.setItem("cardHTML", cardHTML);
      productPageContainer.innerHTML = cardHTML;
      location.hash = category;
  
      const newHash = `${category}/${encodeURIComponent(productTitle)}`;
      const newURL = `${window.location.origin}${window.location.pathname}#${newHash}`;
      window.history.replaceState(null, null, newURL);
      const buyButton = productPageContainer.querySelector('.btn-card');
      buyButton.addEventListener('click', addToCartClicked);
    }
}//updates the product page based on the selected catalog card

export function createButtonsContainer() {
    const buttonsContainer = document.querySelector(".buttons-container");
    if (buttonsContainer) {
      // Remove previous "btn-box" containers if they exist
      const existingBtnBoxes = buttonsContainer.querySelectorAll(".card_of_product");
      existingBtnBoxes.forEach((btnBox) => {
        btnBox.remove();
      });
  
      const btnBox = document.createElement("div");
      btnBox.classList.add('card_of_product');
      const addButtonBox = `
        <div class="buttons-box">
          <button class="prev-btn">Previous</button>
          <button class="next-btn">Next</button>
        </div>
        <div class="content">
              <p>The delectable spread of culinary delights and tantalizing libations is a gastronomic paradise, a delightful fusion of flavors that will left your taste buds dancing with joy.</p>
          </div>
      `;
      btnBox.innerHTML = addButtonBox;
      buttonsContainer.append(btnBox);
  
      let container = document.querySelector(".selected-div-container");
      const prevButton = buttonsContainer.querySelector(".prev-btn");
      const nextButton = buttonsContainer.querySelector(".next-btn");
  
      const cards = JSON.parse(localStorage.getItem("cards"));
  
      let currentCardIndex = 0;
  
      function showCard(index) {
        currentCardIndex = index;
        container.innerHTML = cards[index];
        addEventListenersToButtons();
      }
  
      function showNextCard() {
        currentCardIndex++;
        if (currentCardIndex >= cards.length) {
          currentCardIndex = 0;
        }
        showCard(currentCardIndex);
      }
  
      function showPrevCard() {
        currentCardIndex--;
        if (currentCardIndex < 0) {
          currentCardIndex = cards.length - 1;
        }
        showCard(currentCardIndex);
      }
  
      function addEventListenersToButtons() {
        const addToCartButtons = document.querySelectorAll('.btn-card');
        addToCartButtons.forEach((button) => {
          button.addEventListener('click', addToCartClicked);
        });
      }
  
      prevButton.addEventListener("click", showPrevCard);
      nextButton.addEventListener("click", showNextCard);
    }
}// buttons container on the product page



  
