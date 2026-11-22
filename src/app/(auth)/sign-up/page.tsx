'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthForm } from '@/app/(auth)/auth-form';
import { AuthShell } from '@/app/(auth)/auth-shell';
import { useToast } from '@/components/toast-provider';
import { authClient } from '@/lib/auth-client';

async function imageFileToDataUrl(file: File) {
  const bitmap = await createImageBitmap(file);
  const maxDimension = 256;
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Could not process the selected image.');
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const imageBlob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.82));
  if (!imageBlob) throw new Error('Could not process the selected image.');
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('Could not read the selected image.'));
    reader.onerror = () => reject(new Error('Could not read the selected image.'));
    reader.readAsDataURL(imageBlob);
  });
}

/** Handles account creation and composes the shared authentication UI. */
export default function SignUpPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError('');
    const form = new FormData(event.currentTarget);
    try {
      const selectedFile = form.get('profileImage');
      const imageUrl = String(form.get('imageUrl') ?? '').trim();
      let image: string | undefined;
      if (selectedFile instanceof File && selectedFile.size > 0) {
        if (!selectedFile.type.startsWith('image/')) throw new Error('Please choose an image file.');
        if (selectedFile.size > 8 * 1024 * 1024) throw new Error('Please choose an image smaller than 8 MB.');
        image = await imageFileToDataUrl(selectedFile);
      } else if (imageUrl) {
        image = imageUrl;
      }
      const { error: signUpError } = await authClient.signUp.email({
        name: String(form.get('name') ?? '').trim(),
        email: String(form.get('email') ?? '').trim(),
        password: String(form.get('password') ?? ''),
        signupRole: form.get('role') === 'recruiter' ? 'recruiter' : 'seeker',
        ...(image ? { image } : {}),
        callbackURL: '/',
      });
      if (signUpError) {
        const message = signUpError.message ?? 'Signup failed. Please try again.';
        setError(message);
        toast(message, 'error');
      } else {
        toast('Account created successfully.', 'success');
        router.replace('/');
        router.refresh();
      }
    } catch (signupError) {
      const message = signupError instanceof Error ? signupError.message : "Couldn't connect. Please try again.";
      setError(message);
      toast(message, 'error');
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthShell
      sideEyebrow="Your next chapter"
      sideTitle="Make room for what's next."
      sideDescription="Create your profile and find opportunities that fit the way you want to grow."
      eyebrow="Get started"
      title="Create your account"
      description="Start your search for a better fit."
      footer={
        <>
          <p className="mt-7 text-center text-sm text-zinc-400">
            Already have an account?{' '}
            <Link href="/sign-in" className="font-medium text-violet-300 hover:text-violet-200">
              Sign in
            </Link>
          </p>
          <p className="mt-5 text-center text-[11px] leading-5 text-zinc-600">
            By creating an account, you agree to Hireloop&apos;s terms and privacy policy.
          </p>
        </>
      }
    >
      <AuthForm
        mode="sign-up"
        pending={pending}
        error={error}
        passwordVisible={passwordVisible}
        onPasswordVisibilityChange={() => setPasswordVisible((value) => !value)}
        onSubmit={handleSubmit}
      />
    </AuthShell>
  );
}
