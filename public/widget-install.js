(function() {
  // Prevent multiple initializations
  if (window.EnrollioWidgetLoaded) return;
  window.EnrollioWidgetLoaded = true;

  // Configuration
  const WIDGET_URL = 'https://enrollio-zendesk-widget.vercel.app/widget'; // Widget iframe URL

  // Create widget container - starts small (just FAB size)
  const container = document.createElement('div');
  container.id = 'enrollio-support-widget-container';
  container.style.cssText = `
    position: fixed;
    bottom: 36px;
    right: 24px;
    z-index: 999999;
    width: 64px;
    height: 64px;
    pointer-events: none;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  `;

  // Create FAB button (in parent page, always visible)
  const fab = document.createElement('button');
  fab.id = 'enrollio-support-fab';
  fab.setAttribute('aria-label', 'Open Enrollio Support Widget');
  fab.style.cssText = `
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
    pointer-events: auto;
  `;

  // Add Enrollio logo to FAB
  const fabImg = document.createElement('img');
  fabImg.src = 'https://storage.googleapis.com/msgsndr/t34wsZgFiq6fyBrps0Ps/media/68e7abeba54d88c1ec18f4d0.png';
  fabImg.alt = 'Support';
  fabImg.style.cssText = 'width: 48px; height: 48px; border-radius: 50%;';
  fab.appendChild(fabImg);

  // Create iframe - starts hidden with 0 dimensions
  const iframe = document.createElement('iframe');
  iframe.id = 'enrollio-support-widget-iframe';
  iframe.src = WIDGET_URL;
  iframe.style.cssText = `
    border: none;
    width: 0;
    height: 0;
    background: transparent;
    position: absolute;
    bottom: 0;
    right: 0;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease, width 0s 0.3s, height 0s 0.3s;
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

    // Expand container and iframe
    container.style.width = '400px';
    container.style.height = '600px';
    iframe.style.width = '400px';
    iframe.style.height = '600px';
    iframe.style.transition = 'opacity 0.3s ease';
    iframe.style.opacity = '1';
    iframe.style.pointerEvents = 'auto';

    iframe.contentWindow.postMessage({ action: 'open' }, '*');
  });

  // Listen for close messages from widget
  window.addEventListener('message', function(event) {
    if (event.data && event.data.action === 'close') {
      isOpen = false;
      fab.style.display = 'flex';

      // Collapse iframe first (with transition)
      iframe.style.opacity = '0';
      iframe.style.pointerEvents = 'none';

      // Then collapse container and iframe size after opacity transition
      setTimeout(function() {
        container.style.width = '64px';
        container.style.height = '64px';
        iframe.style.width = '0';
        iframe.style.height = '0';
      }, 300);
    }
  });

  // Append to body when DOM is ready
  function init() {
    document.body.appendChild(container);
    container.appendChild(fab);
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
      isOpen = true;
      fab.style.display = 'none';

      // Expand container and iframe
      container.style.width = '400px';
      container.style.height = '600px';
      iframe.style.width = '400px';
      iframe.style.height = '600px';
      iframe.style.transition = 'opacity 0.3s ease';
      iframe.style.opacity = '1';
      iframe.style.pointerEvents = 'auto';

      iframe.contentWindow.postMessage({ action: 'open' }, '*');
    },
    close: function() {
      isOpen = false;
      fab.style.display = 'flex';

      // Collapse iframe first (with transition)
      iframe.style.opacity = '0';
      iframe.style.pointerEvents = 'none';

      // Then collapse container and iframe size after opacity transition
      setTimeout(function() {
        container.style.width = '64px';
        container.style.height = '64px';
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
