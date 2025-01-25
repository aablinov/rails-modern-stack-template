class BaseResponseSerializer < TypedSerializer
  attributes :ok, :error

  type(
    ok: :boolean,
    error: [:string, nullable: true]
  )
end