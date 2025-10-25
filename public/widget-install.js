(function() {
  // Prevent multiple initializations
  if (window.EnrollioWidgetLoaded) return;
  window.EnrollioWidgetLoaded = true;

  // Configuration
  const WIDGET_URL = 'https://enrollio-zendesk-widget.vercel.app/widget'; // Widget iframe URL

  // Create FAB button (in parent page, always visible) - positioned independently
  const fab = document.createElement('button');
  fab.id = 'enrollio-support-fab';
  fab.setAttribute('aria-label', 'Open Enrollio Support Widget');
  fab.style.cssText = `
    position: fixed;
    bottom: 36px;
    right: 24px;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background-color: #FFC300;
    border: none;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    padding: 0;
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  `;

  // Add Enrollio logo to FAB
  const fabImg = document.createElement('img');
  fabImg.src = 'https://storage.googleapis.com/msgsndr/t34wsZgFiq6fyBrps0Ps/media/68e7abeba54d88c1ec18f4d0.png';
  fabImg.alt = 'Support';
  fabImg.style.cssText = 'width: 48px; height: 48px; border-radius: 50%;';
  fab.appendChild(fabImg);

  // Create iframe - positioned independently, starts with 0 dimensions
  const iframe = document.createElement('iframe');
  iframe.id = 'enrollio-support-widget-iframe';
  iframe.src = WIDGET_URL;
  iframe.style.cssText = `
    position: fixed;
    bottom: 36px;
    right: 24px;
    border: none;
    width: 0;
    height: 0;
    background: transparent;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
    z-index: 999998;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  `;

  // Allow iframe to be interactive
  iframe.setAttribute('allow', 'clipboard-write');
  iframe.setAttribute('title', 'Enrollio Support Widget');

  // Track widget state
  let isOpen = false;

  // FAB click handler
  fab.addEventListener('click', function() {
    isOpen = true;
    fab.style.display = 'none';

    // Expand iframe
    iframe.style.width = '400px';
    iframe.style.height = '600px';
    iframe.style.opacity = '1';
    iframe.style.pointerEvents = 'auto';

    iframe.contentWindow.postMessage({ action: 'open' }, '*');
  });

  // Listen for close messages from widget
  window.addEventListener('message', function(event) {
    if (event.data && event.data.action === 'close') {
      isOpen = false;
      fab.style.display = 'flex';

      // Collapse iframe (opacity first, then size)
      iframe.style.opacity = '0';
      iframe.style.pointerEvents = 'none';

      setTimeout(function() {
        iframe.style.width = '0';
        iframe.style.height = '0';
      }, 300);
    }
  });

  // Append to body when DOM is ready
  function init() {
    document.body.appendChild(fab);
    document.body.appendChild(iframe);
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
      isOpen = true;
      fab.style.display = 'none';

      // Expand iframe
      iframe.style.width = '400px';
      iframe.style.height = '600px';
      iframe.style.opacity = '1';
      iframe.style.pointerEvents = 'auto';

      iframe.contentWindow.postMessage({ action: 'open' }, '*');
    },
    close: function() {
      isOpen = false;
      fab.style.display = 'flex';

      // Collapse iframe (opacity first, then size)
      iframe.style.opacity = '0';
      iframe.style.pointerEvents = 'none';

      setTimeout(function() {
        iframe.style.width = '0';
        iframe.style.height = '0';
      }, 300);

      iframe.contentWindow.postMessage({ action: 'close' }, '*');
    },
    toggle: function() {
      if (isOpen) {
        this.close();
      } else {
        this.open();
      }
    }
  };
})();
