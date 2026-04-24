import type {
  BackendMapAutocompleteResponse,
  BackendMapPlaceDetailResponse,
  MapAutocompleteResponse,
  MapAutocompletePrediction,
  MapPlaceDetail,
  MapPlaceDetailResponse,
} from "@/features/maps/domain/types/maps.types";
import { httpClient } from "@/lib/api/http-client";
import {
  API_MAPS_PLACES_AUTOCOMPLETE,
  API_MAPS_PLACE_DETAIL,
} from "@/utils/apiUrl";

function normalizeAutocompletePrediction(
  prediction: MapAutocompletePrediction,
): MapAutocompletePrediction {
  return {
    description: prediction.description?.trim() || null,
    place_id: prediction.place_id?.trim() || null,
    structured_formatting: prediction.structured_formatting
      ? {
          main_text: prediction.structured_formatting.main_text?.trim() || null,
          secondary_text:
            prediction.structured_formatting.secondary_text?.trim() || null,
        }
      : null,
  };
}

function normalizeAutocompleteResponse(
  payload: MapAutocompleteResponse | BackendMapAutocompleteResponse,
): MapAutocompleteResponse {
  if ("predictions" in payload) {
    return {
      predictions:
        payload.predictions?.map(normalizeAutocompletePrediction) ?? [],
    };
  }

  const backendPayload = payload as BackendMapAutocompleteResponse;

  if ("data" in backendPayload) {
    return {
      predictions: backendPayload.data?.map((item) => ({
        description: item.description?.trim() || null,
        place_id: item.placeId?.trim() || null,
        structured_formatting: {
          main_text: item.mainText?.trim() || item.description?.trim() || null,
          secondary_text: item.secondaryText?.trim() || null,
        },
      })) ?? [],
    };
  }

  return { predictions: [] };
}

function normalizePlaceDetailResponse(
  payload: MapPlaceDetailResponse | BackendMapPlaceDetailResponse,
): MapPlaceDetailResponse {
  if ("result" in payload) {
    const result = payload.result;

    return {
      result: result
        ? {
            formatted_address: result.formatted_address?.trim() || null,
            geometry: {
              location: {
                lat: result.geometry?.location?.lat ?? null,
                lng: result.geometry?.location?.lng ?? null,
              },
            },
            name: result.name?.trim() || null,
            place_id: result.place_id?.trim() || null,
          }
        : null,
    };
  }

  const backendPayload = payload as BackendMapPlaceDetailResponse;
  const result: MapPlaceDetail = {
    formatted_address: backendPayload.formattedAddress?.trim() || null,
    geometry: {
      location: {
        lat: backendPayload.latitude ?? null,
        lng: backendPayload.longitude ?? null,
      },
    },
    name: backendPayload.name?.trim() || null,
    place_id: backendPayload.placeId?.trim() || null,
  };

  return {
    result,
  };
}

export async function getPlaceAutocomplete(input: string) {
  const response = await httpClient.get<
    MapAutocompleteResponse | BackendMapAutocompleteResponse
  >(
    API_MAPS_PLACES_AUTOCOMPLETE,
    {
      params: {
        input,
      },
    },
  );

  return normalizeAutocompleteResponse(response.data);
}

export async function getPlaceDetail(placeId: string) {
  const response = await httpClient.get<
    MapPlaceDetailResponse | BackendMapPlaceDetailResponse
  >(
    API_MAPS_PLACE_DETAIL,
    {
      params: {
        placeId,
      },
    },
  );

  return normalizePlaceDetailResponse(response.data);
}
