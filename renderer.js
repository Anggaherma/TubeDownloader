// Utility to display logs in the output
function appendLog(message) {
  const output = document.getElementById("output");
  const logEntry = document.createElement("div");
  logEntry.textContent = message;
  output.appendChild(logEntry);
  output.scrollTop = output.scrollHeight;
  console.log(message);
}

// Function to handle video download
function downloadVideo() {
  console.log("=========== downloadVideo function called ===========")
  const url = document.getElementById("url").value.trim();
  if (url) {
    appendLog(`Download video from URL: ${url}`);
    window.api.downloadVideo(url);
  } else {
    appendLog("Please enter a valid video URL.");
  }
}

// Make the function accessible globally
window.downloadVideo = downloadVideo;

// Event listener for the Download Video button
document.getElementById("download-video").addEventListener("click", () => {
  downloadVideo(); // Call the function to handle video download
});

// Event listener for the Convert to MP3 button
document.getElementById("convert-to-mp3").addEventListener("click", () => {
  window.api.convertToMP3();
});

// Event listener for the "Select Download Directory" button
document.getElementById("select-dir").addEventListener("click", async () => {
  const dir = await window.api.selectDownloadDir();
  if (dir) {
    appendLog(`Dowload directory set to ${dir}`);
  } else {
    appendLog("Directory selection canceled");
  }
});

// Handle success and error messages
window.api.onDownloadSuccess((event, message) => {
  appendLog(`Download Success: ${message}`);
});

window.api.onDownloadError((event, message) => {
  appendLog(`Download Error: ${message}`);
});

window.api.onConvertSuccess((event, message) => {
  appendLog(`Convert Success: ${message}`);
});

window.api.onConvertError((event, message) => {
  appendLog(`Convert Error: ${message}`);
});
