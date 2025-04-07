# Create admin user
User.create!(
  email: 'admin@example.com',
  password: 'password123',
  role: 'admin'
)

# Create regular users
5.times do |i|
  User.create!(
    email: "user#{i+1}@example.com",
    password: 'password123',
    role: 'user'
  )
end

# Create locations
User.where(role: 'user').each do |user|
  # Each user gets 3 random locations
  3.times do |i|
    # Generate random coordinates around Kisumu City
    lat = -0.094458 + (rand - 0.5) * 0.1
    lng = 34.7503131 + (rand - 0.5) * 0.1

    user.locations.create!(
      name: "#{user.email.split('@').first}'s Location #{i+1}",
      latitude: lat,
      longitude: lng
    )
  end
end

puts "Seed data created successfully!"
