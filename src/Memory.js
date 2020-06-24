export const TTL = Object.freeze({
  WEEK: 7,
  MONTH: 30,
  NEVER: -1,
});

export default function Memory() {
  this.text = '';
  this.location = {
    lat: 0.0,
    lng: 0.0,
  };
  this.date = null;
  this.submitter = 'anon';
  this.ttl = TTL.WEEK;
  this.image = '';
}
