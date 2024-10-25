/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

// Load the HTML file into the DOM
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
document.body.innerHTML = html;

// Load and execute script.js directly in this test environment
const script = fs.readFileSync(path.resolve(__dirname, '../script.js'), 'utf8');
eval(script);

describe('Personalized Study Planner', () => {
  beforeEach(() => {
    // Reload HTML before each test to ensure a fresh state
    document.body.innerHTML = html;

    // Generate availability inputs dynamically
    generateAvailabilityInputs();
  });

  test('should generate availability inputs for all days of the week', () => {
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    
    daysOfWeek.forEach(day => {
      const startTimeInput = document.getElementById(`start-time-${day}`);
      const endTimeInput = document.getElementById(`end-time-${day}`);

      expect(startTimeInput).toBeTruthy();
      expect(endTimeInput).toBeTruthy();
    });
  });

  test('should collect user inputs correctly', () => {
    const subjectsSelect = document.getElementById('subjects');
    const selectedOptions = subjectsSelect.options;
    selectedOptions[0].selected = true; // Select "Mathematics"
    selectedOptions[1].selected = true; // Select "Science"

    const mondayStartTime = document.getElementById('start-time-Monday');
    const mondayEndTime = document.getElementById('end-time-Monday');
    mondayStartTime.value = '09:00';
    mondayEndTime.value = '11:00';

    const userInputs = collectUserInputs();

    expect(userInputs.selectedSubjects).toEqual(['Mathematics', 'Science']);
    expect(userInputs.availability.Monday).toEqual({ startTime: '09:00', endTime: '11:00' });
  });

  test('should throw an error if no subject is selected', () => {
    window.alert = jest.fn();

    generateSchedule();

    expect(window.alert).toHaveBeenCalledWith("Please select at least one subject.");
  });

  test('should throw an error if availability is not provided', () => {
    const subjectsSelect = document.getElementById('subjects');
    subjectsSelect.options[0].selected = true;

    window.alert = jest.fn();

    generateSchedule();

    expect(window.alert).toHaveBeenCalledWith("Please provide valid availability times for at least one day.");
  });

  test('should generate a valid schedule when input is provided', () => {
    const subjectsSelect = document.getElementById('subjects');
    subjectsSelect.options[0].selected = true;

    const mondayStartTime = document.getElementById('start-time-Monday');
    const mondayEndTime = document.getElementById('end-time-Monday');
    mondayStartTime.value = '09:00';
    mondayEndTime.value = '11:00';

    generateSchedule();

    const scheduleTable = document.getElementById('schedule');
    expect(scheduleTable.innerHTML).toContain('Mathematics');
  });

  test('should mark study session as complete', () => {
    // Mock console.log
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  
    // Setup the schedule table with a sample study session
    const scheduleTable = document.getElementById('schedule');
    scheduleTable.innerHTML = `
      <tr>
        <td>Monday</td>
        <td><span>Mathematics (60 mins) <button onclick="markAsComplete('Monday', 'Mathematics', this)">Complete</button></span></td>
      </tr>
    `;
  
    // Simulate marking the session as complete
    const button = scheduleTable.querySelector('button');
    markAsComplete('Monday', 'Mathematics', button);
  
    // Verify that the session is marked as complete
    const completedSession = button.parentNode;
    expect(completedSession.classList).toContain('complete');
  
    // Check that console.log was called with the expected message
    expect(consoleSpy).toHaveBeenCalledWith('Study session for Mathematics on Monday marked as complete.');
  
    // Clean up the mock
    consoleSpy.mockRestore();
  });
  
});
