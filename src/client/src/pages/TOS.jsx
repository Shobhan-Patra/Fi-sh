export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-300">
      <h1 className="text-4xl font-bold text-indigo-400 mb-8">
        Terms of Service
      </h1>

      <div className="space-y-6">
        <p>
          Welcome to SnipShare! By using our service ("Service"), you agree to
          be bound by these Terms of Service.
        </p>

        <div>
          <h2 className="text-2xl font-semibold text-white mb-3">
            1. Use of Service
          </h2>
          <p>
            SnipShare is provided as a free, temporary file-sharing utility. You
            are solely responsible for the content you upload and share through
            the Service.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-white mb-3">
            2. Disclaimer of Warranties
          </h2>
          <p>
            The Service is provided on an "as is" and "as available" basis. We
            make no warranties of any kind, whether express or implied,
            regarding the reliability, security, or availability of the Service.
            You use the Service at your own risk.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-white mb-3">
            3. Limitation of Liability
          </h2>
          <p>
            In no event shall SnipShare be liable for any direct, indirect,
            incidental, or consequential damages, including but not limited to,
            loss of data, arising out of the use or inability to use the
            Service.
          </p>
        </div>
      </div>
    </div>
  );
}
