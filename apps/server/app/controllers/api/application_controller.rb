module Api
  class ApplicationController < ::ApplicationController
    include ActionController::Cookies
    include Api::Errors
    include Typegen::Controller

    AuthenticationError = Class.new(StandardError)

    rescue_from AuthenticationError do
      render_not_authed_error!
    end

    rescue_from ActiveRecord::RecordNotFound do
      render_not_found_error!
    end

    def render_resource(serializer, resource)
      render json: serializer.new(resource.is_a?(Hash) ? DeepOpenStruct.wrap(resource) : resource).serialize, status: :ok
    end

    def render_ok
      render json: { ok: true }, status: :ok
    end

    def auth_token
      request.headers["Authorization"]&.split(" ")&.last || cookies['_server_access_token']
    end

    def current_user
      @current_user ||= User.authenticate(auth_token)
    end

    def current_project
      @current_project ||= current_user.projects.find_by(public_id: params[:project_id])
    end

    def current_member
      @current_member ||= current_project.project_members.find_by(user_id: current_user.id)
    end

    def authenticated!
      raise AuthenticationError unless current_user
    end
  end
end