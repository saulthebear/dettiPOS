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

regular = Category.create(name: 'Regular')
specials = Category.create(name: 'Specials')
extras = Category.create(name: 'Extras')
wholesale = Category.create(name: 'Wholesale')

pies = Category.create(name: 'Pies', parent: regular)
drinks = Category.create(name: 'Drinks', parent: regular)
cookies = Category.create(name: 'Cookies etc.', parent: regular)

# one = Product.create(name: '1 Pie', price: 18.5, category: specials)
four = Product.create(name: '4 Pies', price: -8.0, category: specials)
eight = Product.create(name: '8 Pies', price: -20.0, category: specials)
burger_upgrade = Product.create(name: 'Burger Upgrade', price: 3.5, category: specials)
two_grillers = Product.create(name: '2 Grillers', price: -2, category: specials)
three_cocktails = Product.create(name: '3 Cocktails', price: -0.5, category: specials)

oneone = Product.create(name: '1 Pie & 1 Can', price: -3.5, category: specials)

p_pepper = Product.create(name: 'Pepper Steak', price: 18.5, category: pies)
p_steak = Product.create(name: 'Steak', price: 18.5, category: pies)
p_kidney = Product.create(name: 'Sausage Roll', price: 18.5, category: pies)
p_sausage = Product.create(name: 'Spinach & Feta', price: 18.5, category: pies)
p_spinach = Product.create(name: 'Cheese & Mince', price: 18.5, category: pies)
p_cheese = Product.create(name: 'Chicken Mushroom', price: 18.5, category: pies)
p_chicken = Product.create(name: 'Pepper Steak', price: 18.5, category: pies)

burger = Product.create(name: 'Burger Pie', price: 22.0, category: pies)
cocktail = Product.create(name: 'Cocktail', price: 3.5, category: pies)
griller = Product.create(name: 'Griller', price: 6.00, category: pies)

can = Product.create(name: '1 Can', price: 13.00, category: drinks)
buddy = Product.create(name: 'Buddy', price: 15.00, category: drinks)
buddy_upgrade = Product.create(name: 'Buddy Upgrade', price: 2.00, category: specials)
water = Product.create(name: 'Water', price: 10.0, category: drinks)

soup = Product.create(name: 'Soup', price: 15.0, category: cookies)
choc = Product.create(name: 'Choc-Chip Cookies', price: 60.0, category: cookies)

w_pie = Product.create(name: 'Wholesale Pie', price: 14.0, category: wholesale)
w_burger = Product.create(name: 'Wholesale Burger', price: 16.5, category: wholesale)
w_rusks = Product.create(name: 'Wholesale Rusks', price: 36.00, category: wholesale)

bag = Product.create(name: 'Bag', price: 0.50, category: extras)

puff = Product.create(name: 'Puff', price: 29.00, category: cookies)

orders = Order.create([
                        { order_items:
                          OrderItem.create([
                                             { product: p_steak, quantity: 2 },
                                             { product: griller, quantity: 2 },
                                             { product: two_grillers, quantity: 1 }
                                           ]) },
                        { order_items:
                          OrderItem.create([
                                             { product: w_pie, quantity: 50 },
                                             { product: w_burger, quantity: 10 }
                                           ]) }
                      ])

payments = Payment.create!([
                             { order: orders[0], amount: orders[0].total_price }
                           ])
