class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new # guest user (not logged in)

    if user.admin?
      can :manage, :all
    elsif user.user?
      can :read, Location
      can :manage, Location, user_id: user.id
      can :manage, User, id: user.id
    else
      can :read, Location
    end
  end
end
