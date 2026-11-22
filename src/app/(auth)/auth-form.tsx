import type { FormEvent } from 'react';
import { ArrowRight, Eye, EyeOff, LoaderCircle } from 'lucide-react';

type AuthFormProps = {
  mode: 'sign-in' | 'sign-up';
  pending: boolean;
  error: string;
  passwordVisible: boolean;
  onPasswordVisibilityChange: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

/** Shared credential fields, feedback, and submit button for auth pages. */
export function AuthForm({
  mode,
  pending,
  error,
  passwordVisible,
  onPasswordVisibilityChange,
  onSubmit,
}: AuthFormProps) {
  const isSignUp = mode === 'sign-up';
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      {isSignUp && (
        <label className="block space-y-2 text-sm font-medium text-zinc-200">
          Full name
          <input
            autoComplete="name"
            name="name"
            required
            placeholder="Your name"
            className={inputClass}
          />
        </label>
      )}
      {isSignUp && (
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-zinc-200">I’m signing up as</legend>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'seeker', label: 'Job seeker', description: 'Find your next opportunity' },
              { value: 'recruiter', label: 'Recruiter', description: 'Hire great people' },
            ].map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm transition has-[:checked]:border-violet-400/70 has-[:checked]:bg-violet-500/10"
              >
                <input
                  className="mt-1 accent-violet-400"
                  type="radio"
                  name="role"
                  value={option.value}
                  defaultChecked={option.value === 'seeker'}
                />
                <span>
                  <span className="block font-medium text-zinc-100">{option.label}</span>
                  <span className="mt-0.5 block text-xs font-normal text-zinc-500">{option.description}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}
      <label className="block space-y-2 text-sm font-medium text-zinc-200">
        Email address
        <input
          autoComplete="email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className={inputClass}
        />
      </label>
      <label className="block space-y-2 text-sm font-medium text-zinc-200">
        Password
        <span className="relative block">
          <input
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
            name="password"
            type={passwordVisible ? 'text' : 'password'}
            minLength={8}
            required
            placeholder={isSignUp ? 'At least 8 characters' : 'Enter your password'}
            className={`${inputClass} pr-12`}
          />
          <button
            type="button"
            aria-label={passwordVisible ? 'Hide password' : 'Show password'}
            aria-pressed={passwordVisible}
            onClick={onPasswordVisibilityChange}
            className="absolute right-1.5 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-lg text-zinc-500 transition-colors hover:bg-white/5 hover:text-white"
          >
            {passwordVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </span>
      </label>
      {error && (
        <p
          role="alert"
          className="rounded-lg border border-red-500/20 bg-red-500/[0.07] px-3 py-2 text-sm text-red-300"
        >
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#6955f5] text-sm font-medium text-white shadow-[0_4px_20px_rgba(105,85,245,0.2)] hover:bg-[#7968ff] disabled:pointer-events-none disabled:opacity-50"
      >
        {pending ? (
          <>
            <LoaderCircle className="size-4 animate-spin" />
            Please wait...
          </>
        ) : (
          <>
            {isSignUp ? 'Create account' : 'Sign in'}
            <ArrowRight className="size-4" />
          </>
        )}
      </button>
    </form>
  );
}

const inputClass =
  'h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/15';
