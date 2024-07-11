function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // January is 0!
    const year = now.getFullYear();
    
    const formattedTime = `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
    document.getElementById('datetime').textContent = formattedTime;
}

setInterval(updateTime, 1000);
updateTime(); // Initial call to display time immediately on load


// Function to get the current time in a readable 12-hour format with AM/PM
function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    // const seconds = now.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'
    const strMinutes = minutes < 10 ? '0' + minutes : minutes;
    // const strSeconds = seconds < 10 ? '0' + seconds : seconds;
    return `${hours}:${strMinutes} ${ampm}`;
}

// 
let pageLoadTime = localStorage.getItem('pageLoadTime');

if (!pageLoadTime) {
    
    pageLoadTime = getCurrentTime();
    localStorage.setItem('pageLoadTime', pageLoadTime);
}

// Display the time from localStorage
document.getElementById('current-time').innerText = pageLoadTime;

// Clear the stored time when the page is closed (not on refresh)
window.addEventListener('beforeunload', (event) => {
    if (!event.persisted) { // Check if page is not being loaded from cache
        localStorage.removeItem('pageLoadTime');
    }
});