// Load saved settings
chrome.storage.sync.get(['parentEmail', 'childName', 'ageGroup'], (data) => {
  if (data.parentEmail) document.getElementById('parentEmail').value = data.parentEmail;
  if (data.childName) document.getElementById('childName').value = data.childName;
  if (data.ageGroup) document.getElementById('ageGroup').value = data.ageGroup;
});

document.getElementById('save').onclick = () => {
  chrome.storage.sync.set({
    parentEmail: document.getElementById('parentEmail').value,
    childName: document.getElementById('childName').value,
    ageGroup: document.getElementById('ageGroup').value
  });
  document.getElementById('savedMsg').style.display = 'block';
  setTimeout(() => document.getElementById('savedMsg').style.display = 'none', 2000);
};