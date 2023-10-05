'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
// import { signIn } from 'next-auth/react';
import Link from 'next/link';

import Card from './ui/Card';
import Input from './ui/Input';
import Button from './ui/Button';
import { register } from '@/lib/apiCalls';

const registerContent = {
  linkUrl: '/api/auth/signin',
  linkText: 'Already have an account?',
  header: 'Create a new account',
  subheader: 'Just a few things to get started.',
  buttonText: 'Register',
};

// not yet being used
const signInContent = {
  linkUrl: '/api/auth/signin',
  linkText: "Don't have an account?",
  header: 'Welcome back!',
  subheader: 'Sign in to get started.',
  buttonText: 'Sign In',
};

export default function AuthForm({ mode }) {
  const router = useRouter();
  const emailInputRef = useRef();
  const pwordInputRef = useRef();
  const confirmPwordInputRef = useRef();

  const content = mode === 'register' ? registerContent : signInContent;

  const formSubmitHandler = async (e) => {
    e.preventDefault();

    const formData = {
      email: emailInputRef.current.value,
      password: pwordInputRef.current.value,
      confirmPassword: confirmPwordInputRef.current.value,
    };

    try {
      if (mode === 'register') {
        const newUser = await register(formData);
        if (!newUser) {
          return;
        }
        router.push('/api/auth/signin');
      }
      // else {
      //   await signin(existingUser);
      //   router.replace('/'); // Back button won't work after signing in
      // }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Card>
      <div className="w-full">
        <div className="text-center">
          <h2 className="text-3xl mb-2">{content.header}</h2>
          <p className="tex-lg text-black/25">{content.subheader}</p>
        </div>
        <form className="py-10 w-full" onSubmit={formSubmitHandler}>
          <Input required placeholder="Enter Email..." ref={emailInputRef} />
          <Input required placeholder="Enter Password..." ref={pwordInputRef} />
          {mode === 'register' && (
            <Input
              // required
              placeholder="Confirm Password..."
              ref={confirmPwordInputRef}
            />
          )}

          <div className="flex items-center justify-between">
            <div>
              <span>
                <Link
                  href={content.linkUrl}
                  className="text-blue-600 font-bold"
                >
                  {content.linkText}
                </Link>
              </span>
            </div>
            <div>
              <Button intent="secondary" type="submit">
                {content.buttonText}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Card>
  );
}
