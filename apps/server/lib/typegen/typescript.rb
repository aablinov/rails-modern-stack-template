module Typegen
  class Typescript
    include Typegen::Helpers

    TEMPLATES = {
      type: Rails.root.join('lib', 'typegen', 'templates', 'type.ts.erb'),
      api: Rails.root.join('lib', 'typegen', 'templates', 'api.ts.erb'),
      api_method: Rails.root.join('lib', 'typegen', 'templates', 'api_method.ts.erb'),
      api_namespace: Rails.root.join('lib', 'typegen', 'templates', 'api_namespace.ts.erb')
    }

    attr_reader :base_url, :output_path, :base_serializer_class, :base_controller_class

    def initialize(base_url, output_path, base_serializer_class:, base_controller_class:)
      @base_url = base_url
      @output_path = output_path
      @base_serializer_class = base_serializer_class
      @base_controller_class = base_controller_class
    end

    def render
      unless File.exist?(output_path)
        FileUtils.mkdir_p(File.dirname(output_path))
      end

      template = ERB.new(File.read(TEMPLATES[:api]), trim_mode: '-')

      output = []

      @base_url = base_url

      @types = render_types
      @namespaces = render_api_namespaces

      output << template.result(binding)

      File.open(output_path, 'w') do |f|
        f.write(output.join("\n"))
      end
    end

    protected

    def render_types
      template = ERB.new(File.read(TEMPLATES[:type]), trim_mode: '-')

      output = []

      base_serializer_class.descendants.each do |serializer|
        type_info = serializer.type_info
        type_name = type_info.name

        @name = type_name
        @fields = self.class.build_typescript_methods_args_from_type_info(type_info, wrap: false, new_line: true)

        puts "🆃  [Typegen] #{type_name}"

        output << template.result(binding)
      end

      return output.join("\n")
    end

    def render_api_namespaces
      template = ERB.new(File.read(TEMPLATES[:api_namespace]), trim_mode: '-')

      namespaces = {}

      base_controller_class.descendants.each do |controller|
        api_methods = controller.defined_api_methods

        if api_methods.any?
          api_methods.each do |method|
            method[:name].split('.').tap do |namespace, method_name|
              namespaces[namespace] ||= []
              namespaces[namespace] << method
            end
          end
        end
      end

      output = []

      namespaces.each do |namespace, methods|
        @name = namespace

        puts "🅽  [Typegen] #{namespace}"

        @methods = methods.map do |method|
          render_api_method(method)
        end.join("\n")

        output << template.result(binding)
      end

      return output.join("\n")
    end

    def render_api_method(method)
      template = ERB.new(File.read(TEMPLATES[:api_method]), trim_mode: '-')

      output = []

      @method_name = method[:name].split('.').last
      @method_param_data = method[:request].name == '__inline' ? self.class.build_typescript_methods_args_from_type_info(method[:request]) : method[:request].name
      @method_response_schema = method[:response].name == '__inline' ? self.class.build_typescript_methods_args_from_type_info(method[:response]) : method[:response].name
      @method_path = method[:name]

      output << template.result(binding)

      puts "🅼  [Typegen] #{method[:name]}"

      return output.join("\n")
    end
  end
end