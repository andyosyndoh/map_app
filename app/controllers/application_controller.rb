class ApplicationController < ActionController::Base
  include InertiaRails::Controller
  inertia_share auth: -> {
    {
      authenticated: user_signed_in?,
      user: current_user_data
    }
  }

  private

  def current_user_data
    return nil unless user_signed_in?
    {
      id: current_user.id,
      email: current_user.email,
      role: current_user.role
    }
  end

  protect_from_forgery with: :exception

  def after_sign_out_path_for(resource_or_scope)
    root_path
  end
end
