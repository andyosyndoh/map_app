class LocationsController < ApplicationController
  before_action :authenticate_user!, except: [ :index ]
  before_action :set_location, only: [ :edit, :update, :destroy ]
  load_and_authorize_resource except: [ :create ]

  def index
    @locations = Location.all.includes(:user)
    render inertia: "Locations/Index", props: {
      locations: @locations.as_json(include: { user: { only: [ :id, :email ] } }),
      current_user: user_signed_in? ? current_user.as_json(only: [ :id, :email, :role ]) : nil
    }
  end

  def new
    render inertia: "Locations/New", props: {
      current_user: current_user.as_json(only: [ :id, :email, :role ])
    }
  end

  def create
    @location = current_user.locations.build(location_params)

    if @location.save
      redirect_to locations_path, notice: "Location was successfully created."
    else
      render inertia: "Locations/New", props: {
        errors: @location.errors,
        current_user: current_user.as_json(only: [ :id, :email, :role ])
      }
    end
  end

  def edit
    render inertia: "Locations/Edit", props: {
      location: @location,
      current_user: current_user.as_json(only: [ :id, :email, :role ])
    }
  end

  def update
    if @location.update(location_params)
      redirect_to locations_path, notice: "Location was successfully updated."
    else
      render inertia: "Locations/Edit", props: {
        location: @location,
        errors: @location.errors,
        current_user: current_user.as_json(only: [ :id, :email, :role ])
      }
    end
  end

  def destroy
    @location.destroy
    redirect_to locations_path, notice: "Location was successfully deleted."
  end

  private

  def set_location
    @location = Location.find(params[:id])
  end

  def location_params
    params.require(:location).permit(:name, :latitude, :longitude)
  end
end
