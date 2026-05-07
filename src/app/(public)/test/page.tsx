import { createClient } from '@/lib/supabase/server'
import { calculatePrizePool } from '@/lib/prize-pool/calculate'
import { getUserScores } from '@/lib/db/queries'
import { ApiTester } from './ApiTester'

export const dynamic = 'force-dynamic'

export default async function DiagnosticPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let prizePoolTest = null
  let poolError = null
  try {
    prizePoolTest = await calculatePrizePool(new Date())
  } catch (err: any) {
    poolError = err.message
  }

  let scoresList: any[] = []
  let scoreError = null
  if (user) {
    try {
      scoresList = await getUserScores(supabase as any, user.id)
    } catch (err: any) {
      scoreError = err.message
    }
  }

  return (
    <div className="p-12 max-w-4xl mx-auto space-y-8 text-black dark:text-white">
      <h1 className="text-3xl font-bold border-b pb-4">Backend Diagnostics</h1>

      <section className="bg-zinc-100 dark:bg-zinc-900 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">1. Supabase Connection</h2>
        {user ? (
          <p className="text-green-600 font-mono">✅ Connected! Logged in as: {user.email}</p>
        ) : (
          <p className="text-yellow-600 font-mono">⚠️ Anonymous connection successful (Not logged in).</p>
        )}
      </section>

      <section className="bg-zinc-100 dark:bg-zinc-900 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">2. API & Routing Connectivity (Client-Side)</h2>
        <ApiTester />
        <p className="text-sm text-zinc-500 mt-2">This tests the API routes from your browser to verify routing manifest integrity.</p>
      </section>

      <section className="bg-zinc-100 dark:bg-zinc-900 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">3. Prize Pool Engine Test</h2>
        {poolError ? (
          <p className="text-red-500 font-mono">❌ Error: {poolError}</p>
        ) : (
          <pre className="text-sm bg-black text-green-400 p-4 rounded overflow-auto">
            {JSON.stringify(prizePoolTest, null, 2)}
          </pre>
        )}
        <p className="text-sm text-zinc-500 mt-2">This verifies `calculatePrizePool()` can query active subscribers and run the math.</p>
      </section>

      <section className="bg-zinc-100 dark:bg-zinc-900 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">4. Score Queries Test (Server-Side)</h2>
        {!user ? (
          <p className="text-yellow-600 font-mono">⚠️ Log in first to see score querying.</p>
        ) : scoreError ? (
          <p className="text-red-500 font-mono">❌ Error: {scoreError}</p>
        ) : (
          <pre className="text-sm bg-black text-green-400 p-4 rounded overflow-auto">
            {scoresList.length} scores currently on record.
            {'\n'}
            {JSON.stringify(scoresList, null, 2)}
          </pre>
        )}
        <p className="text-sm text-zinc-500 mt-2">This verifies `getUserScores()` interacts seamlessly with your new DB schema.</p>
      </section>
      
      <p className="text-center text-sm font-semibold text-zinc-400">Refresh the page to re-run server diagnostics.</p>
    </div>
  )
}