class OrderPage {
  static getFormatter() {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
    });
  }

  constructor() {
    this.lineItems = new LineItemsCollection();

    this.lineItemsContainer = document.querySelector(".line-items");
    this.totalPriceElement = document.querySelector(".js-order-total");
    this.orderCountElement = document.querySelector(".js-order-count");

    const categoryElements = document.querySelectorAll(".js-category");
    const productElements = document.querySelectorAll(".js-product");

    this.categories = new Categories(categoryElements);
    this.products = new Products(productElements);
  }

  initialize() {
    this.products.setActiveStateForAll(Categories.getActiveId());
    this.categories.hideAllSubcategories();

    this.addClickListener(this.categories.all, this.handleCategoryClick);
    this.addClickListener(this.products.all, this.handleProductClick);

    document
      .querySelector(".js-cancel-order")
      .addEventListener("click", this.cancelOrder);

    document
      .querySelector(".js-submit-order")
      .addEventListener("click", this.submitOrder);

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
    this.lineItems.render(
      this.lineItemsContainer,
      this.totalPriceElement,
      this.orderCountElement
    );
  }

  handleCategoryClick(event) {
    const category = event.currentTarget;

    // Toggle: deactivate if already active
    if (Categories.getActive() === category) {
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
    orderPage.lineItems.addItem(item);
    orderPage.render();
  }

  cancelOrder() {
    orderPage.lineItems = new LineItemsCollection();
    orderPage.render();
  }

  createFormFields(form) {
    this.lineItems.getList().forEach((lineItem) => {
      const id_input = document.createElement("input");
      const quantity_input = document.createElement("input");

      id_input.type = "hidden";
      id_input.name = "order[items][][product_id]";
      id_input.value = lineItem.id;
      quantity_input.type = "hidden";
      quantity_input.name = "order[items][][quantity]";
      quantity_input.value = lineItem.quantity;

      form.appendChild(id_input);
      form.appendChild(quantity_input);
    });
  }

  submitOrder() {
    const form = document.getElementById("js-order-form");
    orderPage.createFormFields(form);
    form.submit();
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

  getTotalPrice() {
    return this.quantity * this.unitPrice;
  }

  toHtml() {
    const formattedUnitPrice = OrderPage.getFormatter().format(this.unitPrice);
    const formattedTotalPrice = OrderPage.getFormatter().format(
      this.getTotalPrice()
    );
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
        <span class="sv-line-item__unit-price">${formattedUnitPrice}</span> 
      </div>

      <div class="col-2">
        <span class="fw-bold">${formattedTotalPrice}</span> 
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

  getTotalPrice() {
    const total = this.getList().reduce(
      (total, lineItem) => total + lineItem.getTotalPrice(),
      0
    );
    return total;
  }

  getItemCount() {
    return this.getList().reduce(
      (count, lineItem) => count + lineItem.quantity,
      0
    );
  }

  render(container, totalPriceElement, orderCountElement) {
    container.innerHTML = "";
    this.getList().forEach((item) => {
      const elements = item.toElements();
      elements.forEach((element) => container.appendChild(element));
    });

    const formattedTotalPrice = OrderPage.getFormatter().format(
      this.getTotalPrice()
    );
    totalPriceElement.innerText = formattedTotalPrice;
    orderCountElement.innerText = this.getItemCount();
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

    this.hideAllSubcategories();
  }

  hideAllSubcategories() {
    const subcategories = this.getSubcategories();

    subcategories.forEach((category) => {
      category.parentElement.classList.add("d-none");
    });
  }

  showCategories(categories) {
    categories.forEach((category) =>
      category.parentElement.classList.remove("d-none")
    );
  }

  /**
   * Get all non-root categories
   */
  getSubcategories() {
    const subcategories = [];

    this.all.forEach((category) => {
      const ancestors = JSON.parse(category.dataset.ancestors);
      if (ancestors.length > 0) subcategories.push(category);
    });

    return subcategories;
  }

  activate(category) {
    category.classList.add("js-active-category", "btn-primary");
    category.classList.remove("btn-outline-primary");

    const categoryId = parseInt(category.dataset.categoryId);
    const subcategories = this.find_by_ancestor_id(categoryId);

    const parentId = JSON.parse(category.dataset.ancestors)[0];
    const siblings = this.find_by_ancestor_id(parentId);

    const subcategoriesAndSiblings = subcategories.concat(siblings);

    this.showCategories(subcategoriesAndSiblings);

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

  find_by_ancestor_id(ancestor_id) {
    const matches = [];

    this.all.forEach((category) => {
      const ancestors = JSON.parse(category.dataset.ancestors);

      if (!ancestor_id && ancestors.length === 0) {
        // Root categories
        matches.push(category);
      } else if (ancestors.includes(ancestor_id)) {
        // Subcategories
        matches.push(category);
      }
    });

    return matches;
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
