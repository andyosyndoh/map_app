Rails.application.routes.draw do
  devise_for :users

  resources :locations

  namespace :admin do
    get "dashboard", to: "admin#dashboard"
    get "users", to: "admin#users"
    get "users/new", to: "admin#new_user"
    post "users", to: "admin#create_user"
    get "users/:id/edit", to: "admin#edit_user"
    put "users/:id", to: "admin#update_user"
    delete "users/:id", to: "admin#destroy_user"
  end

  root to: "home#index"
end
