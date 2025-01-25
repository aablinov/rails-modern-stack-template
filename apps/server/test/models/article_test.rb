# == Schema Information
#
# Table name: articles
#
#  id           :bigint           not null, primary key
#  body         :text
#  discarded_at :datetime
#  title        :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  member_id    :bigint           not null
#  project_id   :bigint           not null
#  public_id    :string
#
# Indexes
#
#  index_articles_on_discarded_at  (discarded_at)
#  index_articles_on_member_id     (member_id)
#  index_articles_on_project_id    (project_id)
#  index_articles_on_public_id     (public_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (member_id => project_members.id)
#  fk_rails_...  (project_id => projects.id)
#
require "test_helper"

class ArticleTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
