// Demo dates and events deliberately match the supplied October 2026 prototype.
// Replace this data adapter when a backend is available; never infer access logs from UI state.
export const people = {
  alex: { name: 'Alex (You)', initials: 'AL', role: 'Owner · Full access' },
  emma: { name: 'Emma', initials: 'EM', role: 'Family member', camera: 'Living Room', defaultMode: 'faces' },
  james: { name: 'James', initials: 'JA', role: 'Guest', camera: 'Front Door', defaultMode: 'person' }
};
export const dates = Array.from({length:7}, (_,i)=>({day:15+i, weekday:['Thu','Fri','Sat','Sun','Mon','Tue','Wed'][i]}));
// Only visits with a playable clip belong in the sample access history.
export const history = {
  21: {
    emma:[{time:'10:32',type:'recording',camera:'Living Room',recorded:'Today 09:00–09:05',clipId:'emma21'}],
    james:[{time:'07:50',type:'recording',camera:'Front Door',recorded:'Today 07:30–07:35',clipId:'james21'}]
  }
};

// Sample access records include simulated face-verification outcomes.
for (const daily of Object.values(history)) for (const visits of Object.values(daily)) for (const visit of visits) visit.faceVerified = true;
