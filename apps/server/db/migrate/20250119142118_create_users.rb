class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :users do |t|
      t.string :email
      t.string :name
      t.string :jwt_secret_key
      t.timestamp :discarded_at, index: true
      t.string :public_id

      t.timestamps
    end

    add_index :users, :public_id, unique: true
    add_index :users, :email, unique: true
  end
end
