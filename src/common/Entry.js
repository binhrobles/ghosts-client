export const TTL = Object.freeze({
  WEEK: 7,
  MONTH: 30,
  NEVER: -1,
});

export default function Entry() {
  this.text = '';
  this.description = '';
  this.location = {
    lat: 0.0,
    lng: 0.0,
  };
  this.ttl = TTL.NEVER;
  this.date = ''; // optional
  this.submitter = 'anon'; // optional
  this.tags = []; // optional
}
