// ==========================================
// Daily Routine Task Manager - Main JS File
// ==========================================

// ==========================================
// 1. TASK MANAGEMENT
// ==========================================

class TaskManager {
  constructor() {
    this.tasks = this.loadTasks();
  }

  // Load tasks from localStorage
  loadTasks() {
    const stored = localStorage.getItem('tasks');
    return stored ? JSON.parse(stored) : [];
  }

  // Save tasks to localStorage
  saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  // Add new task
  addTask(taskData) {
    const task = {
      id: Date.now(),
      title: taskData.title,
      description: taskData.description || '',
      category: taskData.category || '',
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || '',
      dueTime: taskData.dueTime || '',
      reminder: taskData.reminder || 'none',
      repeat: taskData.repeat || 'none',
      completed: false,
      subtasks: taskData.subtasks || [],
      createdAt: new Date().toISOString()
    };
    this.tasks.push(task);
    this.saveTasks();
    return task;
  }

  // Delete task
  deleteTask(taskId) {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
    this.saveTasks();
  }

  // Update task
  updateTask(taskId, updates) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      Object.assign(task, updates);
      this.saveTasks();
    }
    return task;
  }

  // Toggle task completion
  toggleTask(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      this.saveTasks();
    }
    return task;
  }

  // Get all tasks
  getAllTasks() {
    return this.tasks;
  }

  // Get completed tasks
  getCompletedTasks() {
    return this.tasks.filter(task => task.completed);
  }

  // Get pending tasks
  getPendingTasks() {
    return this.tasks.filter(task => !task.completed);
  }

  // Get tasks by category
  getTasksByCategory(category) {
    return this.tasks.filter(task => task.category === category);
  }

  // Get tasks by priority
  getTasksByPriority(priority) {
    return this.tasks.filter(task => task.priority === priority);
  }

  // Get today's tasks
  getTodayTasks() {
    const today = new Date().toISOString().split('T')[0];
    return this.tasks.filter(task => task.dueDate === today);
  }

  // Get upcoming tasks
  getUpcomingTasks() {
    const today = new Date().toISOString().split('T')[0];
    return this.tasks.filter(task => task.dueDate > today);
  }

  // Get completion percentage
  getCompletionPercentage() {
    if (this.tasks.length === 0) return 0;
    return Math.round((this.getCompletedTasks().length / this.tasks.length) * 100);
  }

  // Get remaining tasks count
  getRemainingTasksCount() {
    return this.getPendingTasks().length;
  }
}

// Initialize Task Manager
const taskManager = new TaskManager();

// ==========================================
// 2. SETTINGS MANAGEMENT
// ==========================================

class SettingsManager {
  constructor() {
    this.settings = this.loadSettings();
  }

  // Load settings from localStorage
  loadSettings() {
    const stored = localStorage.getItem('settings');
    return stored ? JSON.parse(stored) : this.getDefaultSettings();
  }

  // Get default settings
  getDefaultSettings() {
    return {
      theme: 'light',
      fontSize: 'medium',
      pushNotifications: true,
      emailReminders: false,
      soundEffects: true,
      showCompletedTasks: true,
      sortBy: 'dueDate',
      recurringTasks: true,
      twoFactor: false,
      darkMode: false
    };
  }

  // Save settings
  saveSettings() {
    localStorage.setItem('settings', JSON.stringify(this.settings));
  }

  // Update setting
  updateSetting(key, value) {
    this.settings[key] = value;
    this.saveSettings();
    this.applySetting(key, value);
  }

  // Apply settings to page
  applySetting(key, value) {
    switch(key) {
      case 'theme':
        this.applyTheme(value);
        break;
      case 'fontSize':
        this.applyFontSize(value);
        break;
      case 'darkMode':
        this.applyDarkMode(value);
        break;
    }
  }

  // Apply theme
  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  // Apply font size
  applyFontSize(size) {
    const root = document.documentElement;
    const sizes = {
      'small': '14px',
      'medium': '16px',
      'large': '18px'
    };
    root.style.fontSize = sizes[size] || '16px';
  }

  // Apply dark mode
  applyDarkMode(enabled) {
    if (enabled) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  // Get setting
  getSetting(key) {
    return this.settings[key];
  }

  // Get all settings
  getAllSettings() {
    return this.settings;
  }
}

// Initialize Settings Manager
const settingsManager = new SettingsManager();

// ==========================================
// 3. USER PROFILE MANAGEMENT
// ==========================================

class UserManager {
  constructor() {
    this.user = this.loadUser();
  }

  // Load user from localStorage
  loadUser() {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : this.getDefaultUser();
  }

  // Get default user
  getDefaultUser() {
    return {
      name: 'Rajesh Ranjan',
      email: 'rajesh.ranjan@email.com',
      avatar: '👤',
      joinDate: new Date().toISOString(),
      totalTasks: 45,
      completedTasks: 32,
      streak: 15,
      successRate: 92
    };
  }

  // Save user
  saveUser() {
    localStorage.setItem('user', JSON.stringify(this.user));
  }

  // Update user
  updateUser(updates) {
    Object.assign(this.user, updates);
    this.saveUser();
  }

  // Get user
  getUser() {
    return this.user;
  }

  // Update stats
  updateStats() {
    this.user.totalTasks = taskManager.getAllTasks().length;
    this.user.completedTasks = taskManager.getCompletedTasks().length;
    this.saveUser();
  }
}

// Initialize User Manager
const userManager = new UserManager();

// ==========================================
// 4. NOTIFICATION MANAGEMENT
// ==========================================

class NotificationManager {
  constructor() {
    this.notifications = [];
  }

  // Show notification
  show(message, type = 'info', duration = 3000) {
    const notification = {
      id: Date.now(),
      message,
      type,
      duration
    };

    // Create notification element
    const element = document.createElement('div');
    element.className = `notification notification-${type}`;
    element.textContent = message;
    element.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      background-color: ${this.getTypeColor(type)};
      color: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(element);

    // Remove after duration
    setTimeout(() => {
      element.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => element.remove(), 300);
    }, duration);

    return notification;
  }

  // Get color based on type
  getTypeColor(type) {
    const colors = {
      'success': '#9cc3a5',
      'error': '#d98c7c',
      'warning': '#f4c97a',
      'info': '#8cb4c9'
    };
    return colors[type] || colors['info'];
  }

  // Success notification
  success(message, duration) {
    return this.show(message, 'success', duration);
  }

  // Error notification
  error(message, duration) {
    return this.show(message, 'error', duration);
  }

  // Warning notification
  warning(message, duration) {
    return this.show(message, 'warning', duration);
  }

  // Info notification
  info(message, duration) {
    return this.show(message, 'info', duration);
  }
}

// Initialize Notification Manager
const notificationManager = new NotificationManager();

// ==========================================
// 5. DOM MANIPULATION HELPERS
// ==========================================

// Current filter state
let currentFilter = 'all';

// Update notification badge count
function updateNotificationBadge() {
  const remainingCount = taskManager.getRemainingTasksCount();
  const badge = document.querySelector('.notification_badge');
  
  if (badge) {
    badge.textContent = remainingCount;
    
    // Hide badge if no remaining tasks
    if (remainingCount === 0) {
      badge.style.display = 'none';
    } else {
      badge.style.display = 'flex';
    }
  }
}

// Update dashboard stats
function updateDashboardStats() {
  const completedCount = taskManager.getCompletedTasks().length;
  const remainingCount = taskManager.getRemainingTasksCount();
  const percentage = taskManager.getCompletionPercentage();

  // Update remaining tasks
  const remainingElement = document.querySelector('.remain_tasks h4');
  if (remainingElement) {
    remainingElement.textContent = `${remainingCount} Tasks Remaining`;
  }

  // Update progress bar
  const progressBar = document.querySelector('.task_progress');
  if (progressBar) {
    progressBar.value = percentage;
  }

  // Update percentage
  const percentageElement = document.querySelector('.remain_tasks h6');
  if (percentageElement) {
    percentageElement.textContent = `${percentage}% Completed`;
  }

  // Update circle score
  const scoreElement = document.querySelector('.circle_score h2');
  if (scoreElement) {
    scoreElement.textContent = `${percentage}%`;
  }

  // Update notification badge
  updateNotificationBadge();
}

// Render task list with filter
function renderTaskList(filter = 'all') {
  currentFilter = filter;
  const taskList = document.querySelector('.task_list');
  if (!taskList) return;

  taskList.innerHTML = '';
  let tasks = [];

  // Filter tasks based on selection
  switch(filter) {
    case 'today':
      tasks = taskManager.getTodayTasks();
      break;
    case 'upcoming':
      tasks = taskManager.getUpcomingTasks();
      break;
    case 'all':
    default:
      tasks = taskManager.getAllTasks();
  }

  if (tasks.length === 0) {
    const message = filter === 'all' ? 'No tasks yet. Create one to get started!' :
                    filter === 'today' ? 'No tasks for today!' :
                    'No upcoming tasks!';
    taskList.innerHTML = `<p style="text-align: center; color: #9e9e9e; padding: 20px;">${message}</p>`;
    return;
  }

  tasks.forEach(task => {
    const taskItem = document.createElement('div');
    taskItem.className = `task_item ${task.completed ? 'completed' : ''}`;
    
    const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
    const dueDateText = dueDate ? ` · ${dueDate}` : '';
    
    taskItem.innerHTML = `
      <input type="checkbox" ${task.completed ? 'checked' : ''} class="task-checkbox" data-task-id="${task.id}" />
      <div style="flex: 1;">
        <label style="margin: 0;">${task.title}</label>
        ${task.dueTime ? `<p style="font-size: 12px; color: #9e9e9e; margin: 3px 0 0 0;">⏰ ${task.dueTime}${dueDateText}</p>` : `${dueDate ? `<p style="font-size: 12px; color: #9e9e9e; margin: 3px 0 0 0;">${dueDate}</p>` : ''}`}
      </div>
      ${task.priority === 'high' ? '<span style="color: #d98c7c; font-weight: bold; font-size: 12px;">●</span>' : ''}
    `;

    // Add checkbox event listener
    taskItem.querySelector('.task-checkbox').addEventListener('change', function() {
      taskManager.toggleTask(task.id);
      renderTaskList(currentFilter);
      updateDashboardStats();
      notificationManager.success('Task updated!');
    });

    taskList.appendChild(taskItem);
  });

  updateDashboardStats();
}

// Setup navigation filters
function setupNavigationFilters() {
  const navLinks = document.querySelectorAll('.nav_link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Remove active class from all links
      navLinks.forEach(l => l.removeAttribute('id'));
      
      // Add active class to clicked link
      this.id = 'active';
      
      // Determine filter based on link text
      const linkText = this.textContent.trim().toLowerCase();
      let filter = 'all';
      
      if (linkText === 'today') {
        filter = 'today';
      } else if (linkText === 'upcoming') {
        filter = 'upcoming';
      }
      
      // Render tasks with selected filter
      renderTaskList(filter);
    });
  });
}

// Update user profile display
function updateProfileDisplay() {
  const user = userManager.getUser();
  const stats = {
    totalTasks: taskManager.getAllTasks().length,
    completedTasks: taskManager.getCompletedTasks().length,
    streak: user.streak,
    successRate: taskManager.getCompletionPercentage()
  };

  // Update profile info
  const profileName = document.querySelector('.profile_info h2');
  if (profileName) profileName.textContent = user.name;

  const profileEmail = document.querySelector('.profile_email');
  if (profileEmail) profileEmail.textContent = user.email;

  // Update stats
  const statCards = document.querySelectorAll('.stat_card');
  if (statCards.length >= 4) {
    statCards[0].querySelector('h4').textContent = stats.totalTasks;
    statCards[1].querySelector('h4').textContent = stats.completedTasks;
    statCards[2].querySelector('h4').textContent = stats.streak;
    statCards[3].querySelector('h4').textContent = `${stats.successRate}%`;
  }
}

// ==========================================
// 6. FORM HANDLING
// ==========================================

// Handle new task form submission
function handleNewTaskForm() {
  const form = document.querySelector('.task_form');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(form);
    const subtasks = Array.from(document.querySelectorAll('.subtask_input_group .form_input'))
      .map(input => input.value)
      .filter(value => value.trim() !== '');

    const taskData = {
      title: document.getElementById('task_title').value,
      description: document.getElementById('task_description').value,
      category: document.getElementById('task_category').value,
      priority: document.querySelector('.priority_btn.active')?.dataset.priority || 'medium',
      dueDate: document.getElementById('task_date').value,
      dueTime: document.getElementById('task_time').value,
      reminder: document.querySelector('input[name="reminder"]:checked')?.value || 'none',
      repeat: document.getElementById('task_repeat').value,
      subtasks: subtasks
    };

    // Add task
    taskManager.addTask(taskData);
    notificationManager.success('Task created successfully!');

    // Reset form and redirect
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  });
}

// ==========================================
// 7. EVENT LISTENERS
// ==========================================

// Initialize event listeners
function initEventListeners() {
  // Add task button
  const addTaskBtn = document.querySelector('.add_task_btn button');
  if (addTaskBtn) {
    addTaskBtn.addEventListener('click', function() {
      window.location.href = 'newtask.html';
    });
  }

  // Setup navigation filters
  setupNavigationFilters();

  // Task checkboxes
  document.querySelectorAll('.task-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      taskManager.toggleTask(parseInt(this.dataset.taskId));
      renderTaskList(currentFilter);
      updateDashboardStats();
      notificationManager.success('Task updated!');
    });
  });
}

// ==========================================
// 8. INITIALIZATION
// ==========================================

// Check if user is logged in
function checkAuthentication() {
  const isLoggedIn = sessionStorage.getItem('isLoggedIn');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  // Allow login page without authentication
  if (currentPage === 'login.html' || currentPage === '') {
    return;
  }

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    window.location.href = 'login.html';
    return false;
  }

  return true;
}

// Logout function
function logout() {
  if (confirm('Are you sure you want to logout?')) {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userEmail');
    notificationManager.success('Logged out successfully!');
    
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 500);
  }
}

// Initialize dashboard on first load
function initializeDashboard() {
  updateDashboardStats();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  // Check authentication first
  if (!checkAuthentication()) {
    return;
  }

  // Apply saved settings
  settingsManager.applyTheme(settingsManager.getSetting('theme'));
  settingsManager.applyFontSize(settingsManager.getSetting('fontSize'));
  
  if (settingsManager.getSetting('darkMode')) {
    settingsManager.applyDarkMode(true);
  }

  // Render task list if on home page
  if (document.querySelector('.task_list')) {
    initializeDashboard();
    renderTaskList();
    updateGreetingAndDate();
  }

  // Update profile if on profile page
  if (document.querySelector('.profile_info')) {
    updateProfileDisplay();
  }

  // Handle new task form
  handleNewTaskForm();

  // Initialize event listeners
  initEventListeners();

  // Setup theme switcher if on settings page
  if (document.querySelector('.theme_option')) {
    setupThemeSwitcher();
  }

  console.log('✅ Daily Routine App Initialized');
  console.log('📊 Total Tasks:', taskManager.getAllTasks().length);
  console.log('✓ Completed Tasks:', taskManager.getCompletedTasks().length);
});

// ==========================================
// 9. UTILITY FUNCTIONS
// ==========================================

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Format time
function formatTime(timeString) {
  const [hours, minutes] = timeString.split(':');
  const date = new Date();
  date.setHours(hours, minutes);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Get current date
function getCurrentDate() {
  const today = new Date();
  return today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Get greeting based on time of day
function getGreeting() {
  const hour = new Date().getHours();
  let greeting = '';
  let emoji = '';

  if (hour >= 5 && hour < 12) {
    greeting = 'Good Morning';
    emoji = '🥱';
  } else if (hour >= 12 && hour < 17) {
    greeting = 'Good Afternoon';
    emoji = '😊';
  } else if (hour >= 17 && hour < 21) {
    greeting = 'Good Evening';
    emoji = '🌆';
  } else {
    greeting = 'Good Night';
    emoji = '🌙';
  }

  return { greeting, emoji };
}

// Update greeting and date on home page
function updateGreetingAndDate() {
  const { greeting, emoji } = getGreeting();
  const today = getCurrentDate();

  // Update greeting
  const greetingElement = document.querySelector('.header h3');
  if (greetingElement) {
    greetingElement.textContent = `${greeting} ${emoji}`;
  }

  // Update date
  const dateElement = document.querySelector('.date p');
  if (dateElement) {
    dateElement.textContent = today;
  }
}

// Clear all data (for testing)
function clearAllData() {
  if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
    localStorage.clear();
    location.reload();
  }
}

// Export data as JSON
function exportData() {
  const data = {
    tasks: taskManager.getAllTasks(),
    settings: settingsManager.getAllSettings(),
    user: userManager.getUser()
  };
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `daily-routine-backup-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  notificationManager.success('Data exported successfully!');
}

// Setup theme switcher
function setupThemeSwitcher() {
  const themeOptions = document.querySelectorAll('.theme_option');
  
  themeOptions.forEach(option => {
    option.addEventListener('click', function() {
      const theme = this.dataset.theme;
      
      // Remove active class from all options
      themeOptions.forEach(opt => opt.classList.remove('active'));
      
      // Add active class to clicked option
      this.classList.add('active');
      
      // Apply theme
      if (theme === 'dark') {
        settingsManager.updateSetting('darkMode', true);
      } else if (theme === 'light') {
        settingsManager.updateSetting('darkMode', false);
      }
      
      notificationManager.success(`${theme.charAt(0).toUpperCase() + theme.slice(1)} mode enabled!`);
    });
  });

  // Set active theme on load
  const isDarkMode = settingsManager.getSetting('darkMode');
  const activeTheme = document.querySelector(`.theme_option[data-theme="${isDarkMode ? 'dark' : 'light'}"]`);
  if (activeTheme) {
    activeTheme.classList.add('active');
  }
}

// ==========================================
// 10. CSS ANIMATIONS
// ==========================================

// Add slide animation CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    TaskManager,
    SettingsManager,
    UserManager,
    NotificationManager,
    taskManager,
    settingsManager,
    userManager,
    notificationManager
  };
}
