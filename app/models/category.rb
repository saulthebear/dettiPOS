# == Schema Information
#
# Table name: categories
#
#  id         :bigint           not null, primary key
#  name       :string
#  parent_id  :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class Category < ApplicationRecord
  validates :name, presence: true, uniqueness: true

  belongs_to :parent,
    class_name: :Category,
    foreign_key: :parent_id,
    inverse_of: :subcategories,
    optional: true
  
  has_many :subcategories,
    class_name: :Category,
    foreign_key: :parent_id,
    inverse_of: :parent,
    dependent: :destroy
    
  has_many :products,
    inverse_of: :category,
    dependent: :destroy
end
