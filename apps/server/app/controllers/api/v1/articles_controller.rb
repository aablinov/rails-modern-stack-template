module Api
  module V1
    class ArticlesController < ApplicationController
      api_method 'articles.create', request: ArticlesCreateRequestSerializer ,response: ArticlesCreateResponseSerializer
      def create
        unless current_member
          render_not_project_member_error!
          return
        end

        article = current_project.articles.create!(title: "#{params[:title]} (#{current_project.articles.count})", body: params[:body], member: current_member)
        render_resource(ArticlesCreateResponseSerializer, article: article, ok: true)
      end

      api_method('articles.list', request: { project_id: :string }, response: ArticlesListResponseSerializer)
      def list
        articles = current_project.articles.order(created_at: :desc)

        render_resource(ArticlesListResponseSerializer, articles: articles, ok: true)
      end

      api_method 'articles.info', request: { project_id: [:string, optional: true], id: :string }, response: ArticlesInfoResponseSerializer
      def info
        article = current_project.articles.find_by!(public_id: params[:id])

        render_resource(ArticlesInfoResponseSerializer, article: article, ok: true)
      end
    end
  end
end
