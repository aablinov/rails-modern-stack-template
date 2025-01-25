class DeepOpenStruct
  def self.wrap(object)
    case object
    when Hash
      OpenStruct.new(object.transform_values { |value| wrap(value) })
    when Array
      object.map { |value| wrap(value) }
    else
      object
    end
  end
end