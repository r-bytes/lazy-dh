import { UserSignInForm } from "@/components/ui/sign-in/user-sign-in-form";

type Props = {};

const page = (props: Props) => {
  return (
    <div className="max-w-7xl flex flex-col justify-center items-center mx-auto">
      <h1 className="my-10 text-2xl font-bold"> Log in met uw nieuwe wachtwoord </h1>
      <UserSignInForm />
    </div>
  );
};

export default page;
