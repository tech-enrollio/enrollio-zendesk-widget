import EnrollioSupportWidget from "@/components/enrollio-support-widget"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Enrollio Support Widget Demo</h1>
        <p className="text-lg text-gray-600 mb-8">
          Check out the floating support widget in the bottom-right corner! It includes chat, news, roadmap, feature
          requests, and help center functionality.
        </p>

        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Widget Features</h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-[#FFC300] font-bold">💬</span>
              <span>
                <strong>Chat Tab:</strong> Connect with Enrollio support team with Zendesk integration
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#FFC300] font-bold">🗞️</span>
              <span>
                <strong>News Tab:</strong> Stay updated with latest product releases and features
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#FFC300] font-bold">🗺️</span>
              <span>
                <strong>Roadmap Tab:</strong> See what's planned, in progress, and recently released
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#FFC300] font-bold">💡</span>
              <span>
                <strong>Feature Requests:</strong> Submit your ideas and help shape the product
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#FFC300] font-bold">📖</span>
              <span>
                <strong>Help Center:</strong> Search tutorials, FAQs, and documentation
              </span>
            </li>
          </ul>
        </div>
      </div>

      <EnrollioSupportWidget />
    </main>
  )
}
