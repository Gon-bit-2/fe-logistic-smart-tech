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
