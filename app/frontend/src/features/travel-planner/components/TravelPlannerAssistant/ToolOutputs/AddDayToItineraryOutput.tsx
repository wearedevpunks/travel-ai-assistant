"use client"

import { useEffect } from 'react';
import { ToolOutputProps } from ".";
import { useTravelPlannerStore } from '../../../store';
import { TravelItinerary } from '@/api/backend';

type AddDayResult = {
  itineraryId: string
  itinerary?: TravelItinerary
  addedDayId?: string
}

export const AddDayToItineraryOutput = ({
  toolInvocation,
}: ToolOutputProps) => {
  const { loadItinerary, updateItinerary } = useTravelPlannerStore();

  // Always call useEffect at the component top level
  // but only perform actions if conditions are met
  useEffect(() => {
    if (
      toolInvocation.state === "success" && 
      toolInvocation.result && 
      typeof toolInvocation.result === "object"
    ) {
      const result = toolInvocation.result as AddDayResult;
      
      // If we have the full itinerary in the result, update it directly
      if (result.itinerary) {
        updateItinerary(result.itinerary);
      } else if (result.itineraryId) {
        // Otherwise load from API
        loadItinerary();
      }
    }
  }, [toolInvocation.state, toolInvocation.result, loadItinerary, updateItinerary]);

  // Handle loading state
  if (toolInvocation.state === "loading") {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 my-2">
        <div className="flex items-start">
          <div className="flex-shrink-0 bg-gray-100 p-2 rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-600 animate-spin"
            >
              <path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.7 2.8" />
              <path d="M21 12h-4" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-base font-medium text-gray-900">
              Adding day to your itinerary...
            </h3>
            <div className="mt-1 animate-pulse h-4 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  // Handle error state
  if (toolInvocation.state === "error") {
    return (
      <div className="bg-white border border-red-200 rounded-lg p-4 my-2">
        <div className="flex items-start">
          <div className="flex-shrink-0 bg-red-100 p-2 rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-red-600"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-base font-medium text-gray-900">
              Failed to add day to itinerary
            </h3>
            <div className="mt-1 text-sm text-gray-600">
              {typeof toolInvocation.error === "string"
                ? toolInvocation.error
                : "Unable to add a day to your itinerary. Please try again."}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Cast result to add day data
  const result = toolInvocation.result as AddDayResult

  if (!result || !result.itineraryId) {
    return (
      <div className="bg-white border border-yellow-200 rounded-lg p-4 my-2">
        <div className="flex items-start">
          <div className="flex-shrink-0 bg-yellow-100 p-2 rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-yellow-600"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-base font-medium text-gray-900">
              Day was not added to itinerary
            </h3>
            <div className="mt-1 text-sm text-gray-600">
              We couldn't add a day to your itinerary. The itinerary may not exist
              or may have reached its maximum length.
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Handle button click to view the itinerary
  const handleViewItinerary = () => {
    loadItinerary();
    
    // Scroll to the itinerary viewer
    const viewer = document.getElementById('travel-itinerary-viewer');
    if (viewer) {
      viewer.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <div className="bg-white border border-green-200 rounded-lg p-4 my-2">
      <div className="flex items-start">
        <div className="flex-shrink-0 bg-green-100 p-2 rounded-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-green-600"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-base font-medium text-gray-900">
            Day Added to Itinerary
          </h3>
          <div className="mt-1 text-sm text-gray-600">
            A new day has been added to your travel plan
          </div>
          <div className="mt-4">
            <button
              onClick={handleViewItinerary}
              className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
            >
              <span className="mr-2">View Itinerary</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </button>
          </div>

          <div className="mt-3 text-xs text-gray-500">
            Itinerary ID: {result.itineraryId}
          </div>
        </div>
      </div>
    </div>
  )
}
