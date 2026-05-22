"use client";

import { authenticate, adminPreCheck } from "@/lib/actions/auth";
import { Lock, Mail, AlertCircle, Wind, KeyRound, Loader2 } from "lucide-react";
import { useState, useTransition, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/common/Button";
import DynamicLogo from "@/components/layout/DynamicLogo";
import { cn } from "@/lib/utils";
import { Input } from "@/components/common/Input";

export default function LoginForm() {
  const [step, setStep] = useState<'credentials' | 'mfa'>('credentials');
  const [formData, setFormData] = useState({ email: '', password: '', mfaCode: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePreCheck = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    startTransition(async () => {
      try {
        const data = await adminPreCheck({ email: formData.email, password: formData.password });
        if (data.isValid) {
          setStep('mfa');
        } else {
          setErrorMessage('Invalid credentials.');
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Something went wrong.');
      }
    });
  };

  const executeFinalSignIn = (code: string) => {
    if (code.length !== 6) {
      setErrorMessage("MFA Code must be 6 digits.");
      return;
    }
    setErrorMessage('');

    startTransition(async () => {
      try {
        const form = new FormData();
        form.append('email', formData.email);
        form.append('password', formData.password);
        form.append('mfaCode', code);

        const result = await authenticate(undefined, form);
        if (result) {
          setErrorMessage(result);
          setFormData(prev => ({ ...prev, mfaCode: '' }));
        }
      } catch (err: any) {
        if (err.message === "NEXT_REDIRECT") {
          throw err;
        }
        setErrorMessage('Invalid MFA code or credentials.');
      }
    });
  };

  return (
    <div className="flex items-center justify-center p-6 py-12 rounded-4xl font-josefin">
      <div className="w-full max-w-md">
        <div className="mb-16 text-center flex flex-col items-center justify-center scale-125">
          <DynamicLogo className="text-custom-blue dark:text-custom-celadon h-auto"/>
        </div>

        <form
          onSubmit={step === 'credentials' ? handlePreCheck : (e) => { e.preventDefault(); if (formData.mfaCode.length === 6) executeFinalSignIn(formData.mfaCode); }}
          className="bg-custom-coconut/40 dark:bg-custom-blue border border-custom-blue/5 dark:border-custom-celadon/5 rounded-4xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl transition-all space-y-8"
        >
          {step === 'credentials' ? (
            <div className="space-y-6">
              <Input
                id="email"
                name="email"
                type="email"
                label="Email Address"
                value={formData.email}
                onChange={(val) => setFormData(prev => ({ ...prev, email: val }))}
                placeholder="admin@angkorfloat.com"
                required
                autoComplete="new-password"
                spellCheck="false"
                leftIcon={<Mail className="h-5 w-5" />}
              />

              <Input
                id="password"
                name="password"
                type="password"
                label="Password"
                value={formData.password}
                onChange={(val) => setFormData(prev => ({ ...prev, password: val }))}
                placeholder="••••••••"
                required
                autoComplete="new-password"
                spellCheck="false"
                leftIcon={<Lock className="h-5 w-5" />}
              />
            </div>
          ) : (
            <div className="space-y-6">
              <Input
                id="mfaCode"
                name="mfaCode"
                type="text"
                maxLength={6}
                label="2FA Authenticator Code"
                labelClassName="justify-center mr-1"
                value={formData.mfaCode}
                onChange={(val) => {
                  const cleanVal = val.replace(/\D/g, '');
                  setFormData(prev => ({ ...prev, mfaCode: cleanVal }));
                  if (cleanVal.length === 6) {
                    executeFinalSignIn(cleanVal);
                  }
                }}
                placeholder="000000"
                required
                autoComplete="one-time-code"
                autoFocus
                leftIcon={<KeyRound className="h-5 w-5" />}
                className="text-center tracking-[0.5em] placeholder:tracking-normal"
              />
            </div>
          )}

          <div className="pt-2">
            {step === 'credentials' && (
              <Button
                type="submit"
                variant="secondary"
                fullWidth
                size="lg"
                roundness="xl"
                isLoading={isPending}
              >
                Continue
              </Button>
            )}

            {step === 'mfa' && (
              <Button
                type="button"
                variant="celadon"
                onClick={() => setStep('credentials')}
                fullWidth
                size="lg"
                roundness="xl"
              >
                Back
              </Button>
            )}
          </div>

          {errorMessage && (
            <div className="flex items-center gap-3 p-5 bg-custom-rosewood/10 border border-custom-rosewood/20 rounded-2xl text-custom-rosewood text-sm font-bold">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p>{errorMessage}</p>
            </div>
          )}
        </form>
      </div>

      {isPending && step === 'mfa' && mounted && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-custom-coconut/80 dark:bg-custom-blue/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
            <Loader2 className="h-12 w-12 text-custom-blue dark:text-custom-celadon animate-spin" />
            <p className="font-josefin font-bold text-custom-blue dark:text-custom-celadon tracking-widest uppercase text-sm">Authenticating</p>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
