import { hideSlides, addToCartClicked } from "./functions.js";
import { router } from "./script.js";

fetchData('Pizza', createSlider, '.sliders-third');
fetchData('Sets', createSlider, '.sliders__second');

export function createSlider(items, containerSelector) {
  const sliderContainer = document.querySelector(containerSelector);
  let itemList = [];

  items.forEach(item => {
    const recommended = `
      <div class="slide-container">
        <img src="${item.image}" alt="" style="width: 203px;">
        <h3>${item.title}</h3>
        <p>${item.price} ${item.currency}</p>
        <div class="slide-footer">
          <h3>500 UAH</h3>
            <button class="sliders-second__button" ${encodeURIComponent(item.rating.category)}>I want this</button>
        </div>
      </div>
    `;
    itemList.push(recommended);
    sliderContainer.insertAdjacentHTML("beforeend", recommended);
  });

  $(sliderContainer).slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false,
    autoplaySpeed: 2000,
  });

  const buttons = sliderContainer.querySelectorAll('.sliders-second__button');
  buttons.forEach((button, index) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const category = items[index].rating.category;
      hideSlides();
      
      router.navigateToCategory(category);
    });
  });
}

export function fetchData(categoryName, renderSliders, selector) {
  fetch('https://run.mocky.io/v3/4293aeeb-ee99-40ba-884a-557796b57b27')
  .then(response => response.json())
  .then(data => {
    const filtered = data.menu.filter(item => item.rating.category === categoryName);
    renderSliders(filtered, selector)
  })
  .catch(error => console.log(error));
}

fetchData('Drinks', createSliderForDrinks, '.recomended__cards__drinks');

export function createSliderForDrinks(drinks, containerSelector) {
    const sliderContainer = document.querySelector(containerSelector);
  let drinksList = [];
  
    drinks.forEach(drink => {
      const recomended = `
        <div class="recomended__cards__card">
          <img src="${drink.image}" alt="">
          <b class="catalog-title">${drink.title}</b>
          <br>
          <span class="card__price">${drink.price} ${drink.currency}</span>
          <button class="btn-card">+</button>
        </div>
      `;
      drinksList.push(recomended);
      sliderContainer.insertAdjacentHTML("beforeend", recomended);
    });
  
      const screenWidth = window.innerWidth || document.documentElement.clientWidth;
      if (screenWidth >= 480) {
        $(sliderContainer).slick({
          slidesToShow: 3,
          slidesToScroll: 1,
          autoplay: true,
          arrows: false,
          autoplaySpeed: 2000,
        });
      } 
  
    addEventListenersToButtons();

    function addEventListenersToButtons() {
      const addToCartButtons = document.querySelectorAll('.btn-card');
      addToCartButtons.forEach((button) => {
        button.addEventListener('click', addToCartClicked);
      });
    }
}
  
