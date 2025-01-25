# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end


# Create a default user

project = Project.find_or_create_by!(name: 'Default Project')
project1 = Project.find_or_create_by!(name: 'Default Project 1')

user = User.find_or_create_by!(email: 'dev@dev.com', name: 'Dev')


project.project_members.find_or_create_by!(user: user, role: 'admin')
project1.project_members.find_or_create_by!(user: user, role: 'admin')