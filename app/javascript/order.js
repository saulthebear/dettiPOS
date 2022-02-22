function getCategories() {
  return document.querySelectorAll(".js-category");
}
function getProducts() {
  return document.querySelectorAll(".js-product");
}

function addClickListener(collection, callback) {
  collection.forEach((element) => element.addEventListener("click", callback));
}

function deactivateAllCategories() {
  getCategories().forEach((category) => {
    category.classList.remove("js-active-category", "btn-primary");
    category.classList.add("btn-outline-primary");
  });
}

function setActiveCategory(category) {
  category.classList.add("js-active-category", "btn-primary");
  category.classList.remove("btn-outline-primary");
}

function getActiveCategory() {
  return document.querySelector(".js-active-category");
}

function getCategoryId(category) {
  if (category === null) return null;

  return parseInt(category.dataset.categoryId);
}

function getProductCategories(product) {
  return JSON.parse(product.dataset.ancestors);
}

function activateProduct(product) {
  product.classList.remove("js-active-product");
  product.parentElement.classList.remove("d-none");
}

function deactivateProduct(product) {
  product.classList.add("js-active-product");
  product.parentElement.classList.add("d-none");
}

function deactivateAllProducts() {
  getProducts().forEach(deactivateProduct);
}

function activateAllProducts() {
  getProducts().forEach(activateProduct);
}

function setActiveProducts() {
  const activeCategoryId = getCategoryId(getActiveCategory());

  // If no category is selected, all products are set to active
  if (activeCategoryId === null) {
    activateAllProducts();
    return;
  }

  // Set products who have the active category id in their ancestors as active
  getProducts().forEach((product) => {
    const categories = getProductCategories(product);
    if (categories.includes(activeCategoryId)) {
      activateProduct(product);
    } else {
      deactivateProduct(product);
    }
  });
}

function handleCategoryClick(event) {
  const category = event.currentTarget;

  // Toggle off if already selected
  if (getActiveCategory() === category) {
    deactivateAllCategories();
    setActiveProducts();
    return;
  }

  deactivateAllCategories();
  setActiveCategory(category);

  deactivateAllProducts();
  setActiveProducts();
}

function handleProductClick(event) {
  const product = event.currentTarget;
  const id = product.dataset.productId;
  const myCategories = JSON.parse(product.dataset.ancestors);

  console.log(`Product #${id} was clicked!`);
  console.log(myCategories);
}

setActiveProducts();
addClickListener(getCategories(), handleCategoryClick);
addClickListener(getProducts(), handleProductClick);
