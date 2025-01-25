module Api
  module V1
    class AuthController < ApplicationController
      api_method 'auth.send_auth_code', request: { email: :string }, response: BaseResponseSerializer
      def send_auth_code
        if params[:email].blank? || !User.exists?(email: params[:email])
          render_error!(:invalid_email)
          return
        end

        code = AuthCode.generate(params[:email])

        AuthMailer.with(auth_code: code).auth_code_mail.deliver_now

        render_ok
      end

      api_method 'auth.sign_in_with_auth_code', request: { auth_code: :string }, response: SignInWithAuthCodeResponseSerializer
      def sign_in_with_auth_code
        auth_code = AuthCode.find_by(public_id: params[:auth_code].downcase)

        if auth_code.nil?
          render_error!(:invalid_auth_code)
          return
        end

        if auth_code.expired?
          render_error!(:auth_code_expired)
          return
        end

        if auth_code.used?
          render_error!(:auth_code_used)
          return
        end

        access_token = User.exchange_auth_code_to_access_token(auth_code)

        render_resource(SignInWithAuthCodeResponseSerializer, access_token: access_token, ok: true)
      end
    end
  end
end