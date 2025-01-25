module Typegen
  module Helpers

    def self.included(base)
      base.extend(ClassMethods)
    end

    def self.extended(base)
      base.extend(ClassMethods)
    end

    module ClassMethods
      def build_typescript_field(field)
        raise ArgumentError unless field.is_a?(Typegen::TypeInfo::TypeDesc)

        name = [field.name, (field.optional ? '?' : ''), ':'].join

        type_desc = [name]

        if field.many
          type_desc << field.type + '[]'
        else
          type_desc << field.type
        end

        if field.nullable
          type_desc << '| null'
        end

        type_desc.join(' ')
      end

      # Build TS method arguments: like {id: string, name: string} etc.
      def build_typescript_methods_args_from_type_info(type_info, wrap: true, new_line: false)
        args = type_info.defined_fields.map do |_, field|
          build_typescript_field(field)
        end

        args = new_line ? args.join(",\n") : args.join(", ")

        wrap ? "{#{args}}" : args
      end
    end
  end
end