class CreateProjects < ActiveRecord::Migration[7.1]
  def change
    create_table :projects do |t|
      t.string :name
      t.timestamp :discarded_at, index: true
      t.string :public_id

      t.timestamps
    end

    add_index :projects, :public_id, unique: true
  end
end
