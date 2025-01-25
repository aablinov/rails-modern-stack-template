class ProjectSerializer < TypedSerializer
  attributes :name
  attribute :id do |x|
    x.public_id
  end

  type(
    id: :string,
    name: :string
  )
end
