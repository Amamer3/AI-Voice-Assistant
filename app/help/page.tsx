import Link from 'next/link'

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 px-6 py-12 md:py-16">
      <div className="max-w-3xl mx-auto space-y-10">
        <header className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">Help & FAQ</h1>
          <p className="text-sm md:text-base text-slate-500 max-w-xl">
            Learn how to use the voice assistant, how your recordings are processed, and how to
            control your privacy.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">What does this assistant do?</h2>
          <p className="text-sm md:text-base text-slate-600">
            The assistant turns short voice notes into polished outputs such as emails, meeting
            notes, and quick messages. You speak into the microphone, we transcribe your words to
            text, and then use AI to format the text into the output type you choose.
          </p>
          <p className="text-sm md:text-base text-slate-600">
            Example: tap the mic, talk through your meeting, then choose “Email Draft” to get a
            ready-to-send email written in a professional tone.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">How is my voice processed?</h2>
          <ul className="space-y-2 text-sm md:text-base text-slate-600 list-disc list-inside">
            <li>Your browser records audio only after you press the record button.</li>
            <li>
              By default, audio is sent securely to the server and to external AI APIs for
              transcription and formatting.
            </li>
            <li>
              When you enable the local processing option in the recorder, transcription stays in
              your browser when supported by your device.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">Do I have to grant microphone access?</h2>
          <p className="text-sm md:text-base text-slate-600">
            Yes, microphone access is required to capture your voice. Before the first recording,
            you will see a clear consent prompt explaining why the microphone is needed. You can
            choose not to allow it and still browse the app.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">How can I give feedback or report a bug?</h2>
          <p className="text-sm md:text-base text-slate-600">
            Use the Feedback link in the footer to send an email with your comments, or contact the
            team through your usual support channel.
          </p>
        </section>

        <section className="space-y-3">
          <p className="text-xs md:text-sm text-slate-500">
            For details about data use and retention, see our{' '}
            <Link href="/privacy" className="text-noiz-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  )
}

