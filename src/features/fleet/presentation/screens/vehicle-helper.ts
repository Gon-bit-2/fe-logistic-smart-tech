export function getVehicleCardDetails(type: string, fuelType: string, index: number) {
  const images = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCdzXPLPylxLtRLepqemZdJHRYJasy2kHf9ycyn1WNWEAlfWCKZ073JGzg23tNzQQfY0QKsbEztHj4V2Iy6OZlJ2sS2N5ez5p3-Go5PgPRxa2jNR9LsmLX0EPOUTu8Wa3ta6Qn8o8jKlUyU22OAia_OV06LFfCy877fEwrvrH_HD9-AreUhEFb0CmtuRNRYaL8cnJFmgYAiABIFQ4mMf4vSwr9vvnV9tw012Zc1IGlImoKLr7O4_9fnEOzR8VoF0WOASN26gQF3KQkV",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCBg7MLGSVZY78i09mawYPOiQJOjOpl1OuZeD-oSXNWIH8wTeiBqvOXQexYkRvtNK0OV8c5WzjULrmQUDUhHSMW9ciEYPn5RnqbijP6llLh8Ba22aiItwf-m4fCH6KJY7SJ53FNNwJPdM_629nf7nAjnyC_lUqqOq3-9Z7Et5eJFkuyicAMU_g8saihxpadNjKcpLb6okNXEs9qFYzSgE5rUpNbQ7gyRXoLoWO3X7eIPyppkOywB5G8CWkNA3Ly9c9HhssYOnxvN7Hp",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBAEAj43JhQWyZRhvZVUI3Id2RdrUnLbxdjGDxcReqr1SmYiosfa2CRqrr3iR4p5S5j5dF2RQa07vNjN5RVPOBKhKOyHWdVCQ5g0YbxSgJzELY7hYndEdok11ewvSjRGjZFbmzRFDMOQev3XsA3oqbajZMUWQMKXXmINTs65mAN0hn2LjI-5xS28WqfHlNqIjPxCSVDA3Gp9_rW89heTdNQVY9XfYf_nB_laT8Fszs2ZmcG4fvrWP6OzOQgD-DinL2PAEW_gLXnDV98",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDavL27KU7Dw5f9N3PvtaSbs_67gqMa8Vjz5q_i9OZFBbgBGtRjPtefhHFVOI0JnbWaFdJP6g_aNJJ_w61USnAm0JIUK55peUbsGUflcKV8eS1LTHyGc2SFTnGLNUrYbEHEHWFuVx6RWT6_ULKxTnlxEu16o2vf6uSCWapGUh-YF8fqGku3Etcz-OLqkOzPY_RWrhNB6jfrg3nOckcMg8LW3kB5Lncvjc_j_W_9pPyiea-uWKjoqfuzrAcpHZBrG_vY1wq1CcqR47hA"
  ];
  const src = images[index % images.length];

  if (fuelType === "ELECTRIC" || type === "ELECTRIC_VAN") {
    return {
      src,
      tagLabel: "Electric",
      tagClass: "bg-emerald-600 text-white hover:bg-emerald-700",
      statusClass: "bg-white/90 text-emerald-700 hover:bg-white",
      progressStroke: "#10B981"
    };
  } else if (fuelType === "HYBRID") {
    return {
      src,
      tagLabel: "Hybrid",
      tagClass: "bg-teal-600 text-white hover:bg-teal-700",
      statusClass: "bg-amber-100 text-amber-700 hover:bg-amber-200",
      progressStroke: "#F59E0B"
    };
  } else {
    return {
      src,
      tagLabel: "Diesel / Gas",
      tagClass: "bg-slate-600 text-white hover:bg-slate-700",
      statusClass: "bg-slate-200 text-slate-700 hover:bg-slate-300",
      progressStroke: "#64748B"
    };
  }
}
