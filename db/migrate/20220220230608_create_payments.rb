class CreatePayments < ActiveRecord::Migration[7.0]
  def change
    create_table :payments do |t|
      t.integer :payments_type, default: 0, null: false
      t.decimal :amount, null: false
      t.belongs_to :order, null: false, foreign_key: true

      t.timestamps
    end
  end
end
