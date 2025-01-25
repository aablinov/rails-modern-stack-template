class CreateArticles < ActiveRecord::Migration[7.1]
  def change
    create_table :articles do |t|
      t.string :title
      t.text :body

      t.references :member, null: false, foreign_key: { to_table: :project_members }
      t.references :project, null: false, foreign_key: true

      t.timestamp :discarded_at, index: true

      t.string :public_id
      t.timestamps
    end

    add_index :articles, :public_id, unique: true
  end
end
