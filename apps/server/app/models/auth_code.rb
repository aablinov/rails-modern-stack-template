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
class AuthCode < ApplicationRecord
  include HasPublicId

  def self.generate(email)
    auth_code = AuthCode.new
    auth_code.email = email
    auth_code.expires_at = 5.minutes.from_now
    auth_code.save!
    auth_code
  end

  def expired?
    Time.now > expires_at
  end

  def used?
    used_at.present?
  end
end
