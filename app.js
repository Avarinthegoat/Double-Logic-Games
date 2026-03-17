const USERS_KEY = "DLS_users";
const PROJECTS_KEY = "DLS_projects";
const APPLICATIONS_KEY = "DLS_apps";
const TASKS_KEY = "DLS_tasks";

const DEV_USERNAME = "Avarin";
let currentUser = null;

// Sign Up (auto-login after signup)
function signUp() {
  const username = document.getElementById("signup-username").value;
  const password = document.getElementById("signup-password").value;
  if (!username || !password) return alert("Enter both fields");

  let users = JSON.parse(localStorage.getItem(USERS_KEY)) || {};
  if (users[username]) return alert("Username already exists");

  users[username] = password;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  currentUser = username;
  showApp();
}

// Login
function login() {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;
  let users = JSON.parse(localStorage.getItem(USERS_KEY)) || {};

  if (users[username] === password) {
    currentUser = username;
    showApp();
  } else {
    alert("Invalid login");
  }
}

// Show App
function showApp() {
  document.getElementById("auth-container").style.display = "none";
  document.getElementById("app-container").style.display = "block";

  if (currentUser === DEV_USERNAME) {
    document.getElementById("dev-dashboard-btn").style.display = "inline-block";
    document.getElementById("add-project-div").style.display = "block";
  }

  showPage("portfolio");
  loadPortfolio();
  loadApplications();
  loadTasks();
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
  const container = document.getElementById("portfolio-list");
  container.innerHTML = "";
  portfolio.forEach((p,index)=>{
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<h3>${p.title}</h3><p>${p.desc}</p><p>Status: ${p.status}</p>`;
    if(currentUser===DEV_USERNAME){
      const del = document.createElement("button");
      del.textContent = "Delete";
      del.className = "btn";
      del.onclick = ()=>{ portfolio.splice(index,1); localStorage.setItem(PROJECTS_KEY,JSON.stringify(portfolio)); loadPortfolio();}
      card.appendChild(del);
    }
    container.appendChild(card);
  });
}

function addProject() {
  const title = document.getElementById("new-project-title").value;
  const desc = document.getElementById("new-project-desc").value;
  const status = document.getElementById("new-project-status").value;
  if (!title || !desc) return;
  let portfolio = JSON.parse(localStorage.getItem(PROJECTS_KEY)) || [];
  portfolio.push({title,desc,status});
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(portfolio));
  document.getElementById("new-project-title").value="";
  document.getElementById("new-project-desc").value="";
  loadPortfolio();
}

// Hiring Form
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
  if(currentUser!==DEV_USERNAME) return;
  let apps = JSON.parse(localStorage.getItem(APPLICATIONS_KEY)) || [];
  apps.forEach((a,index)=>{
    const li = document.createElement("li");
    li.textContent = `${a.name} - ${a.role} - ${a.reason}`;
    const accept = document.createElement("button");
    accept.textContent = "Accept";
    accept.className="btn";
    accept.onclick = ()=>{ apps.splice(index,1); localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(apps)); loadApplications();}
    const reject = document.createElement("button");
    reject.textContent = "Reject";
    reject.className="btn";
    reject.onclick = ()=>{ apps.splice(index,1); localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(apps)); loadApplications();}
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
  tasks.forEach((t,index)=>{
    const li = document.createElement("li");
    li.textContent = t;
    if(currentUser===DEV_USERNAME){
      const done = document.createElement("button");
      done.textContent="Done";
      done.className="btn";
      done.onclick = ()=>{ tasks.splice(index,1); localStorage.setItem(TASKS_KEY,JSON.stringify(tasks)); loadTasks();}
      li.appendChild(done);
    }
    list.appendChild(li);
  });
}

function addTask() {
  const task = document.getElementById("new-task").value;
  if(!task) return;
  let tasks = JSON.parse(localStorage.getItem(TASKS_KEY)) || [];
  tasks.push(task);
  localStorage.setItem(TASKS_KEY,JSON.stringify(tasks));
  document.getElementById("new-task").value="";
  loadTasks();
}
