class CreateAuthCodes < ActiveRecord::Migration[7.1]
  def change
    create_table :auth_codes do |t|
      t.string :public_id
      t.string :email
      t.timestamp :expires_at
      t.timestamp :used_at

      t.timestamps
    end

    add_index :auth_codes, :public_id, unique: true
  end
end
