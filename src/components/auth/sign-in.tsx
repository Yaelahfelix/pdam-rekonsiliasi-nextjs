import {
  Auth,
  AuthDescription,
  AuthForm,
  AuthHeader,
  AuthTitle,
} from "./auth-layout"
import { SignInForm } from "./sign-in-form"

export function SignIn() {
  return (
    <Auth
    // imgSrc="/images/illustrations/misc/welcome.svg"
    >
      <AuthHeader>
        <AuthTitle>Sign In</AuthTitle>
        <AuthDescription>
          Masukkan username dan passwordmu untuk masuk ke dashboard
        </AuthDescription>
      </AuthHeader>
      <AuthForm>
        <SignInForm />
      </AuthForm>
    </Auth>
  )
}
