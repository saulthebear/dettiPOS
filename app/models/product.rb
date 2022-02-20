# == Schema Information
#
# Table name: products
#
#  id          :bigint           not null, primary key
#  name        :string           not null
#  description :text
#  price       :decimal(, )      not null
#  category_id :bigint           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
class Product < ApplicationRecord
  validates :name, presence: true, uniqueness: true
  validates :price, numericality: true
  
  belongs_to :category
  
  has_many :order_items

  has_many :orders,
    through: :order_items,
    inverse_of: :products
end
