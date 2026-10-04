// Maps/geocoding adapter. SANDBOX: no external calls, returns null coords.
// Production: licensed Indian-coverage provider. Never store coordinates we
// have not sourced.
export interface GeocodeResult { lat: number | null; lng: number | null; source: string; sandbox: boolean; }
export function geocode(_query: string): GeocodeResult {
  return { lat: null, lng: null, source: "sandbox", sandbox: true };
}
