# == Schema Information
#
# Table name: project_members
#
#  id           :bigint           not null, primary key
#  discarded_at :datetime
#  role         :string           default("member"), not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  project_id   :bigint           not null
#  public_id    :string
#  user_id      :bigint           not null
#
# Indexes
#
#  index_project_members_on_discarded_at            (discarded_at)
#  index_project_members_on_project_id              (project_id)
#  index_project_members_on_public_id               (public_id) UNIQUE
#  index_project_members_on_user_id                 (user_id)
#  index_project_members_on_user_id_and_project_id  (user_id,project_id) UNIQUE WHERE (discarded_at IS NULL)
#
# Foreign Keys
#
#  fk_rails_...  (project_id => projects.id)
#  fk_rails_...  (user_id => users.id)
#
require "test_helper"

class ProjectMemberTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
