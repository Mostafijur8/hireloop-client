'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function ApplyButton({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  async function apply() {
    setSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId }),
      });
      const data = (await response.json()) as { error?: string; paymentRequired?: boolean; redirectTo?: string };

      if (response.status === 401) {
        router.push(`/sign-in?callbackUrl=${encodeURIComponent(`/brows-jobs/${jobId}`)}`);
        return;
      }
      if (response.status === 402 && data.paymentRequired) {
        router.push(data.redirectTo || '/payment');
        return;
      }
      if (!response.ok) throw new Error(data.error ?? 'Could not submit your application.');

      setMessage('Application submitted.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not submit your application.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full sm:w-auto">
      <button
        type="button"
        onClick={apply}
        disabled={submitting || message === 'Application submitted.'}
        className="w-full rounded-lg bg-white px-5 py-2.5 text-center text-sm font-semibold text-zinc-900 transition hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {submitting ? 'Applying…' : message === 'Application submitted.' ? 'Applied' : 'Apply Now'}
      </button>
      {message && <p role="status" className="mt-2 text-xs text-zinc-300">{message}</p>}
    </div>
  );
}
