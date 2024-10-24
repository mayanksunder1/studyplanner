// Object with subjects and their recommended study times (in minutes)
const subjectsData = {
    "Mathematics": 60,
    "Science": 45,
    "History": 30,
    "English": 45
    // Add more subjects and times as needed
  };
  
  // Function to collect user inputs
  function collectUserInputs() {
    const selectedSubjects = Array.from(document.getElementById("subjects").selectedOptions).map(option => option.value);
    const availability = {};
  
    // Get availability inputs for each day
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    for (const day of daysOfWeek) {
      const startTime = document.getElementById(`start-time-${day}`)?.value;
      const endTime = document.getElementById(`end-time-${day}`)?.value;
      if (startTime && endTime && startTime < endTime) {
        availability[day] = { startTime, endTime };
      } else if (startTime && endTime && startTime >= endTime) {
        alert(`End time for ${day} must be later than start time.`);
        return;
      }
    }
  
    return { selectedSubjects, availability };
  }
  
  // Function to generate a balanced study schedule
  function generateSchedule() {
    const { selectedSubjects, availability } = collectUserInputs();
  
    // Error handling: Check if at least one subject is selected
    if (selectedSubjects.length === 0) {
      alert("Please select at least one subject.");
      return;
    }
  
    // Error handling: Check if availability data is complete
    if (!availability || Object.keys(availability).length === 0) {
      alert("Please provide valid availability times for at least one day.");
      return;
    }
  
    // Basic scheduling logic (can be further enhanced)
    const schedule = {};
    const days = Object.keys(availability);
    let currentDayIndex = 0;
  
    for (const subject of selectedSubjects) {
      let studyTimeRemaining = subjectsData[subject];
  
      while (studyTimeRemaining > 0) {
        const currentDay = days[currentDayIndex];
        const { startTime, endTime } = availability[currentDay];
  
        // Check if there's available time on the current day
        if (startTime && endTime) {
          // Calculate available time on the current day
          const availableTime = calculateTimeDifference(startTime, endTime);
  
          // Allocate study time (up to available time or remaining study time)
          const allocatedTime = Math.min(availableTime, studyTimeRemaining);
  
          // Update schedule
          if (!schedule[currentDay]) {
            schedule[currentDay] = [];
          }
          schedule[currentDay].push({ subject, time: allocatedTime });
  
          // Update remaining study time
          studyTimeRemaining -= allocatedTime;
        }
  
        // Move to the next day (circular)
        currentDayIndex = (currentDayIndex + 1) % days.length;
      }
    }
  
    displaySchedule(schedule);
  }
  
  // Function to calculate time difference in minutes
  function calculateTimeDifference(startTime, endTime) {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    return (end - start) / (1000 * 60); // Difference in minutes
  }
  
  // Function to display the schedule on the web page
  function displaySchedule(schedule) {
    const scheduleTable = document.getElementById("schedule");
    scheduleTable.innerHTML = ""; // Clear previous schedule
  
    // Create table header
    const headerRow = scheduleTable.insertRow();
    const dayHeader = headerRow.insertCell();
    dayHeader.textContent = "Day";
    const subjectHeader = headerRow.insertCell();
    subjectHeader.textContent = "Subject (Time)";
  
    // Populate schedule table
    for (const day in schedule) {
      const dayRow = scheduleTable.insertRow();
      const dayCell = dayRow.insertCell();
      dayCell.textContent = day;
  
      const subjectsCell = dayRow.insertCell();
      subjectsCell.innerHTML = schedule[day].map(item => 
        `<span>${item.subject} (${item.time} mins) <button onclick="markAsComplete('${day}', '${item.subject}', this)">Complete</button></span>`).join("<br>");
    }
  }
  
  // Function to handle marking a study session as complete
  function markAsComplete(day, subject, button) {
    const completedSession = button.parentNode;
    completedSession?.classList.add("complete");
    console.log(`Study session for ${subject} on ${day} marked as complete.`);
  }
  
  // Generate availability input fields dynamically
  function generateAvailabilityInputs() {
    const availabilityInputsContainer = document.getElementById("availability-inputs");
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
    for (const day of daysOfWeek) {
      const dayLabel = document.createElement("label");
      dayLabel.htmlFor = `start-time-${day}`;
      dayLabel.textContent = `${day}: `;
      availabilityInputsContainer?.appendChild(dayLabel);
  
      const startTimeInput = document.createElement("input");
      startTimeInput.type = "time";
      startTimeInput.id = `start-time-${day}`;
      startTimeInput.name = `start-time-${day}`;
      availabilityInputsContainer?.appendChild(startTimeInput);
  
      const endTimeInput = document.createElement("input");
      endTimeInput.type = "time";
      endTimeInput.id = `end-time-${day}`;
      endTimeInput.name = `end-time-${day}`;
      availabilityInputsContainer?.appendChild(endTimeInput);
  
      const lineBreak = document.createElement("br");
      availabilityInputsContainer?.appendChild(lineBreak);
    }
  }
  
  // Call the function to generate availability inputs on page load
  generateAvailabilityInputs();

  // Existing functions...

// Export functions for testing
module.exports = {
    generateAvailabilityInputs,
    collectUserInputs,
    generateSchedule,
    calculateTimeDifference,
    displaySchedule,
    markAsComplete
  };
  
  