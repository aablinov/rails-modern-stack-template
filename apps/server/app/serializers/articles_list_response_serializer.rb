class ArticlesListResponseSerializer < BaseResponseSerializer
  has_many :articles, resource: ArticleSerializer

  type(
    articles: [ArticleSerializer, many: true]
  )
end