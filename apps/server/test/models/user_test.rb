# == Schema Information
#
# Table name: users
#
#  id             :bigint           not null, primary key
#  discarded_at   :datetime
#  email          :string
#  jwt_secret_key :string
#  name           :string
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  public_id      :string
#
# Indexes
#
#  index_users_on_discarded_at  (discarded_at)
#  index_users_on_email         (email) UNIQUE
#  index_users_on_public_id     (public_id) UNIQUE
#
require "test_helper"

class UserTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
