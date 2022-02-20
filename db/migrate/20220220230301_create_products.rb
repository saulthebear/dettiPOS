class CreateProducts < ActiveRecord::Migration[7.0]
  def change
    create_table :products do |t|
      t.string :name, null: false, index: { unique: true }
      t.text :description
      t.decimal :price, null: false
      t.belongs_to :category, null: false, foreign_key: true

      t.timestamps
    end
  end
end
