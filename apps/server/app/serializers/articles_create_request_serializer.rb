class ArticlesCreateRequestSerializer < TypedSerializer
  attributes :title, :body, :project_id

  type(
    title: :string,
    body: :string,
    project_id: [:string, optional: true]
  )
end