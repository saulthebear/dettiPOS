Rails.application.routes.draw do
  get 'order/new'
  get 'order/create'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  root "order#new"
end
