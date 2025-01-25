class UserIdentityResponseSerializer < BaseResponseSerializer
  has_one :user, resource: UserSerializer

  type(
    user: [UserSerializer, optional: true]
  )
end