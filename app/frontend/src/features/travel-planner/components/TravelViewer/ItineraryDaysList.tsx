"use client"

import { TravelItineraryDay } from "@/api/backend"
import { Title } from "@/components/atoms/Title"

interface ItineraryDaysListProps {
  days: TravelItineraryDay[]
}

export const ItineraryDaysList = ({ days }: ItineraryDaysListProps) => {
  if (days.length === 0) {
    return <p className="text-gray-600 text-sm italic">No days added to your itinerary yet.</p>
  }

  return (
    <div className="space-y-3 mt-2">
      {days.map((day, index) => (
        <ItineraryDay key={day.id} day={day} dayNumber={index + 1} />
      ))}
    </div>
  )
}

interface ItineraryDayProps {
  day: TravelItineraryDay
  dayNumber: number
}

const ItineraryDay = ({ day, dayNumber }: ItineraryDayProps) => {
  return (
    <div className="border rounded-md p-3 bg-white shadow-sm hover:shadow-md transition-shadow">
      <Title as="h4" variant="h4" className="font-medium text-base mb-1">Day {dayNumber}</Title>
      {day.activities.length === 0 ? (
        <p className="text-gray-500 italic text-xs">
          No activities planned for this day.
        </p>
      ) : (
        <ul className="list-disc list-inside space-y-0.5 text-sm">
          {day.activities.map((activity, actIndex) => {
            // Handle both string and object activities
            const activityText = typeof activity === 'string' 
              ? activity 
              : activity.description;
            
            // Get hours if available
            const hours = typeof activity === 'object' && activity.hours 
              ? activity.hours 
              : null;
            
            return (
              <li
                key={`${day.id}-activity-${actIndex}`}
                className="text-gray-700 flex items-start"
              >
                <span>{activityText}</span>
                {hours && (
                  <span className="ml-2 text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full whitespace-nowrap">
                    {hours} {hours === 1 ? 'hour' : 'hours'}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  )
}
