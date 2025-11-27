export function showAlert(message, type = 'info'){
  const detail = { message, type };
  window.dispatchEvent(new CustomEvent('app-alert', { detail }));
}
if(typeof window !== 'undefined'){
  window.showAlert = showAlert;
}