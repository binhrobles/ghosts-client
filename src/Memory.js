export default function Memory() {
  this.text = '';
  this.location = {
    lat: 0.0,
    lng: 0.0,
  };
  this.date = Date.now();
  this.submitter = '';
}
