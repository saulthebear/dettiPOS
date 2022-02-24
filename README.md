# 🛒 DettiPOS

This is the start of a point of sale system for a small bakery in South Africa. Note that this app is still in early development and will undergo many changes. Feel free to poke around as you follow my progress building.

## ⚙️ Technology
This is a Ruby on Rails app with a Postgresql database. The front-end is currently a mix of ERB and vanilla Javascript, with Bootstrap as a design framework. SCSS is used as a CSS preprocessor.

### 🛠 Future development plans
This app is currently a proof of concept and a learning exercise.
I plan to transition the back-end to a JSON API only with a React app as the front-end. Bootstrap will be replaced with a custom design and components.

## 🧮 Overview of current features
* Orders can be created. They consist of line items linked to a product, at a certain unit price, and in a certain quantity.
* Products are organized into categories. Categories can be nested to create subcategories.
* On the new order page, products can be filtered by category.
* On the products index page, all products can be seen under their category headings
* Products can be created and edited

### 🔮 Coming features
* User accounts / Security
  * Two types: Admin and Cashier
  * Cashiers will only be able to access the new orders page
  * Cashier accounts need to be approved by an admin before they can be used
  * Prevent using the app from unfamiliar / unapproved locations
* Overview of orders placed, filtered by time period
* Cash up: Totaling all sales at the end of the day
  * organized by cash purchases or credit purchases
  * Allows checking money in cash register against actual sales
* Future orders
  * orders placed by phone that can't be paid immediately
  * orders for a future date. Can be paid when placed or when the order has been completed.

## ⚠️ Known issues
* Products cannot be deleted if they are being referenced in an order
  * This will be solved by setting products as *inactive* when removed from the menu.
