let cart = [];
let modalQt = 1;
let modalKey = 0;

const c = (elemento)=>document.querySelector(elemento); // shortening the .querySelector
const cs = (elemento)=>document.querySelectorAll(elemento); // shortening the .querySelectorAll

// List of pizzas
pizzaJson.map(
    (item, index) => {

       let pizzaItem = c('.models .pizza-item').cloneNode(true); // clone the model

       pizzaItem.setAttribute('data-key', index); 

       //Showing the pizza data on the screen
       pizzaItem.querySelector('.pizza-item--img img').src = item.img; 
       pizzaItem.querySelector('.pizza-item--price').innerHTML = `$ ${item.price.toFixed(2)}`; 
       pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name; 
       pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description; 

       //Modal pizza display when clicking on pizza
       pizzaItem.querySelector('a').addEventListener('click', (e) => {
          e.preventDefault(); //Block the default action

          let key = e.target.closest('.pizza-item').getAttribute('data-key') //Get the id when clicking on the pizza
          
          modalQt = 1;
          modalKey = key;
          
          //Showing the pizza data when clicking on the pizza
          c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
          c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description; 
          c('.pizzaInfo--actualPrice').innerHTML = `$: ${pizzaJson[key].price.toFixed(2)}`; 
          c('.pizzaBig img').src = pizzaJson[key].img; 
          c('.pizzaInfo--size.selected').classList.remove('selected');
          cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
              if(sizeIndex == 2){
                  size.classList.add('selected'); //Always select the large option
              }
              size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];       
          });

          c('.pizzaInfo--qt').innerHTML = modalQt; // reset the quantity when leaving the box

          //Box effect gradually coming on the screen
          c('.pizzaWindowArea').style.opacity = 0;

          setTimeout(()=>{
            c('.pizzaWindowArea').style.opacity = 1; 
          }, 200)
          
          c('.pizzaWindowArea').style.display ='flex'; 
      }); 
      //print the template on the screen
       c('.pizza-area').append(pizzaItem);   
    }
);

//Modal Event

//Function for close modal
function closeModal(){
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
        c('.pizzaWindowArea').style.display ='none'; 
    }, 500);
}
//Close the modal
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
})
//Increase the amount of pizza that the person wants in the modal
c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1){
        modalQt--;
    c('.pizzaInfo--qt').innerHTML = modalQt;
    }
});

c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});
//Select the size of the pizza
cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', (e)=>{
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    })
});
// Add to cart
c('.pizzaInfo--addButton').addEventListener('click', () => {
    let size =  parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));

    let identifier = pizzaJson[modalKey].id+'@'+size; //Creating Id for pizzas that have the same flavor and same size

    let key = cart.findIndex((item) => item.identifier == identifier); // return the id identifier

    // The pizza code of the same flavor and size increase the quantity and not another item of the cart
    if(key > -1){
        cart[key].qt += modalQt; 

    } else {
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size: size,
            qt: modalQt
        });
    }
    updateCart();
    closeModal();
});
c('.menu-openner').addEventListener('click', () => {
    if(cart.length > 0) {
        c('aside').style.left = '0';
    }
});
c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = '100vw';
});
//Show the cart when adding the item
function updateCart(){
    c('.menu-openner span').innerHTML = cart.length; // Mobile Function

    if(cart.length > 0 ){
        c('aside').classList.add('show');
        c('.cart').innerHTML="";

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart){

            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id); // retornar o id da pziza adicionada ao carrinho
            subtotal += pizzaItem.price * cart[i].qt;

            let cartItem = c('.models .cart--item').cloneNode(true); //clone the model

            // Taking the size of the pizza and adding it with the name
            let pizzaSizeName;
            switch(cart[i].size) {
                case 0:
                    pizzaSizeName = 'S';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'B';
                    break;
            }
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;  

            // Printing data from pizzas in the cart
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

            //Adding and decreasing pizzas by the cart
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if(cart[i].qt > 1){
                    cart[i].qt--;
                }else{
                    cart.splice(i, 1); //Taking the item itself out of the cart
                }
                updateCart();
            });

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                updateCart();
            });

            // print the template on the screen
            c('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `$ ${total.toFixed(2)}`;

    } else{
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
}