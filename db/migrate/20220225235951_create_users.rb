class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users do |t|
      t.string :name
      t.integer :role, null: false, default: 0
      t.boolean :approved, null: false, default: false
      t.string :username, null: false
      t.string :password_digest, null: false
      t.string :session_token

      t.timestamps
    end
  end
end
