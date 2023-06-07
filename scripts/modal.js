window.setupOrderModal = function setupOrderModal() {
    const modal = createModal();
    const closeBtn = createCloseButton();
    modal.appendChild(closeBtn);

    document.body.appendChild(modal);

    modal.style.display = 'block';

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (event) => {
        if (event.target === modal || event.target.classList.contains('close')) {
            modal.style.display = 'none';
        }
    });
    
    const storedData = localStorage.getItem('formData');
    if (storedData) {
        const formData = JSON.parse(storedData);

        document.getElementById('nameInput').value = formData.name;
        document.getElementById('telInput').value = formData.phone;

        const paymentButtons = document.querySelectorAll('.input-btns button');
        paymentButtons.forEach(function (btn) {
            if (btn.textContent === formData.paymentMethod) {
                btn.classList.add('clicked');
            } else {
                btn.classList.remove('clicked');
            }
        });

        document.getElementById('emailInput').value = formData.email;
        document.getElementById('addressInput').value = formData.address;
        document.getElementById('promoInput').value = formData.promo;
        document.getElementById('commentInput').value = formData.comment;
    }
} //creates the modal element using the createModal() function, appends a close button to the modal, and adds event listeners to close the modal when the close button or the modal itself is clicked. It also retrieves stored form data from localStorage and populates the form fields if data exists.

function createModal() {
  const modal = document.createElement('div');
  modal.id = 'orderModal';
  modal.classList.add('modal');

  modal.innerHTML = `
    <div class="modal-content_order">
      <span class="close">&times;</span>
      <h2>Order Form</h2>
      <form id="orderForm">
        <input type="text" id="nameInput" name="nameInput" placeholder="Name" required>
        <input type="tel" id="telInput" name="telInput" placeholder="Phone" required>
        <div class="input-btns">
          <button class="cash-btn" onclick="changeColor(this)">Cash</button>
          <button class="card-btn" onclick="changeColor(this)">Card</button>
        </div>
        <input type="email" id="emailInput" name="emailInput" placeholder="Enter Your Email" required>
        <input type="text" id="addressInput" name="addressInput" placeholder="Address" required>
        <label for="promo" class="text">Write Here Your Promo:</label>
        <input type="text" id="promoInput" name="promoInput" placeholder="Promo">
        <label for="comment" class="text">If You Have Any Specific Wishes - Write Below</label>
        <input type="text" id="commentInput" name="commentInput" placeholder="Comment">
        <button id="submitOrder" type="submit">Submit Order</button>
      </form>
    </div>
  `;

  return modal;
}//creates the order form modal element.

function createCloseButton() {
  const closeBtn = document.createElement('span');
  closeBtn.classList.add('close');
  closeBtn.innerHTML = '&times;';

  return closeBtn;
}

function changeColor(button) {
  let buttons = document.querySelectorAll('.input-btns button');

  buttons.forEach(function(btn) {
    btn.classList.remove("clicked");
  });
  
  button.classList.add("clicked");
}
function closeModal() {
    const modal = document.getElementById('orderModal');
    modal.style.display = 'none';
  }
function handleSubmit(event) {
    event.preventDefault();
    alert('Order submitted successfully!');
    storeFormData();
    closeModal();
  }
function storeFormData() {
    const name = document.getElementById('nameInput').value;
    const phone = document.getElementById('telInput').value;
    const paymentMethod = document.querySelector('.input-btns button.clicked').textContent;
    const email = document.getElementById('emailInput').value;
    const address = document.getElementById('addressInput').value;
    const promo = document.getElementById('promoInput').value;
    const comment = document.getElementById('commentInput').value;
  
    const formData = {
      name: name,
      phone: phone,
      paymentMethod: paymentMethod,
      email: email,
      address: address,
      promo: promo,
      comment: comment
    };
  
    localStorage.setItem('formData', JSON.stringify(formData));
  }