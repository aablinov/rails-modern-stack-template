class UserSerializer < TypedSerializer
  has_many :projects, resource: ProjectSerializer

  attributes :email

  attribute :id do |x|
    x.public_id
  end

  type(
    id: :string,
    email: :string,
    projects: [ProjectSerializer, many: true]
  )
end
