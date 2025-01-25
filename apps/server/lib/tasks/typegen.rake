task typegen: :environment do
  puts "🚀 [Typegen] Generating TypeScript types..."

  Rails.application.eager_load!

  ts = Typegen::Typescript.new('http://localhost:3001/api/v1/', Rails.root.join('../../packages/server/src/types', 'index.ts'),
                          base_serializer_class: TypedSerializer,
                          base_controller_class: Api::ApplicationController)

  ts.render

  puts "✅ [Typegen] Typescript generated in #{ts.output_path}"
  puts "✅ [Typegen] Done!"
end