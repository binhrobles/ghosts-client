export function handleError(e) {
  console.error(JSON.stringify(e, null, 2));
}

export function coordArrayFromLocation(location) {
  return [location.lng, location.lat];
}
