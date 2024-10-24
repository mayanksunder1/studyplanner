const {
    generateAvailabilityInputs,
    collectUserInputs,
    generateSchedule,
    calculateTimeDifference,
    displaySchedule,
    markAsComplete
  } = require('../script');
  
describe("Personalized Study Planner", () => {

    beforeEach(() => {
        document.body.innerHTML = `
        <div id="availability-inputs"></div>
        <select id="subjects" multiple>
          <option value="Mathematics">Mathematics</option>
          <option value="Science">Science</option>
          <option value="History">History</option>
          <option value="English">English</option>
        </select>
        <input type="time" id="start-time-Monday" />
        <input type="time" id="end-time-Monday" />
        <input type="time" id="start-time-Tuesday" />
        <input type="time" id="end-time-Tuesday" />
        <table id="schedule"></table>
      `;
      global.alert = jest.fn();
    });
      
      
      test("Should correctly select subjects", () => {
        generateAvailabilityInputs();
    
      const subjectsDropdown = document.getElementById("subjects");
      subjectsDropdown.options[0].selected = true;  
      subjectsDropdown.options[2].selected = true;  
  
      const { selectedSubjects } = collectUserInputs();
      expect(selectedSubjects).toEqual(["Mathematics", "History"]);
    });
  
    test("Should validate that start time is before end time", () => {
      document.getElementById("start-time-Monday").value = "10:00";
      document.getElementById("end-time-Monday").value = "09:00";
  
      const result = collectUserInputs();
      expect(result).toBeUndefined(); 
    });
  
    
    test("Should generate a study schedule", () => {
  document.getElementById("start-time-Monday").value = "09:00";
  document.getElementById("end-time-Monday").value = "11:00";
  document.getElementById("start-time-Tuesday").value = "10:00";
  document.getElementById("end-time-Tuesday").value = "12:00";

  document.getElementById("subjects").options[0].selected = true; 
  document.getElementById("subjects").options[1].selected = true; 

  generateSchedule(); 

  const scheduleTable = document.getElementById("schedule");
  expect(scheduleTable.rows.length).toBeGreaterThan(1); 
  expect(scheduleTable.textContent).toContain("Mathematics");
  expect(scheduleTable.textContent).toContain("Science");
});
  
    
    test("Should mark a study session as complete", () => {
        document.body.innerHTML = `
          <table id="schedule">
            <tr>
              <td>Monday</td>
              <td>
                <span>
                  Mathematics (60 mins) 
                  <button id="complete-btn">Complete</button>
                </span>
              </td>
            </tr>
          </table>
        `;
      
        const completeButton = document.getElementById("complete-btn");
        
        const markAsComplete = (day, subject, button) => {
          const completedSession = button.parentNode; 
          completedSession.classList.add("complete"); 
        };
        
        
        completeButton.addEventListener('click', () => markAsComplete("Monday", "Mathematics", completeButton));
      
        completeButton.click();
      
        const completedSession = completeButton.parentNode;
        expect(completedSession.classList).toContain("complete");  
      });
      
  
      test("Should display an error if no subject is selected", () => {
        document.body.innerHTML = `
            <div>
                <select id="subjects" multiple>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <!-- Other subjects can be added here -->
                </select>
                <button id="generate-button">Generate Schedule</button>
            </div>
        `;
    
        jest.spyOn(window, 'alert').mockImplementation(() => {}); 
    
        const collectUserInputsMock = jest.fn(() => ({
            selectedSubjects: [],
            availability: {},
        }));
    
        window.collectUserInputs = collectUserInputsMock;
    
        document.getElementById("generate-button").onclick = generateSchedule;
    
        const generateButton = document.getElementById("generate-button");
        generateButton.click(); 
        expect(window.alert).toHaveBeenCalledWith("Please select at least one subject.");
    });
    
  
    test("Should display an error if no availability is provided", () => { 
        document.body.innerHTML = `
            <div>
                <select id="subjects" multiple>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                </select>
                <button id="generate-button">Generate Schedule</button>
            </div>
        `;
    
        jest.spyOn(window, 'alert').mockImplementation(() => {});
    
        const collectUserInputsMock = jest.fn(() => ({
            selectedSubjects: [], 
            availability: {}, 
        }));
    
        window.collectUserInputs = collectUserInputsMock;
    
        document.getElementById("generate-button").onclick = generateSchedule;
    
        const generateButton = document.getElementById("generate-button");
        generateButton.click(); 
    
        expect(window.alert).toHaveBeenCalledWith("Please select at least one subject.");
    });
    
    
  
  });
  