class OrderPage {
  constructor() {
    this.lineItems = new LineItemsCollection();
    this.lineItemsContainer = document.querySelector(".line-items");
    const categoryElements = document.querySelectorAll(".js-category");
    const productElements = document.querySelectorAll(".js-product");

    this.categories = new Categories(categoryElements);
    this.products = new Products(productElements);
  }

  initialize() {
    this.products.setActiveStateForAll(Categories.getActiveId());
    this.addClickListener(this.categories.all, this.handleCategoryClick);
    this.addClickListener(this.products.all, this.handleProductClick);
    this.render();
  }

  /**
   * Add the same click listener to each element
   * @param {Element[]} elements
   * @param {function} callback
   */
  addClickListener(elements, callback) {
    elements.forEach((element) => element.addEventListener("click", callback));
  }

  render() {
    this.lineItems.render(this.lineItemsContainer);
  }

  handleCategoryClick(event) {
    const category = event.currentTarget;

    // Toggle: deactivate if already active
    if (Categories.getActive() === category) {
      console.log("reseting categories");
      orderPage.categories.deactivateAll();
      orderPage.products.setActiveStateForAll(Categories.getActiveId());
      return;
    }

    orderPage.categories.deactivateAll();
    orderPage.categories.activate(category);

    orderPage.products.deactivateAll();
    orderPage.products.setActiveStateForAll(Categories.getActiveId());
  }

  handleProductClick(event) {
    const product = event.currentTarget;
    const id = parseInt(product.dataset.productId);
    const name = product.dataset.productName;
    const price = parseFloat(product.dataset.productPrice);

    const item = new LineItem(id, name, 1, price);
    console.log(item);
    orderPage.lineItems.addItem(item);
    orderPage.render();
  }
}

class LineItem {
  constructor(id, name, quantity, unitPrice) {
    this.id = id;
    this.name = name;
    this.quantity = quantity;
    this.unitPrice = unitPrice;
    this.notes = "";
  }

  /**
   * Increase quantity by n
   * @param {int} n Amount to add
   * @returns this
   */
  add(n) {
    this.quantity += n;
    return this;
  }

  /**
   * Decrease quantity by n
   * @param {int} n Amount to subtract
   * @returns this
   */
  subtract(n) {
    if (n >= this.quantity) {
      this.quantity = 0;
      return;
    }

    this.quantity -= n;
    return this;
  }

  /**
   * Increase quantity by 1
   */
  addOne() {
    this.add(1);
    return this;
  }

  /**
   * Decrease quantity by 1
   */
  subtractOne() {
    this.subtract(1);
    return this;
  }

  toHtml() {
    const total_price = this.quantity * this.unitPrice;

    return `
    <div class="row sv-line-item pt-3">
      <div class="col-6">
        <span class="d-block fw-bold">${this.name}</span>
        <span class="d-block fw-light text-muted">${this.notes}</span>
      </div>

      <div class="col-2">
        <span class="sv-line-item__quantity">${this.quantity}</span>
      </div>

      <div class="col-2">
        <span class="sv-line-item__unit-price">R${this.unitPrice}</span> 
      </div>

      <div class="col-2">
        <span class="fw-bold">R${total_price}</span> 
      </div>
    </div>`.trim();
  }

  toElements() {
    const html = this.toHtml();
    const template = document.createElement("template");
    template.innerHTML = html;
    return template.content.childNodes;
  }
}

/**
 * A collection of line items stored as a Map
 */
class LineItemsCollection {
  constructor() {
    this.lineItems = new Map();
  }

  /**
   * @param {LineItem} lineItem
   */
  addItem(lineItem) {
    if (this.lineItems.has(lineItem.id)) {
      const existingItem = this.lineItems.get(lineItem.id);
      existingItem.addOne();
    } else {
      this.lineItems.set(lineItem.id, lineItem);
    }
    return this;
  }

  /**
   * @returns {Array} items in the collection as an array
   */
  getList() {
    return Array.from(this.lineItems.values());
  }

  render(container) {
    container.innerHTML = "";
    this.getList().forEach((item) => {
      const elements = item.toElements();
      elements.forEach((element) => container.appendChild(element));
    });
  }
}

class Categories {
  constructor(categories) {
    this.all = categories;
  }

  deactivateAll() {
    this.all.forEach((category) => {
      category.classList.remove("js-active-category", "btn-primary");
      category.classList.add("btn-outline-primary");
    });
  }

  activate(category) {
    category.classList.add("js-active-category", "btn-primary");
    category.classList.remove("btn-outline-primary");
    return this;
  }

  static getActive() {
    return document.querySelector(".js-active-category");
  }

  static getActiveId() {
    return this.getId(this.getActive());
  }

  static getId(category) {
    if (!category) return null;

    return parseInt(category.dataset.categoryId);
  }

  click(category, products) {
    // Toggle: deactivate if already active
    if (Categories.getActive() === category) {
      this.categories.deactivateAll();
      products.setActiveStateForAll(Categories.getActive());
      return;
    }

    this.categories.deactivateAll();
    this.categories.activate(category);

    products.deactivateAll();
    products.setActiveStateForAll(Categories.getActive());
  }
}

class Products {
  constructor(products) {
    this.all = products;
  }

  getCategories(product) {
    return JSON.parse(product.dataset.ancestors);
  }

  activate(product) {
    product.classList.add("js-active-product");
    product.parentElement.classList.remove("d-none");
  }

  deactivate(product) {
    product.classList.remove("js-active-product");
    product.parentElement.classList.add("d-none");
  }

  deactivateAll() {
    this.all.forEach(this.deactivate);
  }

  activateAll() {
    this.all.forEach(this.activate);
  }

  setActiveStateForAll(activeCategoryId) {
    // If no category is selected, all products are set to active
    if (!activeCategoryId) {
      console.log("setting all products as active");
      this.activateAll();
      return;
    }

    // Set products who have the active category id in their ancestors as active
    this.all.forEach((product) => {
      const categories = this.getCategories(product);
      if (categories.includes(activeCategoryId)) {
        this.activate(product);
      } else {
        this.deactivate(product);
      }
    });
  }
}

const orderPage = new OrderPage();
orderPage.initialize();
// orderPage.products.setActiveStateForAll();
// orderPage.addClickListener(
//   orderPage.categories.all,
//   orderPage.handleCategoryClick
// );
// orderPage.addClickListener(
//   orderPage.products.all,
//   orderPage.handleProductClick
// );
// orderPage.lineItems.render(orderPage.lineItemsContainer);
