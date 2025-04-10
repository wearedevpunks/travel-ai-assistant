/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TravelItineraryDay } from './TravelItineraryDay';
import type { TravelItineraryDestination } from './TravelItineraryDestination';
export type TravelItinerary = {
    /**
     * The unique identifier for the itinerary
     */
    id: string;
    /**
     * The destination ID of the itinerary
     */
    destination: TravelItineraryDestination;
    /**
     * List of days in the itinerary
     */
    days: Array<TravelItineraryDay>;
};

