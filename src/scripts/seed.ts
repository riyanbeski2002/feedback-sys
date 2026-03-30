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

// ---------------------------------------------------------------------------
// Stable UUID constants — deterministic FK references without DB lookups
// ---------------------------------------------------------------------------

const HOTEL_IDS = {
  grandRoyalBangalore:   'a1b2c3d4-e5f6-0001-0001-000000000001',
  marineDriveSuites:     'a1b2c3d4-e5f6-0001-0001-000000000002',
  delhiResidency:        'a1b2c3d4-e5f6-0001-0001-000000000003',
  budgetStayKoramangala: 'a1b2c3d4-e5f6-0001-0001-000000000004',
  airportExpressInn:     'a1b2c3d4-e5f6-0001-0001-000000000005',
  gatewayPalace:         'a1b2c3d4-e5f6-0001-0001-000000000006',
}

const BOOKING_IDS = {
  // Completed bookings with feedback already submitted (14 rows)
  priyaGrandRoyal1:  'b0000001-0001-0001-0001-000000000001',
  arjunGrandRoyal2:  'b0000001-0001-0001-0001-000000000002',
  kavithaDelhi1:     'b0000001-0001-0001-0001-000000000003',
  rohanDelhi2:       'b0000001-0001-0001-0001-000000000004',
  snehaAirport1:     'b0000001-0001-0001-0001-000000000005',
  amitMarine1:       'b0000001-0001-0001-0001-000000000006',
  priyaMarine2:      'b0000001-0001-0001-0001-000000000007',
  arjunAirport2:     'b0000001-0001-0001-0001-000000000008',
  kavithaGateway1:   'b0000001-0001-0001-0001-000000000009',
  rohanGateway2:     'b0000001-0001-0001-0001-000000000010',
  snehaKoramangala1: 'b0000001-0001-0001-0001-000000000011',
  amitKoramangala2:  'b0000001-0001-0001-0001-000000000012',
  priyaMarine3:      'b0000001-0001-0001-0001-000000000013',
  arjunGrandRoyal3:  'b0000001-0001-0001-0001-000000000014',
  // Open bookings (status: 'booked') — 2 per hotel, b0000002-* range
  open_01: 'b0000002-0001-0001-0001-000000000001',
  open_02: 'b0000002-0001-0001-0001-000000000002',
  open_03: 'b0000002-0001-0001-0001-000000000003',
  open_04: 'b0000002-0001-0001-0001-000000000004',
  open_05: 'b0000002-0001-0001-0001-000000000005',
  open_06: 'b0000002-0001-0001-0001-000000000006',
  open_07: 'b0000002-0001-0001-0001-000000000007',
  open_08: 'b0000002-0001-0001-0001-000000000008',
  open_09: 'b0000002-0001-0001-0001-000000000009',
  open_10: 'b0000002-0001-0001-0001-000000000010',
  open_11: 'b0000002-0001-0001-0001-000000000011',
  open_12: 'b0000002-0001-0001-0001-000000000012',
}

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().split('T')[0]
}

function daysFromNow(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

// ---------------------------------------------------------------------------
// Seed
// ---------------------------------------------------------------------------

async function seed() {
  console.log('Starting seed...')

  // -------------------------------------------------------------------------
  // Guard: exit early if hotels already exist
  // -------------------------------------------------------------------------
  const { count, error: countError } = await supabase
    .from('hotels')
    .select('*', { count: 'exact', head: true })

  if (countError) {
    console.error('Error checking hotel count:', countError)
    return
  }

  if (count !== null && count > 0) {
    console.log(`${count} hotels already exist — skipping seed`)
    return
  }

  // -------------------------------------------------------------------------
  // 1. feedback_config — upsert on singleton
  // -------------------------------------------------------------------------
  const { error: configError } = await supabase
    .from('feedback_config')
    .upsert(
      [
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
        },
      ],
      { onConflict: 'singleton' }
    )

  if (configError) {
    console.error('Error upserting feedback_config:', configError)
    return
  }
  console.log('Config upserted')

  // -------------------------------------------------------------------------
  // 2. Hotels — upsert on id
  // -------------------------------------------------------------------------
  const { error: hotelsError } = await supabase
    .from('hotels')
    .upsert(
      [
        {
          id: HOTEL_IDS.grandRoyalBangalore,
          name: 'Grand Royal Bangalore',
          location: 'Indiranagar, Bangalore',
          avg_score: 4.8,
          total_feedbacks: 19,
          status_bucket: 'top_rated',
        },
        {
          id: HOTEL_IDS.marineDriveSuites,
          name: 'Marine Drive Suites',
          location: 'Marine Drive, Mumbai',
          avg_score: 3.8,
          total_feedbacks: 25,
          status_bucket: 'stable',
        },
        {
          id: HOTEL_IDS.delhiResidency,
          name: 'The Delhi Residency',
          location: 'Connaught Place, Delhi',
          avg_score: 4.6,
          total_feedbacks: 12,
          status_bucket: 'top_rated',
        },
        {
          id: HOTEL_IDS.budgetStayKoramangala,
          name: 'Budget Stay Koramangala',
          location: 'Koramangala, Bangalore',
          avg_score: 2.3,
          total_feedbacks: 14,
          status_bucket: 'needs_review',
        },
        {
          id: HOTEL_IDS.airportExpressInn,
          name: 'Airport Express Inn',
          location: 'Aerocity, Delhi',
          avg_score: 3.5,
          total_feedbacks: 32,
          status_bucket: 'stable',
        },
        {
          id: HOTEL_IDS.gatewayPalace,
          name: 'Gateway Palace',
          location: 'Colaba, Mumbai',
          avg_score: 1.6,
          total_feedbacks: 7,
          status_bucket: 'flagged',
        },
      ],
      { onConflict: 'id' }
    )

  if (hotelsError) {
    console.error('Error upserting hotels:', hotelsError)
    return
  }
  console.log('6 hotels upserted')

  // -------------------------------------------------------------------------
  // 3. Bookings — upsert on id
  // -------------------------------------------------------------------------
  const checkinDate = daysAgo(14)
  const checkoutDate = daysAgo(7)

  const completedBookings = [
    // Grand Royal Bangalore
    { id: BOOKING_IDS.priyaGrandRoyal1,  hotel_id: HOTEL_IDS.grandRoyalBangalore,   traveller_name: 'Priya Sharma',  traveller_email: 'priya.sharma@corp.in',  checkin_date: checkinDate, checkout_date: checkoutDate, status: 'completed', feedback_eligible: false },
    { id: BOOKING_IDS.arjunGrandRoyal2,  hotel_id: HOTEL_IDS.grandRoyalBangalore,   traveller_name: 'Arjun Mehta',   traveller_email: 'arjun.mehta@corp.in',   checkin_date: checkinDate, checkout_date: checkoutDate, status: 'completed', feedback_eligible: false },
    { id: BOOKING_IDS.arjunGrandRoyal3,  hotel_id: HOTEL_IDS.grandRoyalBangalore,   traveller_name: 'Arjun Mehta',   traveller_email: 'arjun.mehta@corp.in',   checkin_date: checkinDate, checkout_date: checkoutDate, status: 'completed', feedback_eligible: false },
    // The Delhi Residency
    { id: BOOKING_IDS.kavithaDelhi1,     hotel_id: HOTEL_IDS.delhiResidency,        traveller_name: 'Kavitha Nair',  traveller_email: 'kavitha.nair@corp.in',  checkin_date: checkinDate, checkout_date: checkoutDate, status: 'completed', feedback_eligible: false },
    { id: BOOKING_IDS.rohanDelhi2,       hotel_id: HOTEL_IDS.delhiResidency,        traveller_name: 'Rohan Verma',   traveller_email: 'rohan.verma@corp.in',   checkin_date: checkinDate, checkout_date: checkoutDate, status: 'completed', feedback_eligible: false },
    // Airport Express Inn
    { id: BOOKING_IDS.snehaAirport1,     hotel_id: HOTEL_IDS.airportExpressInn,     traveller_name: 'Sneha Iyer',    traveller_email: 'sneha.iyer@corp.in',    checkin_date: checkinDate, checkout_date: checkoutDate, status: 'completed', feedback_eligible: false },
    { id: BOOKING_IDS.arjunAirport2,     hotel_id: HOTEL_IDS.airportExpressInn,     traveller_name: 'Arjun Mehta',   traveller_email: 'arjun.mehta@corp.in',   checkin_date: checkinDate, checkout_date: checkoutDate, status: 'completed', feedback_eligible: false },
    // Marine Drive Suites
    { id: BOOKING_IDS.amitMarine1,       hotel_id: HOTEL_IDS.marineDriveSuites,     traveller_name: 'Amit Patel',    traveller_email: 'amit.patel@corp.in',    checkin_date: checkinDate, checkout_date: checkoutDate, status: 'completed', feedback_eligible: false },
    { id: BOOKING_IDS.priyaMarine2,      hotel_id: HOTEL_IDS.marineDriveSuites,     traveller_name: 'Priya Sharma',  traveller_email: 'priya.sharma@corp.in',  checkin_date: checkinDate, checkout_date: checkoutDate, status: 'completed', feedback_eligible: false },
    { id: BOOKING_IDS.priyaMarine3,      hotel_id: HOTEL_IDS.marineDriveSuites,     traveller_name: 'Priya Sharma',  traveller_email: 'priya.sharma@corp.in',  checkin_date: checkinDate, checkout_date: checkoutDate, status: 'completed', feedback_eligible: false },
    // Gateway Palace
    { id: BOOKING_IDS.kavithaGateway1,   hotel_id: HOTEL_IDS.gatewayPalace,         traveller_name: 'Kavitha Nair',  traveller_email: 'kavitha.nair@corp.in',  checkin_date: checkinDate, checkout_date: checkoutDate, status: 'completed', feedback_eligible: false },
    { id: BOOKING_IDS.rohanGateway2,     hotel_id: HOTEL_IDS.gatewayPalace,         traveller_name: 'Rohan Verma',   traveller_email: 'rohan.verma@corp.in',   checkin_date: checkinDate, checkout_date: checkoutDate, status: 'completed', feedback_eligible: false },
    // Budget Stay Koramangala
    { id: BOOKING_IDS.snehaKoramangala1, hotel_id: HOTEL_IDS.budgetStayKoramangala, traveller_name: 'Sneha Iyer',    traveller_email: 'sneha.iyer@corp.in',    checkin_date: checkinDate, checkout_date: checkoutDate, status: 'completed', feedback_eligible: false },
    { id: BOOKING_IDS.amitKoramangala2,  hotel_id: HOTEL_IDS.budgetStayKoramangala, traveller_name: 'Amit Patel',    traveller_email: 'amit.patel@corp.in',    checkin_date: checkinDate, checkout_date: checkoutDate, status: 'completed', feedback_eligible: false },
  ]

  // Open (future) bookings — 2 per hotel, for the Bookings page
  const futureCheckin = daysFromNow(3)
  const futureCheckout = daysFromNow(6)

  const openBookings = [
    { id: BOOKING_IDS.open_01,  hotel_id: HOTEL_IDS.grandRoyalBangalore,   traveller_name: 'Rohan Verma',  traveller_email: 'rohan.verma@corp.in',  checkin_date: futureCheckin, checkout_date: futureCheckout, status: 'booked', feedback_eligible: false },
    { id: BOOKING_IDS.open_02,  hotel_id: HOTEL_IDS.grandRoyalBangalore,   traveller_name: 'Amit Patel',   traveller_email: 'amit.patel@corp.in',   checkin_date: futureCheckin, checkout_date: futureCheckout, status: 'booked', feedback_eligible: false },
    { id: BOOKING_IDS.open_03,  hotel_id: HOTEL_IDS.marineDriveSuites,     traveller_name: 'Arjun Mehta',  traveller_email: 'arjun.mehta@corp.in',  checkin_date: futureCheckin, checkout_date: futureCheckout, status: 'booked', feedback_eligible: false },
    { id: BOOKING_IDS.open_04,  hotel_id: HOTEL_IDS.marineDriveSuites,     traveller_name: 'Kavitha Nair', traveller_email: 'kavitha.nair@corp.in', checkin_date: futureCheckin, checkout_date: futureCheckout, status: 'booked', feedback_eligible: false },
    { id: BOOKING_IDS.open_05,  hotel_id: HOTEL_IDS.delhiResidency,        traveller_name: 'Sneha Iyer',   traveller_email: 'sneha.iyer@corp.in',   checkin_date: futureCheckin, checkout_date: futureCheckout, status: 'booked', feedback_eligible: false },
    { id: BOOKING_IDS.open_06,  hotel_id: HOTEL_IDS.delhiResidency,        traveller_name: 'Priya Sharma', traveller_email: 'priya.sharma@corp.in', checkin_date: futureCheckin, checkout_date: futureCheckout, status: 'booked', feedback_eligible: false },
    { id: BOOKING_IDS.open_07,  hotel_id: HOTEL_IDS.budgetStayKoramangala, traveller_name: 'Rohan Verma',  traveller_email: 'rohan.verma@corp.in',  checkin_date: futureCheckin, checkout_date: futureCheckout, status: 'booked', feedback_eligible: false },
    { id: BOOKING_IDS.open_08,  hotel_id: HOTEL_IDS.budgetStayKoramangala, traveller_name: 'Arjun Mehta',  traveller_email: 'arjun.mehta@corp.in',  checkin_date: futureCheckin, checkout_date: futureCheckout, status: 'booked', feedback_eligible: false },
    { id: BOOKING_IDS.open_09,  hotel_id: HOTEL_IDS.airportExpressInn,     traveller_name: 'Amit Patel',   traveller_email: 'amit.patel@corp.in',   checkin_date: futureCheckin, checkout_date: futureCheckout, status: 'booked', feedback_eligible: false },
    { id: BOOKING_IDS.open_10,  hotel_id: HOTEL_IDS.airportExpressInn,     traveller_name: 'Kavitha Nair', traveller_email: 'kavitha.nair@corp.in', checkin_date: futureCheckin, checkout_date: futureCheckout, status: 'booked', feedback_eligible: false },
    { id: BOOKING_IDS.open_11,  hotel_id: HOTEL_IDS.gatewayPalace,         traveller_name: 'Priya Sharma', traveller_email: 'priya.sharma@corp.in', checkin_date: futureCheckin, checkout_date: futureCheckout, status: 'booked', feedback_eligible: false },
    { id: BOOKING_IDS.open_12,  hotel_id: HOTEL_IDS.gatewayPalace,         traveller_name: 'Sneha Iyer',   traveller_email: 'sneha.iyer@corp.in',   checkin_date: futureCheckin, checkout_date: futureCheckout, status: 'booked', feedback_eligible: false },
  ]

  const { error: bookingsError } = await supabase
    .from('bookings')
    .upsert([...completedBookings, ...openBookings], { onConflict: 'id' })

  if (bookingsError) {
    console.error('Error upserting bookings:', bookingsError)
    return
  }
  console.log(`${completedBookings.length + openBookings.length} bookings upserted`)

  // -------------------------------------------------------------------------
  // 4. Feedback rows — 14 rows, upsert on booking_id
  // -------------------------------------------------------------------------
  // Helper: compute weighted score using default weights
  function computeScore(rc: number, sq: number, vfm: number, ap: number, rtc: number): number {
    return Math.round((rc * 0.30 + sq * 0.30 + vfm * 0.20 + ap * 0.10 + rtc * 0.10) * 100) / 100
  }

  const feedbackRows = [
    // --- Positive (4 rows — top-rated hotels, scores 4.5–5.0) ---
    {
      booking_id: BOOKING_IDS.priyaGrandRoyal1,
      hotel_id: HOTEL_IDS.grandRoyalBangalore,
      room_cleanliness: 5, service_quality: 5, value_for_money: 5, amenities_provided: 4, recommend_to_colleagues: 5,
      computed_score: computeScore(5, 5, 5, 4, 5),
      comment: 'Spotless rooms and exceptional staff throughout. The breakfast spread was impressive — clearly a cut above other corporate stays in Bangalore. Will absolutely recommend to our travel desk.',
      sentiment_label: 'Positive',
      issue_category: 'Top Rated',
    },
    {
      booking_id: BOOKING_IDS.arjunGrandRoyal2,
      hotel_id: HOTEL_IDS.grandRoyalBangalore,
      room_cleanliness: 5, service_quality: 5, value_for_money: 4, amenities_provided: 5, recommend_to_colleagues: 5,
      computed_score: computeScore(5, 5, 4, 5, 5),
      comment: 'Seamless check-in, fast WiFi, and the room was immaculate. Perfect for back-to-back meetings. The concierge arranged a late checkout without any fuss.',
      sentiment_label: 'Positive',
      issue_category: 'Top Rated',
    },
    {
      booking_id: BOOKING_IDS.kavithaDelhi1,
      hotel_id: HOTEL_IDS.delhiResidency,
      room_cleanliness: 5, service_quality: 5, value_for_money: 5, amenities_provided: 4, recommend_to_colleagues: 5,
      computed_score: computeScore(5, 5, 5, 4, 5),
      comment: 'Outstanding property. The Delhi Residency is exactly what a business traveller needs — quiet floors, reliable room service until midnight, and a gym that actually has working equipment.',
      sentiment_label: 'Positive',
      issue_category: 'Top Rated',
    },
    {
      booking_id: BOOKING_IDS.rohanDelhi2,
      hotel_id: HOTEL_IDS.delhiResidency,
      room_cleanliness: 5, service_quality: 5, value_for_money: 4, amenities_provided: 4, recommend_to_colleagues: 4,
      computed_score: computeScore(5, 5, 4, 4, 4),
      comment: 'Consistently excellent across three visits this quarter. The housekeeping team clearly has high standards and the front desk staff remember returning guests.',
      sentiment_label: 'Positive',
      issue_category: 'Top Rated',
    },
    // --- Neutral/mixed (4 rows — stable hotels, scores 3.0–4.2) ---
    {
      booking_id: BOOKING_IDS.snehaAirport1,
      hotel_id: HOTEL_IDS.airportExpressInn,
      room_cleanliness: 4, service_quality: 3, value_for_money: 3, amenities_provided: 3, recommend_to_colleagues: 3,
      computed_score: computeScore(4, 3, 3, 3, 3),
      comment: 'Room was okay, nothing exceptional. Decent location near the airport but the AC was noisy and I had to ask twice to get extra towels. Gets the job done for a one-night transit stay.',
      sentiment_label: 'Neutral',
      issue_category: 'Stable',
    },
    {
      booking_id: BOOKING_IDS.amitMarine1,
      hotel_id: HOTEL_IDS.marineDriveSuites,
      room_cleanliness: 4, service_quality: 3, value_for_money: 4, amenities_provided: 3, recommend_to_colleagues: 3,
      computed_score: computeScore(4, 3, 4, 3, 3),
      comment: 'Marine Drive location is great for evening walks but the hotel itself feels dated. WiFi was patchy on the 7th floor. Room was clean. Would stay again if the price is right.',
      sentiment_label: 'Neutral',
      issue_category: 'Stable',
    },
    {
      booking_id: BOOKING_IDS.priyaMarine2,
      hotel_id: HOTEL_IDS.marineDriveSuites,
      room_cleanliness: 4, service_quality: 3, value_for_money: 3, amenities_provided: 4, recommend_to_colleagues: 3,
      computed_score: computeScore(4, 3, 3, 4, 3),
      comment: 'Adequate for a short trip. Service is friendly but slow — waited 40 minutes for room service breakfast. The conference room facilities are solid.',
      sentiment_label: 'Neutral',
      issue_category: 'Stable',
    },
    {
      booking_id: BOOKING_IDS.arjunAirport2,
      hotel_id: HOTEL_IDS.airportExpressInn,
      room_cleanliness: 3, service_quality: 4, value_for_money: 4, amenities_provided: 3, recommend_to_colleagues: 4,
      computed_score: computeScore(3, 4, 4, 3, 4),
      comment: 'Check-in was smooth, room was functional. Nothing wowed me but nothing disappointed either. The business lounge was a welcome addition.',
      sentiment_label: 'Neutral',
      issue_category: 'Stable',
    },
    // --- Negative/critical (4 rows — needs-review and flagged hotels, scores 1.0–2.5) ---
    {
      booking_id: BOOKING_IDS.kavithaGateway1,
      hotel_id: HOTEL_IDS.gatewayPalace,
      room_cleanliness: 1, service_quality: 1, value_for_money: 1, amenities_provided: 2, recommend_to_colleagues: 1,
      computed_score: computeScore(1, 1, 1, 2, 1),
      comment: 'Absolutely unacceptable. Dirty bathroom with visible mould, the front desk ignored two requests to fix the broken air conditioning, and there was a cockroach in the wardrobe. Will not return and will be escalating to our corporate travel manager.',
      sentiment_label: 'Negative',
      issue_category: 'URGENT',
      urgency_flag: true,
    },
    {
      booking_id: BOOKING_IDS.rohanGateway2,
      hotel_id: HOTEL_IDS.gatewayPalace,
      room_cleanliness: 1, service_quality: 1, value_for_money: 1, amenities_provided: 2, recommend_to_colleagues: 1,
      computed_score: computeScore(1, 1, 1, 2, 1),
      comment: 'The room smelled damp and the sheets had stains. Called housekeeping at 9pm — nobody came. Checkout was a 20-minute ordeal over a billing error. This property should not be on our corporate list.',
      sentiment_label: 'Negative',
      issue_category: 'URGENT',
      urgency_flag: true,
    },
    {
      booking_id: BOOKING_IDS.snehaKoramangala1,
      hotel_id: HOTEL_IDS.budgetStayKoramangala,
      room_cleanliness: 3, service_quality: 2, value_for_money: 1, amenities_provided: 2, recommend_to_colleagues: 2,
      computed_score: computeScore(3, 2, 1, 2, 2),
      comment: 'Overpriced for what you get. Noisy corridors until 2am, minibar was empty and never restocked despite repeated requests. The lift was broken on day 2 — not acceptable for a property at this price point.',
      sentiment_label: 'Negative',
      issue_category: 'Needs Review',
    },
    {
      booking_id: BOOKING_IDS.amitKoramangala2,
      hotel_id: HOTEL_IDS.budgetStayKoramangala,
      room_cleanliness: 2, service_quality: 2, value_for_money: 2, amenities_provided: 3, recommend_to_colleagues: 2,
      computed_score: computeScore(2, 2, 2, 3, 2),
      comment: 'Disappointing stay. The reception staff were dismissive when I reported a leaking tap and the room had not been properly cleaned between guests. Below standard for business travel.',
      sentiment_label: 'Negative',
      issue_category: 'Needs Review',
    },
    // --- Multi-category (2 rows) ---
    {
      booking_id: BOOKING_IDS.priyaMarine3,
      hotel_id: HOTEL_IDS.marineDriveSuites,
      room_cleanliness: 5, service_quality: 2, value_for_money: 2, amenities_provided: 4, recommend_to_colleagues: 3,
      computed_score: computeScore(5, 2, 2, 4, 3),
      comment: 'Mixed experience. The room itself was very clean and the amenities were good (great gym, fast WiFi), but the service at the restaurant was slow and the value for money is poor compared to similar properties in Mumbai. Would consider returning only if rates drop.',
      sentiment_label: 'Neutral',
      issue_category: 'Stable',
    },
    {
      booking_id: BOOKING_IDS.arjunGrandRoyal3,
      hotel_id: HOTEL_IDS.grandRoyalBangalore,
      room_cleanliness: 5, service_quality: 5, value_for_money: 3, amenities_provided: 5, recommend_to_colleagues: 4,
      computed_score: computeScore(5, 5, 3, 5, 4),
      comment: 'Grand Royal surprised me — excellent cleanliness standards, responsive service, great amenities. The only area for improvement is value: the room rate is high relative to what Bangalore offers. Would still recommend for important client visits.',
      sentiment_label: 'Positive',
      issue_category: 'Top Rated',
    },
  ]

  const { error: feedbackError } = await supabase
    .from('feedback')
    .upsert(feedbackRows, { onConflict: 'booking_id' })

  if (feedbackError) {
    console.error('Error upserting feedback:', feedbackError)
    return
  }
  console.log(`${feedbackRows.length} feedback rows upserted`)

  console.log(`Seed complete: 6 hotels, ${completedBookings.length + openBookings.length} bookings, ${feedbackRows.length} feedback rows, 1 config`)
}

seed().catch(console.error)
