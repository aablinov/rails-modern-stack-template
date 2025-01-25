module Typegen
  class TypeInfo
    TypeDesc = Struct.new(:name, :type, :nullable, :many, :optional, keyword_init: true)

    attr_accessor :name

    def initialize(name, base)
      @name = name.gsub(/Serializer$/, '')
      if base.respond_to?(:type_info)
        merge!(base.type_info)
      end if base
    end

    def name=(name)
      @name = name.gsub(/Serializer$/, '')
    end

    def defined_fields
      @defined_fields ||= {}
    end

    def add_field(name, type, nullable: false, many: false, optional: false)
      ts_type = case type
                when Symbol then type.to_s
                when String then type
                else
                  if type.is_a?(Class) && type.respond_to?(:type_info)
                    type.type_info.name
                  else
                    raise "Unknown type: #{type}"
                  end
                end

      defined_fields[name] = TypeDesc.new(name: name, type: ts_type, nullable: nullable, many: many, optional: optional)
    end

    def merge!(other)
      defined_fields.merge!(other.defined_fields)
    end

    def from_args!(args)
      args.each do |k, fieldargs|
        if fieldargs.is_a?(Array)
          add_field(k, fieldargs[0],  **fieldargs[1..-1].first)
        else
          add_field(k, fieldargs)
        end
      end
    end
  end
end