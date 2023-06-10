// import {withAuth} from 'next-auth/middleware'
// export default withAuth;

// shortcut to the above code
export { default } from 'next-auth/middleware';

export const config = {
  // matcher: ['/profile'],

  // require signin if route does not match routes containing (register|api|login)
  // matcher: ["/((?!register|api|login).*)"],

  // require signin if route matches the following
  // matcher: ['/dashboard/user'],
  matcher: ['/dashboard/:path*'],
};

// how to chain middleware???
