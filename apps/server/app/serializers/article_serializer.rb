class ArticleSerializer < TypedSerializer
  attributes :title, :body, :path

  attribute :id do |x|
    x.public_id
  end

  attribute :project_id do |x|
    x.project.public_id
  end

  attribute :user do |x|
    UserSerializer.new(x.member.user).as_json
  end

  type(
    id: :string,
    title: :string,
    body: :string,
    project_id: :string,
    path: :string,
    user: UserSerializer
  )
end
