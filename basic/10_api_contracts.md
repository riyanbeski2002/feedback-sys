# API Contracts

## 1. POST /api/bookings/simulate-checkout
### Purpose
Mark a booking as completed and make it feedback-eligible.

### Request
```json
{
  "bookingId": "uuid"
}
```

### Response
```json
{
  "success": true,
  "booking": {
    "id": "uuid",
    "status": "completed",
    "feedback_eligible": true
  }
}
```

## 2. POST /api/feedback/trigger
### Purpose
Mark feedback as sent and prepare notification previews.

### Request
```json
{
  "bookingId": "uuid"
}
```

### Response
```json
{
  "success": true,
  "channels": ["email", "whatsapp", "slack", "teams"]
}
```

## 3. GET /api/hotels
### Purpose
Return hotels sorted by ranking score.

### Response
```json
{
  "hotels": [
    {
      "id": "uuid",
      "name": "Grand Meridian",
      "location": "Bengaluru",
      "avg_score": 4.42,
      "total_feedbacks": 12,
      "status_bucket": "stable"
    }
  ]
}
```

## 4. GET /api/bookings
### Purpose
Return seeded and current bookings for booking simulation page.

## 5. GET /api/admin/summary
### Purpose
Return summary cards and flagged hotel metrics.

## 6. POST /api/feedback
### Purpose
Submit detailed feedback, compute score and update hotel aggregate.

### Request
```json
{
  "bookingId": "uuid",
  "hotelId": "uuid",
  "valueForMoney": 4,
  "serviceQuality": 5,
  "roomCleanliness": 5,
  "amenitiesProvided": 4,
  "repeatStayLikelihood": 4,
  "recommendToColleagues": 5,
  "comment": "Very clean rooms and courteous staff"
}
```

### Response
```json
{
  "success": true,
  "feedback": {
    "computedScore": 4.6,
    "sentimentLabel": "positive",
    "issueCategory": null
  },
  "hotel": {
    "avgScore": 4.48,
    "statusBucket": "stable"
  }
}
```
