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
    width: 64px;
    height: 64px;
    z-index: 999999;
    pointer-events: none;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  `;

  // Create iframe
  const iframe = document.createElement('iframe');
  iframe.id = 'enrollio-support-widget-iframe';
  iframe.src = WIDGET_URL;
  iframe.style.cssText = `
    border: none;
    position: fixed;
    bottom: 36px;
    right: 24px;
    width: 64px;
    height: 64px;
    z-index: 999999;
    pointer-events: auto;
    background: transparent;
  `;

  // Allow iframe to be interactive
  iframe.setAttribute('allow', 'clipboard-write');
  iframe.setAttribute('title', 'Enrollio Support Widget');

  // Listen for messages from widget to resize
  window.addEventListener('message', function(event) {
    if (event.origin !== WIDGET_URL) return;

    if (event.data.type === 'enrollio-widget-resize') {
      const { width, height } = event.data;
      iframe.style.width = width;
      iframe.style.height = height;
      container.style.width = width;
      container.style.height = height;
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
