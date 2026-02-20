export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 px-6 py-12 md:py-16">
      <div className="max-w-3xl mx-auto space-y-10">
        <header className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">Privacy Policy</h1>
          <p className="text-sm md:text-base text-slate-500 max-w-xl">
            This page explains how voice recordings and generated text are handled in this
            application.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">What data we collect</h2>
          <ul className="space-y-2 text-sm md:text-base text-slate-600 list-disc list-inside">
            <li>Audio recorded from your microphone when you start a recording.</li>
            <li>Transcripts generated from that audio.</li>
            <li>Generated outputs such as emails, notes, and messages you choose to save.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">How your data is processed</h2>
          <ul className="space-y-2 text-sm md:text-base text-slate-600 list-disc list-inside">
            <li>
              Audio and text may be sent to external AI services over an encrypted connection to
              perform transcription and formatting.
            </li>
            <li>
              When local processing is enabled in the recorder, transcription is kept in your
              browser when supported, and audio chunks are not sent to the transcription API.
            </li>
            <li>
              Saved outputs in your library are stored on the server so you can access them later.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">Retention and control</h2>
          <ul className="space-y-2 text-sm md:text-base text-slate-600 list-disc list-inside">
            <li>You can delete saved outputs from your library at any time.</li>
            <li>
              Local recording history inside the recorder is stored in your browser only and can be
              cleared by clearing site data.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">Security</h2>
          <ul className="space-y-2 text-sm md:text-base text-slate-600 list-disc list-inside">
            <li>All communication with the server is intended to happen over HTTPS.</li>
            <li>
              Audio and text stored on the server should be protected with appropriate access
              controls and encryption at rest, depending on the deployment environment.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <p className="text-xs md:text-sm text-slate-500">
            This sample policy describes how the application is designed to work. For production
            deployments, the operator of this service should review and update this page to match
            their actual infrastructure, storage, and compliance requirements.
          </p>
        </section>
      </div>
    </div>
  )
}

