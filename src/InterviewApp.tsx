import { GeneralInterviewQuestions } from './components/GeneralInterviewQuestions'
import { Navbar } from './components/Navbar'

export function InterviewApp() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 pb-16 pt-20 sm:pt-24">
        <GeneralInterviewQuestions />
      </main>
    </div>
  )
}
