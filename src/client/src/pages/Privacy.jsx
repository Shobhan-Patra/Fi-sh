export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-300">
      <h1 className="text-4xl font-bold text-indigo-400 mb-8">Privacy Policy</h1>
      
      <div className="space-y-6">     
        <div>
          <h2 className="text-2xl font-semibold text-white mb-3">Information We Collect</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Anonymous User & Room Data:</strong> When you create or join a room, we generate temporary, anonymous user IDs and room IDs. These are not linked to your real-world identity.</li>
            <li><strong>Uploaded Files:</strong> Files you upload are stored temporarily on our cloud storage provider. We do not access the contents of your files.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-white mb-3">Information Sharing</h2>
          <p>We do not share your information or file contents with third parties, except as required to operate the service or comply with the law.</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-white mb-3">Data Retention & Deletion</h2>
          <p>All rooms, and the files within them, are automatically and permanently deleted 24 hours after creation.</p>
        </div>
      </div>
    </div>
  );
}