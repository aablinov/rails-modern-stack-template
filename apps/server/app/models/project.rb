# == Schema Information
#
# Table name: projects
#
#  id           :bigint           not null, primary key
#  discarded_at :datetime
#  name         :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  public_id    :string
#
# Indexes
#
#  index_projects_on_discarded_at  (discarded_at)
#  index_projects_on_public_id     (public_id) UNIQUE
#
class Project < ApplicationRecord
  include HasPublicId
  include Discard::Model

  has_many :project_members, dependent: :destroy
  has_many :users, through: :project_members
  has_many :articles, dependent: :destroy
end
