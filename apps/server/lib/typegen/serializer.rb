module Typegen
  module Serializer

    def self.included(base)
      base.extend(ClassMethods)
    end

    def self.extended(base)
      base.extend(ClassMethods)
    end

    module ClassMethods
      def type_info
        @type_info ||= TypeInfo.new(self.name, superclass)
      end

      # supports calls like:
      # type(id: :string )
      # type({ id: [:string, optional: true] })
      # type('User', {id: :string} )
      def type(*args)
        if args.length == 1
          type_info.from_args!(args.first)
        else
          type_info.name = args.first
          type_info.from_args!(args.last)
        end
      end
    end
  end
end