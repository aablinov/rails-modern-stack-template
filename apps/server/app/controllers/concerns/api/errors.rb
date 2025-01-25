module Api
  module Errors
    include ActiveSupport::Concern

    def render_error!(error_code, status: :ok)
      render json: error_response(error_code), status: status
    end

    def render_not_found_error!
      render_error!(:not_found, status: :not_found)
    end

    def render_not_project_member_error!
      render_error!(:not_project_member, status: :ok)
    end

    def render_not_authed_error!
      render_error!(:not_authed, status: :ok)
    end

    def error_response(error_code)
      { ok: false, error: error_code }
    end
  end
end