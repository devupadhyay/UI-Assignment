$.fn.productList = function (options) {
    let _self = this;
    _self.html('');
    options.productList.forEach(function (d) {
        _self.append(`<div class="col-4">
                        <div class="item-list">
                            <div class="product-img-wrap d-flex align-items-center justify-content-center">
                                <img src="${d.image}" class="product-img" alt="${d.name}" title="${d.name}" />
                            </div>
                            <div class="item-info">
                                <span class="item-count">${d.name}</span>
                                <div class="d-flex align-items-center justify-content-between mob-break">
                                    <div class="item-price d-flex">
                                        <strike style='color:red'><span class="old">$${d.price.display}</span></strike>
                                        <span class="ps600 new">$${d.price.actual}</span>
                                    </div>
                                    <button class="primary-action add-to-cart" data-image="${d.image}" data-name="${d.name}" data-price="${d.price.actual}" data-displayprice="${d.price.display}">Add to cart</button>
                                </div>
                            </div>
                            <span class="offer-note ps600">${d.discount}% Off</span>
                        </div>
                    </div>`);
    });

    var shoppingCart = (function () {
        // =============================
        // Private methods and propeties
        // =============================
        cart = [];

        // Constructor
        function Item(image, name, price, displayprice, count) {
            this.image = image;
            this.name = name;
            this.price = price;
            this.displayprice = displayprice;
            this.count = count;
        }

        // Save cart
        function saveCart() {
            sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
        }

        // Load cart
        function loadCart() {
            cart = JSON.parse(sessionStorage.getItem('shoppingCart'));
        }
        if (sessionStorage.getItem("shoppingCart") != null) {
            loadCart();
        }


        // =============================
        // Public methods and propeties
        // =============================
        var obj = {};

        // Add to cart
        obj.addItemToCart = function (image, name, price, displayprice, count) {
            for (var item in cart) {
                if (cart[item].name === name) {
                    cart[item].count++;
                    saveCart();
                    return;
                }
            }
            var item = new Item(image, name, price, displayprice, count);
            cart.push(item);
            saveCart();
        }
        // Set count from item
        obj.setCountForItem = function (name, count) {
            for (var i in cart) {
                if (cart[i].name === name) {
                    cart[i].count = count;
                    break;
                }
            }
        };

        // Remove item from cart
        obj.removeItemFromCart = function (image, name) {
            for (var item in cart) {
                if (cart[item].name === name) {
                    cart[item].count--;
                    if (cart[item].count === 0) {
                        cart.splice(item, 1);
                    }
                    break;
                }
            }
            saveCart();
        }

        // Remove all items from cart
        obj.removeItemFromCartAll = function (image, name) {
            for (var item in cart) {
                if (cart[item].name === name) {
                    cart.splice(item, 1);
                    break;
                }
            }
            saveCart();
        }

        // Clear cart
        obj.clearCart = function () {
            cart = [];
            saveCart();
        }

        // Count cart 
        obj.totalCount = function () {
            var totalCount = 0;
            for (var item in cart) {
                totalCount += cart[item].count;
            }
            return totalCount;
        }

        // Total cart
        obj.totalCart = function () {
            var totalCart = 0;
            for (var item in cart) {
                totalCart += cart[item].price * cart[item].count;
            }
            return Number(totalCart.toFixed());
        }

        // Total display cart
        obj.totalDisplayCart = function () {
            var totalDisplayCart = 0;
            for (var item in cart) {
                totalDisplayCart += cart[item].displayprice * cart[item].count;
            }
            return Number(totalDisplayCart.toFixed());
        }

        // List cart
        obj.listCart = function () {
            var cartCopy = [];
            for (i in cart) {
                item = cart[i];
                itemCopy = {};
                for (p in item) {
                    itemCopy[p] = item[p];
                }
                itemCopy.total = Number(item.price * item.count).toFixed();
                cartCopy.push(itemCopy)
            }
            return cartCopy;
        }

        // cart : Array
        // Item : Object/Class
        // addItemToCart : Function
        // removeItemFromCart : Function
        // removeItemFromCartAll : Function
        // clearCart : Function
        // countCart : Function
        // totalCart : Function
        // listCart : Function
        // saveCart : Function
        // loadCart : Function
        return obj;
    })();


    // *****************************************
    // Triggers / Events
    // ***************************************** 

    // Add animation
    function anim() {
        setTimeout(function () {
            // toggle another class
            $('.item-add-msg').removeClass('show');
        }, 1000)
    }

    // Add item
    $(document).find('.add-to-cart').click(function (event) {
        // $('.item-add-msg').addClass('show');
        event.preventDefault();
        var name = $(this).data('name');
        $('.item-add-msg').html(`${name} is added to cart`).addClass('show');
        var price = Number($(this).data('price'));
        var displayprice = Number($(this).data('displayprice'));
        var image = $(this).data('image');
        shoppingCart.addItemToCart(image, name, price, displayprice, 1);
        displayCart();
        anim();
    });

    // Clear items
    $('.clear-cart').click(function () {
        shoppingCart.clearCart();
        displayCart();
    });


    function displayCart() {
        var cartArray = shoppingCart.listCart();
        let counter = 0;
        for (let obj of cartArray) {
            if (obj.name != '') counter++;
        }
        var output = `<thead>
                        <tr>
                            <th>Items(${counter})</th>
                            <th>Qty(${shoppingCart.totalCount()})</th>
                            <th>Price</th>
                        </tr>
                    </thead>`;
        for (var i in cartArray) {
            output += "<tr>"
                + "<td><div class='items-replica d-flex align-items-center justify-content-between'><div class='d-flex align-items-center' title='" + cartArray[i].name + "'><img class='product-img sm' src='" + cartArray[i].image + "' alt='" + cartArray[i].name + "' /><span>" + cartArray[i].name + "</span></div><span class='delete-item remove-item' data-name='" + cartArray[i].name + "'>×</span></div></td>"
                + "<td><div class='qty-options d-flex align-items-center justify-content-center'><span class='minus-item' data-name='" + cartArray[i].name + "'>-</span><input type='number' class='item-count' data-name='" + cartArray[i].name + "' value='" + cartArray[i].count + "' /><span class='plus-item' data-name='" + cartArray[i].name + "'>+</span></div>"
                + "<td>$" + cartArray[i].total + "</td>"
                + "</tr>";
        }
        $('.show-cart').html(output);
        if (counter === 0) {
            $('.show-cart').html('');
            $('#order-details').html('');
        } else {
            $('#order-details').html(`<h4>Total</h4>
                                    <ul>
                                        <li class="row no-gutters">
                                            <span class="col">Items(${counter})</span>
                                            <span>:</span>
                                            <span class="col text-right">$${shoppingCart.totalCart()}</span>
                                        </li>
                                        <li class="row no-gutters">
                                            <span class="col">Discount</span>
                                            <span>:</span>
                                            <span class="col text-right">-$${shoppingCart.totalDisplayCart() - shoppingCart.totalCart()}</span>
                                        </li>
                                        <!-- <li class="row no-gutters">
                                            <span class="col">Type Discount</span>
                                            <span>:</span>
                                            <span class="col text-right">-$0</span>
                                        </li> -->
                                    </ul>
                                    <div class="order-total">
                                        <ul>
                                            <li class="row no-gutters">
                                                <span class="col">Order Total</span>
                                                <span>:</span>
                                                <span class="col text-right ps600">$${shoppingCart.totalCart()}</span>
                                            </li>
                                        </ul>
                                    </div>`);
        }
    }

    // Delete item button

    $('.show-cart').on("click", ".delete-item", function (event) {
        var image = $(this).data('image');
        var name = $(this).data('name');
        shoppingCart.removeItemFromCartAll(image, name);
        displayCart();
    })


    // -1
    $('.show-cart').on("click", ".minus-item", function (event) {
        var image = $(this).data('image');
        var name = $(this).data('name');
        shoppingCart.removeItemFromCart(image, name);
        displayCart();
    })

    // +1
    $('.show-cart').on("click", ".plus-item", function (event) {
        var image = $(this).data('image');
        var name = $(this).data('name');
        shoppingCart.addItemToCart(image, name);
        displayCart();
    })

    // Item count input
    $('.show-cart').on("change", ".item-count", function (event) {
        var name = $(this).data('name');
        var count = Number($(this).val());
        shoppingCart.setCountForItem(name, count);
        displayCart();
    });

    displayCart();

    // return the widget object
    return _self;
}