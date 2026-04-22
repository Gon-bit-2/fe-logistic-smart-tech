import type {
  MapAutocompleteResponse,
  MapPlaceDetailResponse,
} from "@/features/maps/domain/types/maps.types";
import { httpClient } from "@/lib/api/http-client";
import {
  API_MAPS_PLACES_AUTOCOMPLETE,
  API_MAPS_PLACE_DETAIL,
} from "@/utils/apiUrl";

export async function getPlaceAutocomplete(input: string) {
  const response = await httpClient.get<MapAutocompleteResponse>(
    API_MAPS_PLACES_AUTOCOMPLETE,
    {
      params: {
        input,
      },
    },
  );

  return response.data;
}

export async function getPlaceDetail(placeId: string) {
  const response = await httpClient.get<MapPlaceDetailResponse>(
    API_MAPS_PLACE_DETAIL,
    {
      params: {
        placeid: placeId,
      },
    },
  );

  return response.data;
}
