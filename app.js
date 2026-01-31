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
    this.notifications = this.loadNotifications();
  }

  // Load notifications from localStorage
  loadNotifications() {
    const stored = localStorage.getItem('notifications');
    return stored ? JSON.parse(stored) : [];
  }

  // Save notifications to localStorage
  saveNotifications() {
    localStorage.setItem('notifications', JSON.stringify(this.notifications));
  }

  // Add notification to history
  addNotification(message, type = 'info') {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false
    };
    this.notifications.unshift(notification);
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50);
    }
    this.saveNotifications();
    this.updateNotificationBadge();
  }

  // Get all notifications
  getAllNotifications() {
    return this.notifications;
  }

  // Get unread notifications count
  getUnreadCount() {
    return this.notifications.filter(n => !n.read).length;
  }

  // Mark notification as read
  markAsRead(id) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.saveNotifications();
      this.updateNotificationBadge();
    }
  }

  // Mark all as read
  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.saveNotifications();
    this.updateNotificationBadge();
  }

  // Update notification badge
  updateNotificationBadge() {
    const badges = document.querySelectorAll('.notification_badge');
    const unreadCount = this.getUnreadCount();
    badges.forEach(badge => {
      badge.textContent = unreadCount;
      badge.style.display = unreadCount > 0 ? 'flex' : 'none';
    });
  }

  // Show notification
  show(message, type = 'info', duration = 3000) {
    // Add to notification history
    this.addNotification(message, type);

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

// Show only completed tasks view
function showCompletedTasksView() {
  // Hide main tasks section
  const myTasks = document.querySelector('.my_tasks');
  const completedSection = document.querySelector('.completed_section');
  
  if (myTasks) myTasks.style.display = 'none';
  if (completedSection) completedSection.style.display = 'none';
  
  // Create or show completed tasks view
  let completedView = document.querySelector('.completed_tasks_view');
  if (!completedView) {
    completedView = document.createElement('div');
    completedView.className = 'my_tasks completed_tasks_view';
    completedView.innerHTML = `
      <h3><i class="fas fa-check-circle"></i> Completed Tasks</h3>
      <div class="completed_tasks_list"></div>
      <button class="back_to_home_btn" onclick="showHomeView()">← Back to Home</button>
    `;
    document.querySelector('.bottom_div').appendChild(completedView);
  } else {
    completedView.style.display = 'block';
  }
  
  // Render completed tasks in the view
  renderCompletedTasksInView();
}

// Show home view
function showHomeView() {
  const myTasks = document.querySelector('.my_tasks');
  const completedSection = document.querySelector('.completed_section');
  const completedView = document.querySelector('.completed_tasks_view');
  
  if (myTasks) myTasks.style.display = 'block';
  if (completedSection) completedSection.style.display = 'block';
  if (completedView) completedView.style.display = 'none';
}

// Render completed tasks in dedicated view
function renderCompletedTasksInView() {
  const completedTasksList = document.querySelector('.completed_tasks_list');
  if (!completedTasksList) return;

  const completedTasks = taskManager.getCompletedTasks();
  completedTasksList.innerHTML = '';

  if (completedTasks.length === 0) {
    completedTasksList.innerHTML = `<p style="text-align: center; color: #9e9e9e; padding: 40px;">No completed tasks yet.</p>`;
    return;
  }

  completedTasks.forEach(task => {
    const taskItem = document.createElement('div');
    taskItem.className = 'task_item completed';
    
    const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
    const dueDateText = dueDate ? ` · ${dueDate}` : '';
    
    taskItem.innerHTML = `
      <input type="checkbox" checked disabled class="task-checkbox" />
      <div style="flex: 1;">
        <label style="margin: 0; text-decoration: line-through; opacity: 0.7;">${task.title}</label>
        ${task.dueTime ? `<p style="font-size: 12px; color: #9e9e9e; margin: 3px 0 0 0;">⏰ ${task.dueTime}${dueDateText}</p>` : `${dueDate ? `<p style="font-size: 12px; color: #9e9e9e; margin: 3px 0 0 0;">${dueDate}</p>` : ''}`}
      </div>
      <span style="color: #9cc3a5; font-weight: bold; font-size: 16px;">✓</span>
    `;

    completedTasksList.appendChild(taskItem);
  });
}
function renderCompletedTasks() {
  const completedTaskList = document.querySelector('.completed_task_list');
  if (!completedTaskList) return;

  const completedTasks = taskManager.getCompletedTasks();
  completedTaskList.innerHTML = '';

  if (completedTasks.length === 0) {
    completedTaskList.innerHTML = `<p style="text-align: center; color: #9e9e9e; padding: 20px;">No completed tasks yet.</p>`;
    return;
  }

  completedTasks.forEach(task => {
    const taskItem = document.createElement('div');
    taskItem.className = 'task_item completed';
    
    const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
    const dueDateText = dueDate ? ` · ${dueDate}` : '';
    
    taskItem.innerHTML = `
      <input type="checkbox" checked disabled class="task-checkbox" data-task-id="${task.id}" />
      <div style="flex: 1;">
        <label style="margin: 0; text-decoration: line-through; opacity: 0.7;">${task.title}</label>
        ${task.dueTime ? `<p style="font-size: 12px; color: #9e9e9e; margin: 3px 0 0 0;">⏰ ${task.dueTime}${dueDateText}</p>` : `${dueDate ? `<p style="font-size: 12px; color: #9e9e9e; margin: 3px 0 0 0;">${dueDate}</p>` : ''}`}
      </div>
      <span style="color: #9cc3a5; font-weight: bold; font-size: 12px;">✓</span>
    `;

    // Completed tasks cannot be unchecked
    // No event listener needed for disabled checkboxes

    completedTaskList.appendChild(taskItem);
  });
}
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

  // Filter out completed tasks
  tasks = tasks.filter(task => !task.completed);

  if (tasks.length === 0) {
    const message = filter === 'all' ? 'No pending tasks. Great job!' :
                    filter === 'today' ? 'No tasks for today!' :
                    'No upcoming tasks!';
    taskList.innerHTML = `<p style="text-align: center; color: #9e9e9e; padding: 20px;">${message}</p>`;
    return;
  }

  tasks.forEach(task => {
    const taskItem = document.createElement('div');
    taskItem.className = 'task_item swipeable';
    
    const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
    const dueDateText = dueDate ? ` · ${dueDate}` : '';
    
    taskItem.innerHTML = `
      <div class="task_content">
        <input type="checkbox" class="task-checkbox" data-task-id="${task.id}" />
        <div style="flex: 1;">
          <label style="margin: 0;">${task.title}</label>
          ${task.dueTime ? `<p style="font-size: 12px; color: #9e9e9e; margin: 3px 0 0 0;">⏰ ${task.dueTime}${dueDateText}</p>` : `${dueDate ? `<p style="font-size: 12px; color: #9e9e9e; margin: 3px 0 0 0;">${dueDate}</p>` : ''}`}
        </div>
        ${task.priority === 'high' ? '<span style="color: #d98c7c; font-weight: bold; font-size: 12px;">●</span>' : ''}
      </div>
      <div class="delete_action">
        <i class="fas fa-trash"></i>
      </div>
    `;

    // Add swipe functionality
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    taskItem.addEventListener('touchstart', function(e) {
      startX = e.touches[0].clientX;
      isDragging = true;
    });

    taskItem.addEventListener('touchmove', function(e) {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
      const diffX = startX - currentX;
      
      if (diffX > 0 && diffX <= 80) {
        taskItem.style.transform = `translateX(-${diffX}px)`;
      }
    });

    taskItem.addEventListener('touchend', function(e) {
      if (!isDragging) return;
      isDragging = false;
      
      const diffX = startX - currentX;
      if (diffX > 40) {
        taskItem.style.transform = 'translateX(-80px)';
        taskItem.classList.add('swiped');
      } else {
        taskItem.style.transform = 'translateX(0)';
        taskItem.classList.remove('swiped');
      }
    });

    // Delete button click
    taskItem.querySelector('.delete_action').addEventListener('click', function() {
      if (confirm('Delete this task?')) {
        taskManager.deleteTask(task.id);
        renderTaskList(currentFilter);
        updateDashboardStats();
        notificationManager.success('Task deleted!');
      }
    });

    // Add checkbox event listener
    taskItem.querySelector('.task-checkbox').addEventListener('change', function() {
      taskManager.toggleTask(task.id);
      renderTaskList(currentFilter);
      renderCompletedTasks();
      updateDashboardStats();
      notificationManager.success('Task completed!');
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

  // Setup notification bell click handler
  const notificationIcons = document.querySelectorAll('.notification_icon_top');
  notificationIcons.forEach(icon => {
    icon.addEventListener('click', function(e) {
      e.preventDefault();
      showNotificationsModal();
    });
  });

  // Initialize range sliders
  initializeRangeSliders();

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

  // Add completed tasks footer link handler
  const completedTasksLink = document.getElementById('completedTasksLink');
  if (completedTasksLink) {
    completedTasksLink.addEventListener('click', function(e) {
      e.preventDefault();
      showCompletedTasksView();
    });
  }

  // Initialize event listeners
  initEventListeners();

  // Setup theme switcher if on settings page
  if (document.querySelector('.theme_option')) {
    setupThemeSwitcher();
  }

  // Update notification badge on load
  notificationManager.updateNotificationBadge();

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

// Initialize range sliders with dynamic colors
function initializeRangeSliders() {
  const rangeInputs = document.querySelectorAll('input[type="range"]');
  
  rangeInputs.forEach(range => {
    // Update range on input
    range.addEventListener('input', function() {
      updateRangeSlider(this);
    });
    
    // Initial update
    updateRangeSlider(range);
  });
}

// Update range slider colors and progress
function updateRangeSlider(range) {
  const value = parseInt(range.value);
  const min = parseInt(range.min) || 0;
  const max = parseInt(range.max) || 100;
  const percentage = ((value - min) / (max - min)) * 100;
  
  // Update CSS custom property for progress
  range.style.setProperty('--progress', `${percentage}%`);
  
  // Remove existing color classes
  range.classList.remove('range-low', 'range-medium', 'range-high', 'range-excellent');
  
  // Add appropriate color class based on percentage
  if (percentage <= 25) {
    range.classList.add('range-low');
  } else if (percentage <= 50) {
    range.classList.add('range-medium');
  } else if (percentage <= 75) {
    range.classList.add('range-high');
  } else {
    range.classList.add('range-excellent');
  }
  
  // Update value display if it exists
  const valueDisplay = range.nextElementSibling;
  if (valueDisplay && valueDisplay.classList.contains('range-value')) {
    valueDisplay.textContent = `${Math.round(percentage)}%`;
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

  .task_item.swipeable {
    position: relative;
    overflow: hidden;
    transition: transform 0.3s ease;
  }

  .task_item .task_content {
    display: flex;
    align-items: center;
    padding: 15px;
    background: white;
    position: relative;
    z-index: 2;
  }

  .task_item .delete_action {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 80px;
    background: #d98c7c;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 18px;
    cursor: pointer;
    z-index: 1;
  }

  .task_item.swiped .delete_action {
    animation: pulse 0.3s ease;
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }

  /* Ultra Premium Range Input Styling */
  .range-wrapper {
    position: relative;
    padding: 20px 0;
    margin: 20px 0;
  }

  input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 12px;
    border-radius: 6px;
    background: linear-gradient(90deg, 
      #f4c97a 0%, 
      #f4c97a var(--progress, 50%), 
      rgba(232, 232, 232, 0.3) var(--progress, 50%), 
      rgba(232, 232, 232, 0.3) 100%);
    outline: none;
    margin: 20px 0;
    position: relative;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.1), 0 1px 2px rgba(244, 201, 122, 0.2);
  }

  input[type="range"]:hover {
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.1), 0 4px 12px rgba(244, 201, 122, 0.4);
    transform: translateY(-1px);
  }

  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, #fff 0%, #f4c97a 40%, #e6b566 100%);
    cursor: pointer;
    border: 4px solid rgba(255, 255, 255, 0.9);
    box-shadow: 
      0 0 0 1px rgba(244, 201, 122, 0.3),
      0 6px 20px rgba(244, 201, 122, 0.4),
      0 2px 8px rgba(0, 0, 0, 0.15),
      inset 0 1px 2px rgba(255, 255, 255, 0.8);
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    position: relative;
  }

  input[type="range"]::-webkit-slider-thumb:hover {
    transform: scale(1.2) translateY(-2px);
    box-shadow: 
      0 0 0 2px rgba(244, 201, 122, 0.5),
      0 8px 25px rgba(244, 201, 122, 0.6),
      0 4px 12px rgba(0, 0, 0, 0.2),
      inset 0 1px 3px rgba(255, 255, 255, 0.9);
    background: radial-gradient(circle at 30% 30%, #fff 0%, #f2c068 40%, #e4b364 100%);
  }

  input[type="range"]::-webkit-slider-thumb:active {
    transform: scale(1.1);
    box-shadow: 
      0 0 0 3px rgba(244, 201, 122, 0.7),
      0 4px 15px rgba(244, 201, 122, 0.5),
      inset 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  input[type="range"]::-moz-range-thumb {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, #fff 0%, #f4c97a 40%, #e6b566 100%);
    cursor: pointer;
    border: 4px solid rgba(255, 255, 255, 0.9);
    box-shadow: 
      0 0 0 1px rgba(244, 201, 122, 0.3),
      0 6px 20px rgba(244, 201, 122, 0.4),
      0 2px 8px rgba(0, 0, 0, 0.15);
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  input[type="range"]::-moz-range-track {
    width: 100%;
    height: 12px;
    border-radius: 6px;
    background: rgba(232, 232, 232, 0.3);
    border: none;
  }

  input[type="range"]:focus {
    outline: none;
  }

  input[type="range"]:focus::-webkit-slider-thumb {
    box-shadow: 
      0 0 0 4px rgba(244, 201, 122, 0.3),
      0 0 0 6px rgba(244, 201, 122, 0.1),
      0 6px 20px rgba(244, 201, 122, 0.4),
      inset 0 1px 2px rgba(255, 255, 255, 0.8);
  }

  /* Animated progress indicator */
  .range-progress {
    position: absolute;
    top: 50%;
    left: 0;
    height: 12px;
    background: linear-gradient(90deg, #f4c97a 0%, #f2c068 100%);
    border-radius: 6px;
    transform: translateY(-50%);
    transition: width 0.3s ease;
    box-shadow: 0 2px 8px rgba(244, 201, 122, 0.3);
    z-index: -1;
  }

  /* Premium value display */
  .range-value {
    position: absolute;
    top: -45px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #333 0%, #555 100%);
    color: white;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    pointer-events: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    min-width: 40px;
    text-align: center;
  }

  .range-value::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: #333;
  }

  input[type="range"]:hover + .range-value,
  input[type="range"]:focus + .range-value {
    opacity: 1;
    transform: translateX(-50%) translateY(-5px);
  }

  /* Tick marks */
  .range-ticks {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    transform: translateY(-50%);
    z-index: -2;
  }

  .range-tick {
    position: absolute;
    width: 2px;
    height: 8px;
    background: rgba(244, 201, 122, 0.3);
    transform: translateY(-50%);
  }

  .range-tick.major {
    height: 12px;
    width: 3px;
    background: rgba(244, 201, 122, 0.5);
  }

  /* Enhanced labels */
  .range-labels {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    font-size: 12px;
    color: #666;
    font-weight: 500;
  }

  .range-label {
    padding: 4px 8px;
    background: rgba(244, 201, 122, 0.1);
    border-radius: 4px;
    transition: all 0.3s ease;
  }

  .range-label:hover {
    background: rgba(244, 201, 122, 0.2);
    color: #333;
  }

  /* Glow effect on interaction */
  @keyframes rangeGlow {
    0% { box-shadow: 0 0 5px rgba(244, 201, 122, 0.5); }
    50% { box-shadow: 0 0 20px rgba(244, 201, 122, 0.8); }
    100% { box-shadow: 0 0 5px rgba(244, 201, 122, 0.5); }
  }

  input[type="range"]:active {
    animation: rangeGlow 0.6s ease-in-out;
  }

  /* Dynamic color classes */
  input[type="range"].range-low {
    background: linear-gradient(90deg, 
      #ff6b6b 0%, 
      #ff6b6b var(--progress, 0%), 
      rgba(232, 232, 232, 0.3) var(--progress, 0%), 
      rgba(232, 232, 232, 0.3) 100%);
  }

  input[type="range"].range-medium {
    background: linear-gradient(90deg, 
      #ffd93d 0%, 
      #ffd93d var(--progress, 0%), 
      rgba(232, 232, 232, 0.3) var(--progress, 0%), 
      rgba(232, 232, 232, 0.3) 100%);
  }

  input[type="range"].range-high {
    background: linear-gradient(90deg, 
      #6bcf7f 0%, 
      #6bcf7f var(--progress, 0%), 
      rgba(232, 232, 232, 0.3) var(--progress, 0%), 
      rgba(232, 232, 232, 0.3) 100%);
  }

  input[type="range"].range-excellent {
    background: linear-gradient(90deg, 
      #4ecdc4 0%, 
      #4ecdc4 var(--progress, 0%), 
      rgba(232, 232, 232, 0.3) var(--progress, 0%), 
      rgba(232, 232, 232, 0.3) 100%);
  }

  /* Desktop enhancements - min-width 768px */
  @media (min-width: 768px) {
    .top_header {
      max-width: 1200px;
      margin: 0 auto;
      box-shadow: 0 0 20px rgba(0,0,0,0.1);
    }
    
    .header {
      padding: 30px 40px;
    }
    
    .bottom_div {
      padding: 30px 40px;
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 30px;
    }
    
    .my_tasks {
      grid-column: 1;
    }
    
    .remain_tasks, .completed_section {
      grid-column: 2;
      position: sticky;
      top: 20px;
      height: fit-content;
    }
    
    .task_item {
      margin-bottom: 12px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      transition: all 0.3s ease;
    }
    
    .task_item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.12);
    }
    
    .footer_nav {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 40px;
    }
    
    .modal_content {
      max-width: 600px !important;
    }
    
    .stats_grid {
      grid-template-columns: repeat(4, 1fr) !important;
    }
    
    .settings_category, .account_section {
      max-width: 800px;
      margin: 0 auto 30px;
    }
  }
  
  /* Large desktop enhancements - min-width 1024px */
  @media (min-width: 1024px) {
    .bottom_div {
      grid-template-columns: 2fr 1fr;
      gap: 40px;
    }
    
    .header h1 {
      font-size: 2.5rem;
    }
    
    .task_item {
      padding: 20px;
    }
    
    .remain_tasks {
      padding: 25px;
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

// Show notifications modal
function showNotificationsModal() {
  const notifications = notificationManager.getAllNotifications();
  const modal = document.createElement('div');
  modal.className = 'modal_overlay';
  
  let notificationsList = '';
  if (notifications.length === 0) {
    notificationsList = '<p style="text-align: center; color: #999; padding: 20px;">No notifications yet</p>';
  } else {
    notificationsList = notifications.map(notif => {
      const timeAgo = getTimeAgo(new Date(notif.timestamp));
      const typeIcon = getNotificationIcon(notif.type);
      return `
        <div class="notification_item ${notif.read ? 'read' : 'unread'}" data-id="${notif.id}">
          <div class="notif_icon ${notif.type}">${typeIcon}</div>
          <div class="notif_content">
            <p>${notif.message}</p>
            <span class="notif_time">${timeAgo}</span>
          </div>
        </div>
      `;
    }).join('');
  }
  
  modal.innerHTML = `
    <div class="modal_content">
      <div class="modal_header">
        <h3>Notifications</h3>
        <div>
          <button onclick="notificationManager.markAllAsRead(); this.closest('.modal_overlay').remove(); notificationManager.updateNotificationBadge();" style="background: #f4c97a; color: white; border: none; padding: 5px 10px; border-radius: 5px; margin-right: 10px; font-size: 12px;">Mark All Read</button>
          <button onclick="this.closest('.modal_overlay').remove()" style="background: none; border: none; font-size: 20px; cursor: pointer;">&times;</button>
        </div>
      </div>
      <div class="notifications_list">
        ${notificationsList}
      </div>
    </div>
  `;
  
  modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;';
  modal.querySelector('.modal_content').style.cssText = 'background: white; border-radius: 10px; width: 90%; max-width: 500px; max-height: 80vh; overflow: hidden;';
  modal.querySelector('.modal_header').style.cssText = 'padding: 15px 20px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;';
  modal.querySelector('.notifications_list').style.cssText = 'max-height: 400px; overflow-y: auto; padding: 10px;';
  
  document.body.appendChild(modal);
  
  // Add click handlers for individual notifications
  modal.querySelectorAll('.notification_item.unread').forEach(item => {
    item.addEventListener('click', function() {
      const id = parseInt(this.dataset.id);
      notificationManager.markAsRead(id);
      this.classList.remove('unread');
      this.classList.add('read');
    });
  });
}

// Helper functions
function getTimeAgo(date) {
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function getNotificationIcon(type) {
  const icons = {
    'success': '✓',
    'error': '⚠',
    'warning': '⚠',
    'info': 'ℹ'
  };
  return icons[type] || 'ℹ';
}

// Add notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
  .notification_item { display: flex; padding: 12px; border-bottom: 1px solid #f0f0f0; cursor: pointer; }
  .notification_item:hover { background: #f9f9f9; }
  .notification_item.unread { background: #f0f8ff; border-left: 3px solid #f4c97a; }
  .notif_icon { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px; font-weight: bold; }
  .notif_icon.success { background: #e8f5e8; color: #4caf50; }
  .notif_icon.error { background: #ffeaea; color: #f44336; }
  .notif_icon.warning { background: #fff8e1; color: #ff9800; }
  .notif_icon.info { background: #e3f2fd; color: #2196f3; }
  .notif_content { flex: 1; }
  .notif_content p { margin: 0 0 4px 0; font-size: 14px; }
  .notif_time { font-size: 12px; color: #999; }
`;
document.head.appendChild(notificationStyles);
