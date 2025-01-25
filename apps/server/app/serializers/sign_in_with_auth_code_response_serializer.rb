class SignInWithAuthCodeResponseSerializer < BaseResponseSerializer
  attributes :access_token

  type(
    access_token: [:string, nullable: true]
  )
end