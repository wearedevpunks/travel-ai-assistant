/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TravelItineraryDestinationPicture } from './TravelItineraryDestinationPicture';
export type TravelItineraryDestination = {
    /**
     * The unique identifier for the destination
     */
    id: string;
    /**
     * The name of the destination
     */
    name: string;
    /**
     * The country of the destination
     */
    country: string;
    /**
     * The continent of the destination
     */
    continent: string;
    /**
     * The picture URL of the destination
     */
    picture?: TravelItineraryDestinationPicture;
};

