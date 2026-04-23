export type MapAutocompletePrediction = {
  description?: string | null;
  place_id?: string | null;
  structured_formatting?: {
    main_text?: string | null;
    secondary_text?: string | null;
  } | null;
};

export type MapAutocompleteResponse = {
  predictions?: MapAutocompletePrediction[] | null;
};

export type MapPlaceDetail = {
  formatted_address?: string | null;
  geometry?: {
    location?: {
      lat?: number | null;
      lng?: number | null;
    } | null;
  } | null;
  name?: string | null;
  place_id?: string | null;
};

export type MapPlaceDetailResponse = {
  result?: MapPlaceDetail | null;
};

export type BackendMapAutocompleteItem = {
  description?: string | null;
  mainText?: string | null;
  placeId?: string | null;
  secondaryText?: string | null;
};

export type BackendMapAutocompleteResponse = {
  data?: BackendMapAutocompleteItem[] | null;
};

export type BackendMapPlaceDetailResponse = {
  formattedAddress?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  name?: string | null;
  placeId?: string | null;
};
