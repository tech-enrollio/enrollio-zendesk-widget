(function() {
  // Prevent multiple initializations
  if (window.EnrollioWidgetLoaded) return;
  window.EnrollioWidgetLoaded = true;

  // Configuration
  const WIDGET_URL = 'https://enrollio-zendesk-widget.vercel.app/widget'; // Widget iframe URL

  // Create FAB container - minimal size (FAB button + 5px)
  // Container allows clicks to pass through everywhere except the button itself
  const fabContainer = document.createElement('div');
  fabContainer.id = 'enrollio-fab-container';
  fabContainer.style.cssText = `
    position: fixed;
    bottom: 36px;
    right: 24px;
    width: 69px;
    height: 69px;
    z-index: 999;
    pointer-events: none !important;
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
    pointer-events: auto !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  `;

  // Add Enrollio logo to FAB
  const fabImg = document.createElement('img');
  fabImg.src = 'https://storage.googleapis.com/msgsndr/t34wsZgFiq6fyBrps0Ps/media/68e7abeba54d88c1ec18f4d0.png';
  fabImg.alt = 'Support';
  fabImg.style.cssText = 'width: 48px; height: 48px; border-radius: 50%;';
  fab.appendChild(fabImg);
  fabContainer.appendChild(fab);

  // Create widget container - completely separate from FAB
  // When collapsed: clicks pass through (pointer-events: none)
  // When opened: clicks captured (pointer-events: auto)
  const widgetContainer = document.createElement('div');
  widgetContainer.id = 'enrollio-widget-container';
  widgetContainer.style.cssText = `
    position: fixed;
    bottom: 36px;
    right: 24px;
    width: 400px;
    height: 600px;
    z-index: 999999;
    display: none;
    pointer-events: none !important;
    visibility: hidden;
  `;

  // Create iframe
  const iframe = document.createElement('iframe');
  iframe.id = 'enrollio-support-widget-iframe';
  iframe.src = WIDGET_URL;
  iframe.style.cssText = `
    border: none;
    width: 100%;
    height: 100%;
    background: transparent;
    display: block;
    pointer-events: auto !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  `;

  // Allow iframe to be interactive
  iframe.setAttribute('allow', 'clipboard-write');
  iframe.setAttribute('title', 'Enrollio Support Widget');
  widgetContainer.appendChild(iframe);

  // Track widget state
  let isOpen = false;

  // FAB click handler
  fab.addEventListener('click', function() {
    isOpen = true;
    fabContainer.style.display = 'none';

    // Show widget container and enable pointer events
    widgetContainer.style.display = 'block';
    widgetContainer.style.visibility = 'visible';
    widgetContainer.style.setProperty('pointer-events', 'auto', 'important');

    iframe.contentWindow.postMessage({ action: 'open' }, '*');
  });

  // Listen for close messages from widget
  window.addEventListener('message', function(event) {
    if (event.data && event.data.action === 'close') {
      isOpen = false;
      fabContainer.style.display = 'block';

      // Hide widget container and disable pointer events
      widgetContainer.style.display = 'none';
      widgetContainer.style.visibility = 'hidden';
      widgetContainer.style.setProperty('pointer-events', 'none', 'important');
    }
  });

  // Append to body when DOM is ready
  function init() {
    document.body.appendChild(fabContainer);
    document.body.appendChild(widgetContainer);
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
      fabContainer.style.display = 'none';

      // Show widget container and enable pointer events
      widgetContainer.style.display = 'block';
      widgetContainer.style.visibility = 'visible';
      widgetContainer.style.setProperty('pointer-events', 'auto', 'important');

      iframe.contentWindow.postMessage({ action: 'open' }, '*');
    },
    close: function() {
      isOpen = false;
      fabContainer.style.display = 'block';

      // Hide widget container and disable pointer events
      widgetContainer.style.display = 'none';
      widgetContainer.style.visibility = 'hidden';
      widgetContainer.style.setProperty('pointer-events', 'none', 'important');

      iframe.contentWindow.postMessage({ action: 'close' }, '*');
    },
    toggle: function() {
      if (isOpen) {
        this.close();
      } else {
        this.open();
      }
    },
    // Expose containers for custom styling
    getFabContainer: function() {
      return fabContainer;
    },
    getWidgetContainer: function() {
      return widgetContainer;
    }
  };
})();
