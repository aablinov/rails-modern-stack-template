class ArticlesInfoResponseSerializer < BaseResponseSerializer
  has_one :article, resource: ArticleSerializer

  type(
    article: [ArticleSerializer, optional: true]
  )
end