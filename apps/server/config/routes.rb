Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      post 'users.identity' => 'users#identity'

      post 'auth.send_auth_code' => 'auth#send_auth_code'
      post 'auth.sign_in_with_auth_code' => 'auth#sign_in_with_auth_code'

      post 'articles.create' => 'articles#create'
      post 'articles.info' => 'articles#info'
      post 'articles.list' => 'articles#list'
    end
  end
end
