# == Schema Information
#
# Table name: auth_codes
#
#  id         :bigint           not null, primary key
#  email      :string
#  expires_at :datetime
#  used_at    :datetime
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  public_id  :string
#
# Indexes
#
#  index_auth_codes_on_public_id  (public_id) UNIQUE
#
require "test_helper"

class AuthCodeTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
