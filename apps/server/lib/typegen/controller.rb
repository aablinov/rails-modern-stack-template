module Typegen
  module Controller

    def self.included(base)
      base.extend(ClassMethods)
    end

    def self.extended(base)
      base.extend(ClassMethods)
    end

    module ClassMethods
      def defined_api_methods
        @defined_api_methods ||= []
      end

      def api_method(name, options = {})

        desc = {
          request: nil,
          response: nil,
        }

        if options[:request]
          if options[:request].is_a?(Class) && options[:request].respond_to?(:type_info)
            desc[:request] = options[:request].type_info
          else
            desc[:request] = Typegen::TypeInfo.new('__inline', nil)
            desc[:request].from_args!(options[:request])
          end
        else
          desc[:request] = Typegen::TypeInfo.new('any', nil)
        end

        if options[:response]
          if options[:response].is_a?(Class) && options[:response].respond_to?(:type_info)
            desc[:response] = options[:response].type_info
          else
            desc[:response] = Typegen::TypeInfo.new('__inline', nil)
            desc[:response].from_args!(options[:response])
          end
        else
          desc[:response] = Typegen::TypeInfo.new('any', nil)
        end

        defined_api_methods << {name: name }.merge(desc)
      end
    end
  end
end