Rails.application.routes.draw do
  resources :flowcharts, only: [:index,:new,:create]
end
