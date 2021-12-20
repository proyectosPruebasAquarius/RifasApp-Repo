/*const addToCart = document.querySelectorAll('.addCart');
addToCart.forEach((buttonAdd) => {
    buttonAdd.addEventListener('click', buttonClik);
});
const saleCart = document.querySelector('.pagar');
saleCart.addEventListener('click', cartSale);

const cartItemsContainer = document.querySelector('.dropdown-cart-products');
const cartButtonsContainer = document.querySelector('.dropdown-cart-action');
const cartItemCount = document.querySelector('.cart-count');
const cartItemText = document.querySelector('.cart-txt');
const cartItemEmpty = document.querySelector('.empty');
const ButtonPay = document.getElementById('pagar');
const ButtonSee = document.getElementById('ver');


function buttonClik(event) {
    const button = event.target;
    const item = button.closest('.product');
    const itemTitle = item.querySelector('.product-title').textContent;
    const itemImg = item.querySelector('.product-image').src;
    const itemPrice = item.querySelector('.product-price').textContent;


    AddItem(itemTitle, itemImg, itemPrice)
}

function AddItem(itemTitle, itemImg, itemPrice) {
    //Guardando link de la imagen
    localStorage.setItem('imagen', itemImg);
    itemImg = localStorage.getItem('imagen');

    //Guardando el titulo de la rifa
    localStorage.setItem('title', itemTitle);
    itemTitle = localStorage.getItem('title');

    //contador de productos
    var count = parseInt(cartItemCount.textContent);
    localStorage.setItem('count', count);
    count = Number(localStorage.getItem('count'));

    //Precio de la rifa seleccionada
    var priceItem = itemPrice.replace('$', '');
    priceItem = Number(priceItem);
    localStorage.setItem('Precio', priceItem);
    priceEmpty = localStorage.getItem('Precio');

    //Precio que esta estatica
    var priceEmpty = cartItemText.textContent.replace('$', '');
    priceEmpty = Number(priceEmpty);
    var price = priceEmpty + priceItem;
    localStorage.setItem('PrecioText', price);
    price = localStorage.getItem('PrecioText');


    cartItemText.innerHTML = `$${price}.00`;
    const cartRow = document.createElement('div');


    var cartContent = `
    <div class="product">
        <div class="product-cart-details">
            <h4 class="product-title">
                <a href="product.html">${itemTitle}</a></h4>

            <span class="cart-product-info">
              <span class="cart-product-qty">1</span> x ${itemPrice}
            </span>
            </div>
                                       

        <figure class="product-image-container">
            <a href="product.html" class="product-image">
            <img src="${itemImg}" alt="product">
            </a>
            </figure>
            <a href="#" class="btn-remove" title="Remove Product"><i class="icon-close"></i></a>
        </div>
        
    `;
    localStorage.setItem('content', cartContent);
    cartContent = localStorage.getItem('content');

    cartItemEmpty.innerHTML = '';
    cartItemCount.innerHTML = count + 1;
    ButtonPay.classList.remove('disabled');
    ButtonSee.classList.remove('disabled');
    //productos
    cartRow.innerHTML = cartContent;
    cartItemsContainer.append(cartRow);




    cartRow.querySelector('.btn-remove').addEventListener('click', removeItem);

}

function removeItem(event) {




    const buttonClicked = event.target;
    buttonClicked.closest('.product').remove();
    var priceEmpty = cartItemText.textContent.replace('$', '');
    priceEmpty = Number(priceEmpty);
    priceEmpty = priceEmpty - 5;
    cartItemText.innerHTML = `$${priceEmpty}.00`;
    var count = parseInt(cartItemCount.textContent);
    cartItemCount.innerHTML = count - 1;


}


function cartSale() {

    cartItemsContainer.innerHTML = '';
    cartItemCount.innerHTML = '0';
    cartItemText.innerHTML = '$0.00';
    cartItemEmpty.innerHTML = 'Carrito Vacio';
    ButtonPay.classList.add('disabled');
    ButtonSee.classList.add('disabled');
    

}*/