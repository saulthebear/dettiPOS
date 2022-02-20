# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

Payment.destroy_all
OrderItem.destroy_all
Order.destroy_all
Product.destroy_all
Category.destroy_all

parent_categories = Category.create([
  { name: "Fresh" },
  { name: "Frozen" }
])

subcategory = Category.create({ name: "Pies", parent: parent_categories[0] })

products = Product.create([
  {name: 'Steak & Kidney Pie', price: 10.5, category: subcategory},
  {name: 'Cheesy Mince Pie', price: 10.5, category: subcategory},
  {name: 'Prime Steak Pie', price: 10.5, category: subcategory},
  {name: 'Puff pastry', price: 21.99, category: parent_categories[1]}
])

orders = Order.create([
  {order_items:
    OrderItem.create([
      {product: products[0], unit_price: 10.5, quantity: 2},
      {product: products[1], unit_price: 10.5, quantity: 3}
    ])
  },
  {order_items:
    OrderItem.create([
      {product: products[2], unit_price: 10.5, quantity: 2},
      {product: products[3], unit_price: 21.99, quantity: 1}
    ])
  },
  {order_items:
    OrderItem.create([
      {product: products[0], unit_price: 10.5, quantity: 1}
    ])
  }
])

payments = Payment.create!([
  {order: orders[0], amount: orders[0].total_price},
  {order: orders[1], amount: orders[1].total_price, payment_type: 1}
])
