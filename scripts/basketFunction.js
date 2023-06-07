export function addCardItem(title, price, imageSrc, currency) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let cartItem = {
    title: title,
    price: parseFloat(price),
    currency: currency,
    imageSrc: imageSrc,
    quantity: 1
  };

  cart.push(cartItem);
  localStorage.setItem("cart", JSON.stringify(cart));
  cartRenderer.renderCard();

}//adds a new item to the shopping cart, adds the cart item to the cart array, saves the updated cart in localStorage, and triggers the renderCard() method of the CartRenderer class.


class CartRenderer {
  constructor() {
    this.cart = JSON.parse(localStorage.getItem("cart")) || [];
  }

  renderCard() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalPrice = this.calculateTotalPrice(cart);

    if (cart.length >= 1) {
      this.hideDefaultCartInfo(cart);

      const cartItemsContainer = document.getElementsByClassName('basket-choose_user')[0];
      cartItemsContainer.innerHTML = '';

      cart.forEach((cartItem, index) => {
        this.renderCardItem(cartItem, index, cartItemsContainer);
      });

      const defaultCartTitle = document.createElement('h3');
      defaultCartTitle.textContent = 'Basket';
      cartItemsContainer.prepend(defaultCartTitle);

      const cartFooter = document.createElement('div');
      cartFooter.classList.add('basket-footer__update');
      const cartFooterContent = `
        <span class="basket-footer__price-total">${totalPrice.toFixed(2)} UAH</span>
        <button class="basket-footer__button" onclick="setupOrderModal()">Create Order</button>
      `;
      cartFooter.innerHTML = cartFooterContent;
      cartItemsContainer.append(cartFooter);
    }
  }//Renders the cart items in the DOM. It first calculates the total price of the items, hides the default cart information if there are items in the cart, clears the cart items container, and then iterates over each cart item, calling the renderCardItem() method for rendering each item.

  renderCardItem(cartItem, index, cartItemsContainer) {
    if (!cartItem)
      return;

    const cartRow = document.createElement('div');
    cartRow.classList.add('cart-basket');

    const cartBasketContent = `
      <div class="basket-info">
        <div class="basket-item">
          <img class="basket-item-image" src="${cartItem.imageSrc}">
          <span class="basket-item-title">${cartItem.title}</span>
        </div>
        <div class="quantity-price">
          <div class="quantity basket-column">
            <button class="plus-btn" type="button">+</button>
            <input type="number" class="basket-quantity-input" name="quantity" min="1" max="10" value="${cartItem.quantity}" data-quantity="${cartItem.quantity}">
            <button class="minus-btn" type="button">-</button>
          </div>
          <span class="basket-price">${cartItem.price} UAH</span>
        </div>
      </div>
    `;

    cartRow.innerHTML = cartBasketContent;
    cartItemsContainer.append(cartRow);
    const plusButton = cartRow.querySelector('.plus-btn');
    const minusButton = cartRow.querySelector('.minus-btn');
    const quantityInput = cartRow.querySelector('.basket-quantity-input');

    plusButton.addEventListener('click', () => {
      let currentValue = parseInt(quantityInput.value);
      if (currentValue < 10) {
        quantityInput.value = currentValue + 1;
        this.updatePriceTotal(this.cart);
      }
    });

    minusButton.addEventListener('click', () => {
      let currentValue = parseInt(quantityInput.value);

      if (currentValue <= 0) {
        this.removeCartItem(index);
      } else {
        quantityInput.value = currentValue - 1;
        this.updatePriceTotal(this.cart);
      }
    });

    quantityInput.addEventListener('change', () => {
      let currentValue = parseInt(quantityInput.value);

      if (currentValue < 1 || isNaN(currentValue)) {
        quantityInput.value = 1;
      } else if (currentValue > 10) {
        quantityInput.value = 10;
      }

      this.updatePriceTotal();
    });
  }//Renders an individual cart item. It creates the HTML structure for the item and appends it to the cart items container.

  updatePriceTotal() {
    const cartItems = document.querySelectorAll('.cart-basket');
    let totalPrice = 0;
  
    cartItems.forEach((cartItem, index) => {
      const quantityInput = cartItem.querySelector('.basket-quantity-input');
      const quantity = parseInt(quantityInput.value);
      const price = parseFloat(this.cart[index]?.price); // Додаємо '?'
      if (price) { // Додаємо перевірку на визначення ціни
        const itemTotalPrice = quantity * price;
        totalPrice += itemTotalPrice;
        this.cart[index].quantity = quantity;
      }

      const totalPriceElement = document.querySelector('.basket-footer__price-total');
      totalPriceElement.textContent = totalPrice.toFixed(2);
    });
  
    document.querySelector('.basket-footer__price-total').textContent = totalPrice.toFixed(2);
  }

  removeCartItem(index) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    this.renderCard();
  }

  calculateTotalPrice(cart) {
    let totalPrice = 0;

    cart.forEach(cartItem => {
      const quantity = cartItem.quantity;
      const price = cartItem.price;
      totalPrice += quantity * price;
    });

    return totalPrice;
  }

  hideDefaultCartInfo(cart) {
    const defaultCartInfo = document.querySelector('.basket-choose_user_info');
    if (defaultCartInfo && cart.length >= 1) {
      defaultCartInfo.style.display = 'none';
    }
  }//Hides the default cart information if there are items in the cart.
}

const cartRenderer = new CartRenderer();
cartRenderer.renderCard();

