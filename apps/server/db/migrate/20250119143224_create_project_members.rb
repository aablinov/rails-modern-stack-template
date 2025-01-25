class CreateProjectMembers < ActiveRecord::Migration[7.1]
  def change
    create_table :project_members do |t|
      t.references :user, null: false, foreign_key: true
      t.references :project, null: false, foreign_key: true

      t.string :role, null: false, default: 'member'

      t.timestamp :discarded_at, index: true

      t.string :public_id

      t.timestamps
    end

    add_index :project_members, :public_id, unique: true
    add_index :project_members, [:user_id, :project_id], unique: true, where: 'discarded_at IS NULL'
  end
end
