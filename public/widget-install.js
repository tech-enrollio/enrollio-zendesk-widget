(function() {
  // Prevent multiple initializations
  if (window.EnrollioWidgetLoaded) return;
  window.EnrollioWidgetLoaded = true;

  // Configuration
  const WIDGET_URL = 'https://enrollio-zendesk-widget.vercel.app'; // Your widget URL

  // Create widget container
  const container = document.createElement('div');
  container.id = 'enrollio-support-widget-container';
  container.style.cssText = `
    position: fixed;
    bottom: 36px;
    right: 24px;
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  `;

  // Create iframe - starts small for FAB, will resize based on widget state
  const iframe = document.createElement('iframe');
  iframe.id = 'enrollio-support-widget-iframe';
  iframe.src = WIDGET_URL;
  iframe.style.cssText = `
    border: none;
    width: 64px;
    height: 64px;
    background: transparent;
  `;

  // Allow iframe to be interactive
  iframe.setAttribute('allow', 'clipboard-write');
  iframe.setAttribute('title', 'Enrollio Support Widget');

  // Listen for resize messages from widget
  window.addEventListener('message', function(event) {
    // Verify origin if needed for security
    // if (event.origin !== WIDGET_URL) return;

    if (event.data && event.data.type === 'resize') {
      const { width, height } = event.data;
      iframe.style.width = width + 'px';
      iframe.style.height = height + 'px';
    }
  });

  // Append to body when DOM is ready
  function init() {
    document.body.appendChild(container);
    container.appendChild(iframe);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Global API for controlling the widget
  window.EnrollioWidget = {
    open: function() {
      iframe.contentWindow.postMessage({ action: 'open' }, '*');
    },
    close: function() {
      iframe.contentWindow.postMessage({ action: 'close' }, '*');
    },
    toggle: function() {
      iframe.contentWindow.postMessage({ action: 'toggle' }, '*');
    }
  };
})();
