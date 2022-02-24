class ChangePaymentTypeColumnName < ActiveRecord::Migration[7.0]
  def change
    rename_column :payments, :payments_type, :payment_type
  end
end
