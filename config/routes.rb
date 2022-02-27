Rails.application.routes.draw do
  resources :products, except: %i[show]
  resources :orders, only: %i[index show destroy new create]
  resources :categories, except: %i[index show]
  resources :users
  resource :session, only: %i[new create destroy]
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  root 'orders#new'
end
