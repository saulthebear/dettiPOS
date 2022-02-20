# == Schema Information
#
# Table name: payments
#
#  id            :bigint           not null, primary key
#  payments_type :integer          default(0), not null
#  amount        :decimal(, )      not null
#  order_id      :bigint           not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
class Payment < ApplicationRecord
  validates :payment_type, presence: true
  validates :amount, presence: true, numericality: true
  validates :order, uniqueness: true
  validate :amount_matches_order
  
  enum payment_type: %i[cash card]

  belongs_to :order
  
  private

  def amount_matches_order
    order_total = self.order.total_price
    unless order_total == self.amount
      self.errors.add :amount, "does not match order's total price"
    end
  end
end
