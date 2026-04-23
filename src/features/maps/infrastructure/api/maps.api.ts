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

  return {
    predictions:
      payload.data?.map((item) => ({
        description: item.description?.trim() || null,
        place_id: item.placeId?.trim() || null,
        structured_formatting: {
          main_text: item.mainText?.trim() || item.description?.trim() || null,
          secondary_text: item.secondaryText?.trim() || null,
        },
      })) ?? [],
  };
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

  const result: MapPlaceDetail = {
    formatted_address: payload.formattedAddress?.trim() || null,
    geometry: {
      location: {
        lat: payload.latitude ?? null,
        lng: payload.longitude ?? null,
      },
    },
    name: payload.name?.trim() || null,
    place_id: payload.placeId?.trim() || null,
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
