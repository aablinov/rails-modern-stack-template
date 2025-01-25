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
class User < ApplicationRecord

  SESSION_EXPIRATION = 1.year

  include HasPublicId
  include Discard::Model

  normalizes :email, with: -> email { email.strip.downcase }

  before_create :setup_defaults

  has_many :project_members, dependent: :destroy
  has_many :projects, through: :project_members
  has_many :articles, through: :project_members

  def self.exchange_auth_code_to_access_token(auth_code)
    return unless auth_code.present?

    user = User.find_by(email: auth_code.email)
    return unless user.present?

    auth_code.update!(used_at: Time.now)

    encode_access_token('auth_code', user.public_id, user.jwt_secret_key)
  end

  def self.authenticate(jwt_token)
    return unless jwt_token.present?

    payload = JWT.decode(jwt_token, nil, false).first

    user = User.find_by(public_id: payload['user_id'])
    return unless user.present?

    payload = user.verify_access_token(jwt_token)
    return unless payload.present?

    user

  rescue JWT::DecodeError, JWT::VerificationError
    nil
  end

  def self.encode_access_token(type, public_id, jwt_secret_key)
    JWT.encode({ user_id: public_id, type: type, exp: SESSION_EXPIRATION.from_now.to_i }, jwt_secret_key, 'HS256')
  end

  def verify_access_token(token)
    encoded_token = JWT::EncodedToken.new(token)
    encoded_token.verify_signature!(algorithm: 'HS256', key: jwt_secret_key)

    encoded_token.payload
  rescue JWT::DecodeError, JWT::VerificationError
    nil
  end

  private

  def setup_defaults
    self.jwt_secret_key = SecureRandom.hex(32) if jwt_secret_key.blank?
  end
end
