
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("product-search");
    const categoryFilter = document.getElementById("category-filter");
    const priceSort = document.getElementById("price-sort");
    const productGrids = document.querySelectorAll(".product-grid");

    // IMAGE LIGHTBOX ELEMENTS
    const lightbox = document.getElementById("image-lightbox");
    const lightboxImage = document.getElementById("lightbox-image");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const closeLightbox = document.getElementById("close-lightbox");

    // GET PRODUCT PRICE
    function getPrice(card) {
        const priceElement = card.querySelector(".price");

        if (!priceElement) {
            return 0;
        }

        const priceText = priceElement.textContent;
        const match = priceText.replace(/,/g, "").match(/\d+/);

        return match ? Number(match[0]) : 0;
    }

    // SEARCH, FILTER AND SORT PRODUCTS
    function filterAndSortProducts() {
        const searchText = searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";

        const selectedCategory = categoryFilter
            ? categoryFilter.value.toLowerCase()
            : "all";

        const sortOrder = priceSort
            ? priceSort.value
            : "default";

        productGrids.forEach(function (grid) {
            const cards = Array.from(
                grid.querySelectorAll(".product-card")
            );

            cards.forEach(function (card) {
                const productName = card.textContent.toLowerCase();
                const productCategory = (
                    card.dataset.category || ""
                ).toLowerCase();

                const matchesSearch = productName.includes(searchText);

                const matchesCategory =
                    selectedCategory === "all" ||
                    productCategory === selectedCategory;

                card.hidden = !(matchesSearch && matchesCategory);
            });

            if (sortOrder !== "default") {
                cards.sort(function (a, b) {
                    const priceA = getPrice(a);
                    const priceB = getPrice(b);

                    if (sortOrder === "low-high") {
                        return priceA - priceB;
                    }

                    return priceB - priceA;
                });

                cards.forEach(function (card) {
                    grid.appendChild(card);
                });
            }
        });

        document.querySelectorAll(".product-category").forEach(
            function (section) {
                const visibleCards = section.querySelectorAll(
                    ".product-card:not([hidden])"
                );

                section.hidden = visibleCards.length === 0;
            }
        );
    }

    if (searchInput) {
        searchInput.addEventListener("input", filterAndSortProducts);
    }

    if (categoryFilter) {
        categoryFilter.addEventListener(
            "change",
            filterAndSortProducts
        );
    }

    if (priceSort) {
        priceSort.addEventListener("change", filterAndSortProducts);
    }

    // OPEN ENLARGED PRODUCT IMAGE
    document.querySelectorAll(".product-card img").forEach(
        function (image) {
            image.addEventListener("click", function () {
                if (!lightbox || !lightboxImage) {
                    return;
                }

                lightboxImage.src = image.src;
                lightboxImage.alt = image.alt;

                if (lightboxCaption) {
                    const productName = image.closest(".product-card")
                        .querySelector("h3");

                    lightboxCaption.textContent = productName
                        ? productName.textContent
                        : image.alt;
                }

                lightbox.hidden = false;
                document.body.style.overflow = "hidden";

                if (closeLightbox) {
                    closeLightbox.focus();
                }
            });
        }
    );

    // CLOSE LIGHTBOX
    function hideLightbox() {
        if (!lightbox) {
            return;
        }

        lightbox.hidden = true;
        document.body.style.overflow = "";
    }

    if (closeLightbox) {
        closeLightbox.addEventListener("click", hideLightbox);
    }

    if (lightbox) {
        lightbox.addEventListener("click", function (event) {
            if (event.target === lightbox) {
                hideLightbox();
            }
        });
    }

    // CLOSE WITH ESCAPE KEY
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            hideLightbox();
        }
    });
});



/* ENQUIRY FORM VALIDATION */

const enquiryForm = document.getElementById("enquiry-form");

if (enquiryForm) {
    const eventDate = document.getElementById("date");
    const responseMessage = document.getElementById("enquiry-response");

    // Prevent customers from selecting a date in the past.
    if (eventDate) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        eventDate.min = `${year}-${month}-${day}`;
    }

    enquiryForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!enquiryForm.checkValidity()) {
            enquiryForm.reportValidity();
            return;
        }

        const formData = new FormData(enquiryForm);
        const customerName = formData.get("name");
        const product = formData.get("product");
        const quantity = formData.get("quantity");
        const eventDateValue = formData.get("date");

        responseMessage.textContent =
            `Thank you, ${customerName}! Your enquiry for ${quantity} ${product.replaceAll("-", " ")} item(s), needed for ${eventDateValue}, has been checked. Please email info@sweetcrumbsbakery.co.za to confirm availability and pricing. Your enquiry has not been sent automatically.`;

        responseMessage.style.color = "green";
        responseMessage.setAttribute("tabindex", "-1");
        responseMessage.focus();
    });
}

}

/* CONTACT FORM */
document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contact-form");

    if (!contactForm) {
        return;
    }

    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        const name = document.getElementById("contact-name").value.trim();
        const email = document.getElementById("contact-email").value.trim();
        const messageType = document.getElementById("contact-type").value;
        const message = document.getElementById("contact-message").value.trim();

        if (!name || !email || !messageType || message.length < 10) {
            contactForm.reportValidity();
            return;
        }

        const recipient = "info@sweetcrumbsbakery.co.za";
        const subject = encodeURIComponent("Sweet Crumbs Bakery - " + messageType);

        const body = encodeURIComponent(
            "Customer Name: " + name + "\n" +
            "Customer Email: " + email + "\n" +
            "Message Type: " + messageType + "\n\n" +
            "Message:\n" + message
        );

        document.getElementById("contact-response").textContent =
            "Your message has been prepared. Please send it using your email application.";

        window.location.href =
            "mailto:" + recipient + "?subject=" + subject + "&body=" + body;
    });
});

/* Save products added to the shopping cart */

document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".add-to-cart[data-name]");

    buttons.forEach(function (button) {
        button.addEventListener("click", function () {
            const name = button.dataset.name;
            const price = Number(button.dataset.price);

            let cart = JSON.parse(
                localStorage.getItem("sweetCrumbsCart") || "[]"
            );

            const existingProduct = cart.find(function (item) {
                return item.name === name;
            });

            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.push({
                    name: name,
                    price: price,
                    quantity: 1
                });
            }

            localStorage.setItem("sweetCrumbsCart", JSON.stringify(cart));

            alert(name + " added to your cart!");
        });
    });
});


/* DISPLAY SAVED PRODUCTS ON THE CART PAGE */

document.addEventListener("DOMContentLoaded", function () {
    const cartItems = document.getElementById("cart-items");

    if (!cartItems) {
        return;
    }

    let cart = [];

    try {
        cart = JSON.parse(localStorage.getItem("sweetCrumbsCart")) || [];
    } catch (error) {
        cart = [];
    }

    cartItems.innerHTML = "";
    let subtotal = 0;

    if (cart.length === 0) {
        cartItems.textContent = "Your cart is currently empty.";
    }

    cart.forEach(function (item, index) {
        const row = document.createElement("div");
        row.className = "cart-row";

        const name = document.createElement("span");
        name.textContent = item.name;

        const quantity = document.createElement("span");
        quantity.className = "quantity-box";
        quantity.textContent = item.quantity;

        const price = document.createElement("span");
        price.textContent = "R" +
            (item.price * item.quantity).toFixed(2);

        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "remove-button";
        remove.textContent = "Remove";

        remove.addEventListener("click", function () {
            cart.splice(index, 1);
            localStorage.setItem("sweetCrumbsCart", JSON.stringify(cart));
            location.reload();
        });

        row.append(name, quantity, price, remove);
        cartItems.appendChild(row);

        subtotal += item.price * item.quantity;
    });

    document.getElementById("cart-subtotal").textContent =
        "R" + subtotal.toFixed(2);

    document.getElementById("cart-delivery").textContent = "R0.00";

    document.getElementById("cart-total").textContent =
        "R" + subtotal.toFixed(2);
});



/* DISPLAY SAVED PRODUCTS ON CHECKOUT PAGE */

document.addEventListener("DOMContentLoaded", function () {
    const checkoutItems = document.getElementById("checkout-items");

    if (!checkoutItems) {
        return;
    }

    let cart = [];

    try {
        cart = JSON.parse(
            localStorage.getItem("sweetCrumbsCart") || "[]"
        );
    } catch (error) {
        cart = [];
    }

    checkoutItems.innerHTML = "";
    let subtotal = 0;

    if (cart.length === 0) {
        checkoutItems.textContent = "Your cart is currently empty.";
    }

    cart.forEach(function (item) {
        const row = document.createElement("div");
        row.className = "checkout-item";

        const productName = document.createElement("span");
        productName.textContent = item.name + " x " + item.quantity;

        const productPrice = document.createElement("span");
        productPrice.textContent =
            "R" + (item.price * item.quantity).toFixed(2);

        row.append(productName, productPrice);
        checkoutItems.appendChild(row);

        subtotal += item.price * item.quantity;
    });

    const subtotalElement = document.getElementById("checkout-subtotal");
    const deliveryElement = document.getElementById("checkout-delivery");
    const totalElement = document.getElementById("checkout-total");

    if (subtotalElement) {
        subtotalElement.textContent = "R" + subtotal.toFixed(2);
    }

    if (deliveryElement) {
        deliveryElement.textContent = "R0.00";
    }

    if (totalElement) {
        totalElement.textContent = "R" + subtotal.toFixed(2);
    }
});



/* CHECKOUT FORM SUBMISSION */
const checkoutForm = document.getElementById("checkout-form");

if (checkoutForm) {
    checkoutForm.addEventListener("submit", function (event) {
        event.preventDefault();
        window.location.href = "enquiry.html";
    });
}

