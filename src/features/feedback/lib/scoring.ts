export interface FeedbackRatings {
  value_for_money: number
  service_quality: number
  room_cleanliness: number
  amenities_provided: number
  recommend_to_colleagues: number
}

export function calculateWeightedScore(ratings: FeedbackRatings): number {
  // Weights from PRD:
  // Cleanliness = 30%
  // Service = 30%
  // Value = 20%
  // Amenities = 10%
  // Recommendation = 10%

  const cleanlinessContribution = ratings.room_cleanliness * 0.30
  const serviceContribution = ratings.service_quality * 0.30
  const valueContribution = ratings.value_for_money * 0.20
  const amenitiesContribution = ratings.amenities_provided * 0.10
  const recommendationContribution = ratings.recommend_to_colleagues * 0.10

  const totalScore = 
    cleanlinessContribution + 
    serviceContribution + 
    valueContribution + 
    amenitiesContribution + 
    recommendationContribution

  // Return rounded to 2 decimal places
  return Math.round(totalScore * 100) / 100
}

export function calculateWeightedRanking(avgScore: number, totalFeedbacks: number): number {
  // Simple Bayesian Average variant
  // (v / (v+m)) * R + (m / (v+m)) * C
  // v = totalFeedbacks
  // m = min reviews (say 5)
  // R = avgScore
  // C = global mean (say 3.0)
  
  const m = 5
  const C = 3.0
  const v = totalFeedbacks
  const R = avgScore

  const weightedScore = (v / (v + m)) * R + (m / (v + m)) * C
  
  return Math.round(weightedScore * 100) / 100
}
