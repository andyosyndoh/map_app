class AdminController < ApplicationController
  before_action :authenticate_user!
  before_action :require_admin
  before_action :set_user, only: [ :edit_user, :update_user, :destroy_user ]

  def dashboard
    render inertia: "Admin/Dashboard", props: {
      user_count: User.count,
      location_count: Location.count,
      current_user: current_user.as_json(only: [ :id, :email, :role ])
    }
  end

  def users
    @users = User.all.includes(:locations)

    render inertia: "Admin/Users", props: {
      users: @users.as_json(include: { locations: { only: [ :id, :name ] } }),
      current_user: current_user.as_json(only: [ :id, :email, :role ])
    }
  end

  def new_user
    render inertia: "Admin/NewUser", props: {
      current_user: current_user.as_json(only: [ :id, :email, :role ])
    }
  end

  def create_user
    @user = User.new(user_params)

    if @user.save
      redirect_to admin_users_path, notice: "User was successfully created."
    else
      render inertia: "Admin/NewUser", props: {
        errors: @user.errors,
        current_user: current_user.as_json(only: [ :id, :email, :role ])
      }
    end
  end

  def edit_user
    render inertia: "Admin/EditUser", props: {
      user: @user.as_json(only: [ :id, :email, :role ]),
      current_user: current_user.as_json(only: [ :id, :email, :role ])
    }
  end

  def update_user
    if @user.update(user_update_params)
      redirect_to admin_users_path, notice: "User was successfully updated."
    else
      render inertia: "Admin/EditUser", props: {
        user: @user.as_json(only: [ :id, :email, :role ]),
        errors: @user.errors,
        current_user: current_user.as_json(only: [ :id, :email, :role ])
      }
    end
  end

  def destroy_user
    @user.destroy
    redirect_to admin_users_path, notice: "User was successfully deleted."
  end

  private

  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.require(:user).permit(:email, :password, :password_confirmation, :role)
  end

  def user_update_params
    # Don't require password for updates
    params.require(:user).permit(:email, :role)
  end

  def require_admin
    unless current_user.admin?
      redirect_to root_path, alert: "You must be an admin to access this page."
    end
  end
end
