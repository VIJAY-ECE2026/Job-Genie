import { getSavedJobs } from "@/api/apiJobs";
import JobCard from "@/components/job-card";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";

const SavedJobs = () => {
  const { isLoaded } = useUser();

  const {
    loading: loadingSavedJobs,
    data: savedJobs,
    fn: fnSavedJobs,
  } = useFetch(getSavedJobs);

  useEffect(() => {
    if (isLoaded) {
      fnSavedJobs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  // Function to handle job deletion
  const handleDeleteJob = async (jobId) => {
    try {
      // Call your API to delete the job (use `deleteJob` API call)
      await deleteJob({ job_id: jobId });
      // After deletion, refresh the saved jobs list
      fnSavedJobs();
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  if (!isLoaded || loadingSavedJobs) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  const renderSavedJobs = () => {
    if (!savedJobs || savedJobs.length === 0) {
      return <div className="text-center text-lg">No Saved Jobs 👀</div>;
    }

    return savedJobs.map((saved) => (
      <JobCard
        key={saved.id}
        job={saved?.job}
        onJobAction={() => fnSavedJobs()} // Ensure this triggers a refresh after deletion
        savedInit={true}
        isMyJob={true} // Add this prop to indicate it's the user's own job
        onDeleteJob={() => handleDeleteJob(saved.id)} // Pass the delete handler to JobCard
      />
    ));
  };

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Saved Jobs
      </h1>

      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {renderSavedJobs()}
      </div>
    </div>
  );
};

export default SavedJobs;
