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

  def self.by_category_id
    products = all

    hash = Hash.new { |h, k| h[k] = [] }

    products.each { |product| hash[product.category_id] << product }

    hash
  end

  # If calling this method on multiple products, category map can be created by
  # caller first to prevent loading categories multiple times
  def all_ancestor_category_ids(category_map = Category.all.map { |category| [category.id, category] }.to_h)
    current_category_id = category_id
    ancestor_ids = []

    until current_category_id.nil?
      ancestor_ids << current_category_id
      current_category_id = category_map[current_category_id].parent_id
    end

    ancestor_ids
  end
end
