import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";

const Onboarding = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const navigateUser = (currRole) => {
    navigate(currRole === "recruiter" ? "/post-job" : "/jobs");
  };

  const handleRoleSelection = async (role) => {
    await user
      .update({ unsafeMetadata: { role } })
      .then(() => {
        console.log(`Role updated to: ${role}`);
        navigateUser(role);
      })
      .catch((err) => {
        console.error("Error updating role:", err);
      });
  };

  useEffect(() => {
    if (user?.unsafeMetadata?.role) {
      navigateUser(user.unsafeMetadata.role);
    }
  }, [user]);

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="flex flex-col items-center justify-center mt-40">
      <h2 className="gradient-title font-extrabold text-7xl sm:text-8xl tracking-tighter">
        I am a...
      </h2>
      <div className="mt-16 grid grid-cols-2 gap-4 w-full md:px-40">
      <Button
  variant="blue"
  className="h-36 text-2xl border-2 border-blue-500 rounded-lg text-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-300 hover:border-blue-600 hover:bg-blue-100 hover:text-blue-800"
  onClick={() => handleRoleSelection("candidate")}
>
  Candidate
</Button>

<Button
  variant="destructive"
  className="h-36 text-2xl border-2 border-red-500 rounded-lg text-red-500 focus:outline-none focus:ring-4 focus:ring-red-300 hover:border-red-600 hover:bg-red-100 hover:text-red-800"
  onClick={() => handleRoleSelection("recruiter")}
>
  Recruiter
</Button>

      </div>
    </div>
  );
};

export default Onboarding;