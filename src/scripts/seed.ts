const { createClient } = require('@supabase/supabase-js')
const dotenv = require('dotenv')
const path = require('path')

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seed() {
  console.log('🌱 Starting seed...')

  // 1. Initial Configuration
  const { data: config, error: configError } = await supabase
    .from('feedback_config')
    .insert([
      {
        trigger_delay_hours: 1,
        cleanliness_weight: 0.30,
        service_weight: 0.30,
        value_weight: 0.20,
        amenities_weight: 0.10,
        intent_weight: 0.10,
        boost_threshold: 4.50,
        neutral_threshold: 3.00,
        flagged_threshold: 2.00,
      }
    ])
    .select()

  if (configError) {
    console.error('Error seeding config:', configError)
  } else {
    console.log('✓ Feedback config seeded')
  }

  // 2. Hotels
  const hotelsData = [
    { name: 'Grand Royal Bangalore', location: 'Indiranagar, Bangalore', avg_score: 4.2, total_feedbacks: 15, status_bucket: 'top_rated' },
    { name: 'Marine Drive Suites', location: 'Marine Drive, Mumbai', avg_score: 3.8, total_feedbacks: 22, status_bucket: 'stable' },
    { name: 'The Delhi Residency', location: 'Connaught Place, Delhi', avg_score: 4.5, total_feedbacks: 8, status_bucket: 'top_rated' },
    { name: 'Budget Stay Koramangala', location: 'Koramangala, Bangalore', avg_score: 2.1, total_feedbacks: 12, status_bucket: 'needs_review' },
    { name: 'Airport Express Inn', location: 'Aerocity, Delhi', avg_score: 3.5, total_feedbacks: 30, status_bucket: 'stable' },
    { name: 'Gateway Palace', location: 'Colaba, Mumbai', avg_score: 1.8, total_feedbacks: 5, status_bucket: 'flagged' },
  ]

  const { data: hotels, error: hotelsError } = await supabase
    .from('hotels')
    .insert(hotelsData)
    .select()

  if (hotelsError) {
    console.error('Error seeding hotels:', hotelsError)
    return
  }
  console.log(`✓ ${hotels.length} hotels seeded`)

  // 3. Bookings
  const bookingsData = []
  const travellers = [
    { name: 'Riyan Khan', email: 'riyan@example.com' },
    { name: 'Sarah Jones', email: 'sarah@example.com' },
    { name: 'Amit Sharma', email: 'amit@example.com' },
    { name: 'Elena Rodriguez', email: 'elena@example.com' },
  ]

  // Create some "completed" bookings for Bangalore and Mumbai
  hotels.forEach((hotel, index) => {
    travellers.forEach((traveller, tIndex) => {
      const checkout = new Date()
      if (tIndex % 2 === 0) {
        // Completed stays
        checkout.setDate(checkout.getDate() - 1)
        bookingsData.push({
          traveller_name: traveller.name,
          traveller_email: traveller.email,
          hotel_id: hotel.id,
          checkin_date: new Date(new Date().setDate(checkout.getDate() - 3)),
          checkout_date: checkout,
          status: 'completed',
          feedback_eligible: true,
        })
      } else {
        // Future bookings
        checkout.setDate(checkout.getDate() + 5)
        bookingsData.push({
          traveller_name: traveller.name,
          traveller_email: traveller.email,
          hotel_id: hotel.id,
          checkin_date: new Date(),
          checkout_date: checkout,
          status: 'booked',
          feedback_eligible: false,
        })
      }
    })
  })

  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .insert(bookingsData)
    .select()

  if (bookingsError) {
    console.error('Error seeding bookings:', bookingsError)
  } else {
    console.log(`✓ ${bookings.length} bookings seeded`)
  }

  console.log('✅ Seed complete!')
}

seed()
