"use client"

import EnrollioSupportWidget from "@/components/enrollio-support-widget"

export default function Home() {
  return (
    <>
      {/* Page Title */}
      <div style={{
        padding: '40px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>
          Enrollio Support Widget Test
        </h1>
        <p style={{ fontSize: '16px', color: '#666', marginBottom: '10px' }}>
          Test Instructions:
        </p>
        <ul style={{ fontSize: '14px', color: '#666', lineHeight: '1.8' }}>
          <li>Look for the <strong>yellow FAB button</strong> in the bottom-right corner</li>
          <li>Try clicking the <strong>test buttons</strong> on the right side with widget closed</li>
          <li>All buttons should be clickable and show alerts</li>
          <li>Open the widget by clicking the FAB</li>
          <li>Close the widget and verify buttons still work</li>
        </ul>
      </div>

      {/* Test Elements at Widget Position */}
      <div style={{
        position: 'fixed',
        right: '120px',
        bottom: '50px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 10
      }}>
        <button
          onClick={() => alert('Button 1 clicked!')}
          style={{
            padding: '12px 24px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px'
          }}
        >
          Test Button 1
        </button>
        <button
          onClick={() => alert('Button 2 clicked!')}
          style={{
            padding: '12px 24px',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px'
          }}
        >
          Test Button 2
        </button>
        <button
          onClick={() => alert('Button 3 clicked!')}
          style={{
            padding: '12px 24px',
            background: '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px'
          }}
        >
          Test Button 3
        </button>
      </div>

      {/* Render widget directly for local testing */}
      <div style={{
        position: 'fixed',
        bottom: '36px',
        right: '24px',
        width: '64px',
        height: '64px',
        zIndex: 999999
      }}>
        <EnrollioSupportWidget />
      </div>
    </>
  )
}
