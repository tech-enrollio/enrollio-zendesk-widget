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
    bottom: 20px;
    right: 20px;
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  `;

  // Create iframe
  const iframe = document.createElement('iframe');
  iframe.id = 'enrollio-support-widget-iframe';
  iframe.src = WIDGET_URL;
  iframe.style.cssText = `
    border: none;
    position: fixed;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    max-width: 450px;
    max-height: 680px;
    z-index: 999999;
    pointer-events: auto;
  `;

  // Allow iframe to be interactive
  iframe.setAttribute('allow', 'clipboard-write');
  iframe.setAttribute('title', 'Enrollio Support Widget');

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
