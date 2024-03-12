export function handleError(e) {
  console.error(JSON.stringify(e, null, 2));
}

export function coordArrayFromLocation({ lng, lat }) {
  return [lng, lat];
}
