class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  validates :role, inclusion: { in: %w[user admin] }

  has_many :locations, dependent: :destroy

  def admin?
    role == "admin"
  end

  def user?
    role == "user"
  end
end
