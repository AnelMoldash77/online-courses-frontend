const API = 'https://online-courses-backend-dla5.onrender.com/api';

function saveToken(token) {
  localStorage.setItem('token', token);
}

function getToken() {
  return localStorage.getItem('token');
}

function logout() {
  localStorage.removeItem('token');
  window.location = 'index.html';
}

async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (!data.token) {
    alert('Login failed');
    return;
  }

  localStorage.setItem('token', data.token);
  window.location.href = 'profile.html';
}


async function register() {
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });

  window.location = 'index.html';
}

async function loadProfile() {
  const res = await fetch(`${API}/users/profile`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  const data = await res.json();

  document.getElementById('profile').innerText =
    `Username: ${data.username}\nEmail: ${data.email}`;

  const list = document.getElementById('enrolled');
  list.innerHTML = '';

  data.enrolledCourses.forEach(course => {
    const li = document.createElement('li');

    li.innerHTML = `
      ${course.title}
      <button onclick="unenrollCourse('${course._id}')">Unenroll</button>
    `;

    list.appendChild(li);
  });
}


async function createCourse() {
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;

  await fetch(`${API}/courses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify({ title, description })
  });

  loadCourses();
}
async function loadCourses() {
  
  const list = document.getElementById('courses');
  list.innerHTML = '';

  courses.forEach(course => {
    const li = document.createElement('li');

    li.innerHTML = `
      <b>${course.title}</b> — ${course.description || ''}
      <br>
      <button onclick="editCourse('${course._id}')">Edit</button>
      <button onclick="deleteCourse('${course._id}')">Delete</button>
      <hr>
    `;

    list.appendChild(li);
  });
}

async function editCourse(id) {
  const newTitle = prompt('New title:');
  const newDescription = prompt('New description:');

  if (!newTitle) return;

  await fetch(`${API}/courses/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify({
      title: newTitle,
      description: newDescription
    })
  });

  loadCourses();
}


async function deleteCourse(id) {
  if (!confirm('Delete this course?')) return;

  await fetch(`${API}/courses/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  loadCourses();
}

async function loadAllCourses() {
  const res = await fetch(`${API}/courses/all`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  const courses = await res.json();
  const list = document.getElementById('courses');
  list.innerHTML = '';

  courses.forEach(course => {
    const li = document.createElement('li');

    li.innerHTML = `
      <b>${course.title}</b> — ${course.description || ''}
      <br>
      <small>By: ${course.createdBy?.username || 'unknown'}</small>
      <br>
      <button onclick="enrollCourse('${course._id}')">Enroll</button>
      <hr>
    `;

    list.appendChild(li);
  });
}

async function enrollCourse(id) {
  await fetch(`${API}/courses/${id}/enroll`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  alert('Enrolled!');
}

async function unenrollCourse(id) {
  await fetch(`${API}/courses/${id}/unenroll`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  loadProfile();
}


if (location.pathname.includes('profile')) loadProfile();
if (location.pathname.includes('courses')) loadCourses();
