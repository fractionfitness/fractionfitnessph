'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { cn } from '@/lib/utils';
import { Icons } from '@/components/Icons';

import { Button } from '@/components/ui-shadcn/Button';
import {
  // useFormField,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui-shadcn/Form';
import { Input } from '@/components/ui-shadcn/Input';
import { Label } from '@/components/ui-shadcn/Label';

import {
  createUserProfileMember,
  createUserProfileMemberCheckin,
} from '@/actions/user';

const formSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1, { message: 'First Name must not be empty.' }),
  middle_name: z.string().trim().optional(),
  last_name: z
    .string()
    .trim()
    .min(1, { message: 'Family Name must not be empty.' }),
  suffix_name: z.string().trim().optional(),

  // email can be '' or a valid email and cannot be undefined
  // .optional allows email to be undefined but .or(z.literal('')) forces it to be an empty string
  // reference: https://github.com/colinhacks/zod/issues/310
  email: z.string().trim().email().optional().or(z.literal('')),

  password: z
    .string()
    .trim()
    .min(8, { message: 'Password must be at least 8 characters.' })
    .optional()
    .or(z.literal('')),
  // session_group_id: z.number(),
  session_id: z.number().optional(),
  group_id: z.number().optional(),

  // nullish will cause error since Input comp expects undefined or string, and not null
  // middle_name: z.string().nullish(),
  // suffix_name: z.string().nullish(),
});

export default function NewAccountForm({
  selectedSessionOrGroup,
  formSubmitBtnLabel,
  selectLabel,
  SelectSessionsOrGroups,
}) {
  // error if we don't provide a defaultValue of '' even if we allow optional values for some UserProfile model field
  // Solution, assume empty strings are null/undefined values and remove from the payload of the final db write
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // default values are only set on first render
    defaultValues: {
      first_name: '',
      middle_name: '',
      last_name: '',
      suffix_name: '',
      email: '',
      password: '',
      // default for session_id and group_id (because they are integers) should be undefined or null or zero (not recommended since its possible to have an id of 0)
      session_id: undefined,
      group_id: undefined,
    },
  });
  const [isPending, startTransition] = useTransition();

  const handleNewAccount = (formValues: z.infer<typeof formSchema>) => {
    const { session_id } = formValues;
    const data = {
      ...formValues,
      // if selectedSessionOrGroup has a group_id, then it is a session record so use the id, otherwise, use undefined
      session_id: selectedSessionOrGroup?.group_id
        ? selectedSessionOrGroup?.id
        : undefined,
      // if selectedSessionOrGroup has a group_id, then it is a session record so use group_id, otherwise, it is a group record so use its id
      group_id: selectedSessionOrGroup?.group_id ?? selectedSessionOrGroup.id,
    };
    if (session_id) {
      // console.log('Sign Up & Check In form values:', data);
      startTransition(() => createUserProfileMemberCheckin(data));
    } else {
      // console.log('Sign Up w/o Check In form values:', data);
      startTransition(() => createUserProfileMember(data));
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleNewAccount)}
        // left align Label
        // className={cn('flex flex-col')}
        className={cn('w-[21rem]')}
      >
        {/* <div className="mt-2 space-y-2 flex flex-col text-left"> */}
        <div className="">
          <Label className="">Required Details:</Label>
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="First Name" {...field} />
                  {/* this interferes with the error message */}
                </FormControl>
                {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="middle_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Middle Name</FormLabel>
                <FormControl>
                  <Input placeholder="Middle Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Family Name</FormLabel>
                <FormControl>
                  <Input placeholder="Family Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="suffix_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Suffix Name</FormLabel>
                <FormControl>
                  <Input placeholder="Suffix Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="">
          <Label className="">Optional Details:</Label>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mt-4">
          <Label>{selectLabel}</Label>
          <SelectSessionsOrGroups />
        </div>
        <Button
          size="sm"
          disabled={!selectedSessionOrGroup}
          className="mt-4 bg-foreground text-background"
          type="submit"
          onClick={() => console.log('button click')}
        >
          {isPending && <Icons.loader className="mr-2 animate-spin-slow" />}
          {formSubmitBtnLabel}
        </Button>
      </form>
    </Form>
  );
}
