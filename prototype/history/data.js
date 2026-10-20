// Demo dates and events deliberately match the supplied October 2026 prototype.
// Replace this data adapter when a backend is available; never infer access logs from UI state.
export const people = {
  alex: { name: 'Alex (You)', initials: 'AL', role: 'Owner · Full access' },
  emma: { name: 'Emma', initials: 'EM', role: 'Family member', camera: 'Living Room', defaultMode: 'faces' },
  james: { name: 'James', initials: 'JA', role: 'Guest', camera: 'Front Door', defaultMode: 'person' }
};
export const dates = Array.from({length:7}, (_,i)=>({day:13+i, weekday:['Tue','Wed','Thu','Fri','Sat','Sun','Mon'][i]}));
export const history = {
  19: { alex:[{time:'11:00',type:'live',camera:'Living Room'}], emma:[{time:'10:32',type:'recording',camera:'Living Room',recorded:'Today 09:00–09:05'},{time:'08:40',type:'live',camera:'Living Room'}], james:[{time:'08:15',type:'live',camera:'Front Door'},{time:'07:50',type:'recording',camera:'Front Door',recorded:'Today 07:30–07:35'}] },
  18: { alex:[{time:'18:20',type:'live',camera:'Living Room'}], emma:[{time:'14:10',type:'recording',camera:'Living Room',recorded:'Sun, Oct 18 12:00–12:05'}] },
  17: { james:[{time:'16:45',type:'live',camera:'Front Door'}] },
  16: {},
  15: { emma:[{time:'09:20',type:'live',camera:'Living Room'}] },
  14: { alex:[{time:'12:05',type:'live',camera:'Front Door'}] },
  13: { emma:[{time:'11:30',type:'recording',camera:'Living Room',recorded:'Tue, Oct 13 10:00–10:05'}] }
};
