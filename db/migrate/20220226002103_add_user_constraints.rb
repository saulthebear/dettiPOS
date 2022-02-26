class AddUserConstraints < ActiveRecord::Migration[7.0]
  def change
    add_index :users, :username, unique: true
    add_index :users, :session_token, unique: true
  end
end
