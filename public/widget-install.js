(function() {
  'use strict';

  // Prevent multiple initializations
  if (window.EnrollioWidgetLoaded) return;
  window.EnrollioWidgetLoaded = true;

  // Configuration
  const CONFIG = {
    widgetUrl: 'https://enrollio-zendesk-widget.vercel.app/widget',
    position: {
      bottom: '20px',
      right: '20px'
    },
    fabSize: 60,
    widgetSize: {
      width: 400,
      height: 600
    }
  };

  // Create FAB (Floating Action Button)
  function createFAB() {
    const button = document.createElement('button');
    button.id = 'enrollio-fab';
    button.setAttribute('aria-label', 'Open Support Chat');
    button.style.cssText = `
      position: fixed;
      bottom: ${CONFIG.position.bottom};
      right: ${CONFIG.position.right};
      width: ${CONFIG.fabSize}px;
      height: ${CONFIG.fabSize}px;
      border-radius: 50%;
      background: #FFC300;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 2147483647;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s, box-shadow 0.2s;
    `;

    // Hover effect
    button.onmouseenter = () => {
      button.style.transform = 'scale(1.05)';
      button.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
    };
    button.onmouseleave = () => {
      button.style.transform = 'scale(1)';
      button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    };

    // Add icon
    const icon = document.createElement('img');
    icon.src = 'https://storage.googleapis.com/msgsndr/t34wsZgFiq6fyBrps0Ps/media/68e7abeba54d88c1ec18f4d0.png';
    icon.alt = 'Support';
    icon.style.cssText = `
      width: 40px;
      height: 40px;
      border-radius: 50%;
    `;
    button.appendChild(icon);

    return button;
  }

  // Create Widget Container
  function createWidget() {
    const container = document.createElement('div');
    container.id = 'enrollio-widget';
    container.style.cssText = `
      position: fixed;
      bottom: -9999px;
      right: -9999px;
      width: ${CONFIG.widgetSize.width}px;
      height: ${CONFIG.widgetSize.height}px;
      z-index: 2147483646;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
      border-radius: 12px;
      overflow: hidden;
      background: white;
    `;

    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.id = 'enrollio-widget-iframe';
    iframe.src = CONFIG.widgetUrl;
    iframe.style.cssText = `
      width: 100%;
      height: 100%;
      border: none;
      display: block;
    `;
    iframe.setAttribute('allow', 'clipboard-write');
    iframe.setAttribute('title', 'Enrollio Support Widget');

    container.appendChild(iframe);
    return { container, iframe };
  }

  // Widget State Manager
  const WidgetManager = {
    isOpen: false,
    fab: null,
    widget: null,
    iframe: null,

    init() {
      // Create elements
      this.fab = createFAB();
      const widgetObj = createWidget();
      this.widget = widgetObj.container;
      this.iframe = widgetObj.iframe;

      // Add event listeners
      this.fab.addEventListener('click', () => this.toggle());
      window.addEventListener('message', (e) => this.handleMessage(e));

      // Append to DOM
      document.body.appendChild(this.fab);
      document.body.appendChild(this.widget);
    },

    toggle() {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    },

    open() {
      this.isOpen = true;

      // Move widget into position and show with animation
      this.widget.style.bottom = CONFIG.position.bottom;
      this.widget.style.right = CONFIG.position.right;

      // Use setTimeout to ensure position is set before animating
      setTimeout(() => {
        this.widget.style.opacity = '1';
        this.widget.style.pointerEvents = 'auto';
      }, 10);

      // Hide FAB
      this.fab.style.display = 'none';

      // Notify iframe
      this.iframe.contentWindow.postMessage({ action: 'open' }, '*');
    },

    close() {
      this.isOpen = false;

      // Hide widget with animation
      this.widget.style.opacity = '0';
      this.widget.style.pointerEvents = 'none';

      // Move widget off-screen after animation completes
      setTimeout(() => {
        if (!this.isOpen) {  // Only if still closed
          this.widget.style.bottom = '-9999px';
          this.widget.style.right = '-9999px';
        }
      }, 300);

      // Show FAB
      this.fab.style.display = 'flex';

      // Notify iframe
      this.iframe.contentWindow.postMessage({ action: 'close' }, '*');
    },

    handleMessage(event) {
      if (event.data && event.data.action === 'close') {
        this.close();
      }
    }
  };

  // Initialize when DOM is ready
  function init() {
    WidgetManager.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Global API
  window.EnrollioWidget = {
    open: () => WidgetManager.open(),
    close: () => WidgetManager.close(),
    toggle: () => WidgetManager.toggle(),
    isOpen: () => WidgetManager.isOpen
  };

})();
