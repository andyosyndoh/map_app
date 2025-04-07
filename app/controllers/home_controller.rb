class HomeController < ApplicationController
  def index
    render inertia: "Home/Index", props: {
      locations: Location.all.as_json(only: [ :id, :name, :latitude, :longitude ]),
      current_user: current_user.as_json(only: [ :id, :email, :role ])
    }
  end
end
