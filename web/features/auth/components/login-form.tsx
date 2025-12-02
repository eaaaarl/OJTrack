'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import * as z from "zod"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSignInMutation } from "../api/authApi"
import { AlertCircle, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAppDispatch } from "@/lib/redux/hooks"
import { setUser } from "@/lib/redux/state/authSlice"

export const formSchema = z.object({
  email: z.email({ message: 'Invalid email address' }).min(2, { message: "Email must be at least 2 characters" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

export type FormSchema = z.infer<typeof formSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [error, setError] = useState('')
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const dispatch = useAppDispatch()
  const [signIn, { isLoading }] = useSignInMutation()

  const onSubmit = async (payload: FormSchema) => {
    try {
      setError('')
      const res = await signIn(payload).unwrap()
      console.log('res', JSON.stringify(res, null, 2))

      const userType = res.userType === 'admin' ? 'admin' : 'student';

      dispatch(setUser({
        email: res.email,
        id: res.id,
        userType: userType
      }))
    } catch (error) {
      console.log('errors', error)
      setError('An error occurred during login')
      form.reset()
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your OJTrack account
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      aria-invalid={fieldState.invalid}
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      {...field}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Field>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin w-4 h-4 mr-2" />
                      Signing in...
                    </>
                  ) : (
                    'Login'
                  )}
                </Button>
              </Field>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <Image
              width={300}
              height={300}
              src="/images/logo.png"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}