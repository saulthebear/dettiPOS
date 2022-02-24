# == Schema Information
#
# Table name: orders
#
#  id         :bigint           not null, primary key
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class Order < ApplicationRecord
  validates :order_items, presence: true

  has_many :order_items,
           inverse_of: :order,
           dependent: :destroy

  has_many :products,
           through: :order_items,
           inverse_of: :orders

  has_one :payment,
          dependent: :destroy

  def total_price
    order_items.sum(&:total_price)
  end

  def payed?
    !payment.nil?
  end
end
