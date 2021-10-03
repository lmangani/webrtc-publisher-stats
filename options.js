// Saves options to chrome.storage
function save_options() {
  console.log('saving options');
  var tracking = document.getElementById('tracking').checked;
  var server = document.getElementById('server').value;
  var logs = document.getElementById('logs').checked;
  chrome.storage.local.set({
    tracking: tracking,
    server: server,
	logs: logs
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
	  window.close();
    }, 750);
  });
}

// Restores options from chrome.storage
function restore_options() {
  chrome.storage.local.get({
    tracking: false,
    logs: true,
	server: "wss://websniffer.glitch.me"
  }, function(items) {
    document.getElementById('server').value = items.server;
    document.getElementById('tracking').checked = items.tracking;
	document.getElementById('logs').checked = items.logs;
	
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);