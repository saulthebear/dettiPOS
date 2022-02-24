# == Schema Information
#
# Table name: order_items
#
#  id         :bigint           not null, primary key
#  product_id :bigint           not null
#  order_id   :bigint           not null
#  unit_price :decimal(, )      not null
#  quantity   :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class OrderItem < ApplicationRecord
  before_validation :ensure_unit_price

  validates :unit_price, :quantity,
            presence: true,
            numericality: true

  belongs_to :product,
             inverse_of: :order_items

  belongs_to :order,
             inverse_of: :order_items

  def total_price
    ensure_unit_price
    unit_price * quantity
  end

  private

  # If unit price hasn't been set, set it equal to the product's price
  def ensure_unit_price
    return unless product

    self.unit_price ||= product.price
  end
end
