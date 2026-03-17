// LocalStorage keys
const USERS_KEY = "DLS_users";
const PROJECTS_KEY = "DLS_projects";
const APPLICATIONS_KEY = "DLS_apps";
const TASKS_KEY = "DLS_tasks";

// Developer username
const DEV_USERNAME = "Avarin";

let currentUser = null;

// Sign Up
function signUp() {
  const username = document.getElementById("signup-username").value;
  const password = document.getElementById("signup-password").value;
  if (!username || !password) return alert("Enter both fields");

  let users = JSON.parse(localStorage.getItem(USERS_KEY)) || {};
  if (users[username]) return alert("Username already exists");

  users[username] = password;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  alert("Signed up! You can now log in");
}

// Login
function login() {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;
  let users = JSON.parse(localStorage.getItem(USERS_KEY)) || {};

  if (users[username] === password) {
    currentUser = username;
    document.getElementById("auth-container").style.display = "none";
    document.getElementById("app-container").style.display = "block";

    // Show dev dashboard only for Avarin
    if (username === DEV_USERNAME) {
      document.getElementById("dev-dashboard-btn").style.display = "inline-block";
      document.getElementById("add-project-div").style.display = "block";
    }

    showPage("portfolio");
    loadPortfolio();
    loadApplications();
    loadTasks();
  } else {
    alert("Invalid login");
  }
}

// Logout
function logout() {
  currentUser = null;
  document.getElementById("app-container").style.display = "none";
  document.getElementById("auth-container").style.display = "block";
}

// Navigation
function showPage(page) {
  const pages = document.querySelectorAll(".page");
  pages.forEach(p => p.style.display = "none");
  document.getElementById(page + "-page").style.display = "block";
}

// Portfolio
function loadPortfolio() {
  let portfolio = JSON.parse(localStorage.getItem(PROJECTS_KEY)) || [];
  const list = document.getElementById("portfolio-list");
  list.innerHTML = "";
  portfolio.forEach((p, index) => {
    const li = document.createElement("li");
    li.textContent = `${p.title} - ${p.desc} [${p.status}]`;
    if (currentUser === DEV_USERNAME) {
      const del = document.createElement("button");
      del.textContent = "Delete";
      del.onclick = () => { removeProject(index); };
      li.appendChild(del);
    }
    list.appendChild(li);
  });
}

function addProject() {
  const title = document.getElementById("new-project-title").value;
  const desc = document.getElementById("new-project-desc").value;
  const status = document.getElementById("new-project-status").value;
  if (!title || !desc) return;

  let portfolio = JSON.parse(localStorage.getItem(PROJECTS_KEY)) || [];
  portfolio.push({title, desc, status});
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(portfolio));
  loadPortfolio();
}

// Delete project
function removeProject(index) {
  let portfolio = JSON.parse(localStorage.getItem(PROJECTS_KEY)) || [];
  portfolio.splice(index,1);
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(portfolio));
  loadPortfolio();
}

// Hiring form
function submitApplication() {
  const app = {
    name: document.getElementById("hire-name").value,
    age: document.getElementById("hire-age").value,
    role: document.getElementById("hire-role").value,
    experience: document.getElementById("hire-exp").value,
    reason: document.getElementById("hire-reason").value
  };
  let apps = JSON.parse(localStorage.getItem(APPLICATIONS_KEY)) || [];
  apps.push(app);
  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(apps));
  alert("Application submitted!");
  loadApplications();
}

function loadApplications() {
  const list = document.getElementById("applications-list");
  list.innerHTML = "";
  if (currentUser !== DEV_USERNAME) return;
  let apps = JSON.parse(localStorage.getItem(APPLICATIONS_KEY)) || [];
  apps.forEach((a, index) => {
    const li = document.createElement("li");
    li.textContent = `${a.name} - ${a.role} - ${a.reason}`;
    const accept = document.createElement("button");
    accept.textContent = "Accept";
    accept.onclick = () => { apps.splice(index,1); localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(apps)); loadApplications(); };
    const reject = document.createElement("button");
    reject.textContent = "Reject";
    reject.onclick = () => { apps.splice(index,1); localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(apps)); loadApplications(); };
    li.appendChild(accept);
    li.appendChild(reject);
    list.appendChild(li);
  });
}

// Tasks
function loadTasks() {
  const list = document.getElementById("tasks-list");
  list.innerHTML = "";
  let tasks = JSON.parse(localStorage.getItem(TASKS_KEY)) || [];
  tasks.forEach((t,index) => {
    const li = document.createElement("li");
    li.textContent = t;
    if (currentUser === DEV_USERNAME) {
      const done = document.createElement("button");
      done.textContent = "Done";
      done.onclick = () => { tasks.splice(index,1); localStorage.setItem(TASKS_KEY, JSON.stringify(tasks)); loadTasks(); };
      li.appendChild(done);
    }
    list.appendChild(li);
  });
}

function addTask() {
  const task = document.getElementById("new-task").value;
  if (!task) return;
  let tasks = JSON.parse(localStorage.getItem(TASKS_KEY)) || [];
  tasks.push(task);
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  document.getElementById("new-task").value = "";
  loadTasks();
}
