module Api
  module V1
    class UsersController < ApplicationController
      before_action :authenticated!

      api_method 'users.identity', response: UserIdentityResponseSerializer
      def identity
        render_resource(UserIdentityResponseSerializer, user: current_user, ok: true)
      end
    end
  end
end