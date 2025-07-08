import { useState, useEffect, useContext } from "react";

import { interactionsAPI } from "../api";

import Searchbar from "../components/Searchbar";
import JobTile from "../components/JobTile";

import type JobSummary from "../models/Job";
import { UserContext } from "../utils/contexts";

export default function HomePage() {
  const { user } = useContext(UserContext);
  const [appliedJobs, setAppliedJobs] = useState<JobSummary[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [loadMoreButtonDisabled, setLoadMoreButtonDisabled] = useState(false);
  const [hasMoreAppliedJobs, setHasMoreAppliedJobs] = useState(true);
  const [emptyListMessage, setEmptyListMessage] = useState("Loading...");

  useEffect(() => {
    if (!user) return;
    const fetchPreviousJobs = async () => {
      try {
        const appliedJobs = await interactionsAPI.getAppliedJobs(
          pageNumber,
          20
        );
        if (appliedJobs.success && appliedJobs.data) {
          setAppliedJobs(appliedJobs.data.appliedJobs || []);
          if (
            !appliedJobs.data.appliedJobs ||
            appliedJobs.data.appliedJobs.length === 0
          ) {
            setEmptyListMessage("You haven't applied to any jobs yet.");
          }
        } else {
          setAppliedJobs([]);
          setEmptyListMessage(
            appliedJobs.error?.content.error ||
              "Something went wrong while fetching your applied jobs. Please try again later."
          );
        }
      } catch (error) {
        console.error("Failed to fetch previous jobs:", error);
        setAppliedJobs([]);
        setEmptyListMessage(
          "Something went wrong while fetching your applied jobs. Please try again later."
        );
      }
    };
    fetchPreviousJobs();
  }, [user]);

  const handleLoadMore = async () => {
    try {
      setLoadMoreButtonDisabled(true);
      const nextPage = pageNumber + 1;
      const appliedJobs = await interactionsAPI.getAppliedJobs(nextPage, 20);
      if (appliedJobs.success && appliedJobs.data) {
        const jobsToAdd = appliedJobs.data.appliedJobs;
        if (!jobsToAdd || jobsToAdd.length === 0) {
          setHasMoreAppliedJobs(false);
          return;
        }
        setAppliedJobs((prevJobs) => [...prevJobs, ...jobsToAdd]);
        setPageNumber(nextPage);
      } else {
        console.error("Failed to load more jobs:", appliedJobs.error);
      }
    } catch (error) {
      console.error("Error loading more jobs:", error);
    } finally {
      setLoadMoreButtonDisabled(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col max-w-6xl mx-auto px-6 py-8 items-center">
        {/* Welcome Header */}
        <div className="flex flex-row text-green-900 text-5xl font-bold justify-center items-center mt-16 mb-12">
          <h1 className="text-center leading-tight">
            Welcome back, {user?.name}!
          </h1>
        </div>

        {/* Search Section */}
        <div className="flex flex-row justify-center items-center mb-16 w-full max-w-2xl">
          <div className="w-full border-2 border-gray-200 rounded-xl p-6">
            <Searchbar />
          </div>
        </div>

        {/* Applied Jobs Section */}
        <div className="flex flex-col w-full max-w-4xl">
          <div className="flex flex-row mb-6 text-2xl text-green-800 font-semibold">
            <h2>Jobs You've Applied To</h2>
          </div>

          {/* Scrollable Jobs Container */}
          <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
            {appliedJobs.length === 0 ? (
              <div className="p-8 text-center text-green-800">
                {emptyListMessage}
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                <ul>
                  {appliedJobs.map((job) => {
                    return (
                      <li
                        key={job.jobId}
                        className="px-4 py-2 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <JobTile {...job} />
                      </li>
                    );
                  })}
                </ul>
                {hasMoreAppliedJobs && (
                  <div className="p-4 flex justify-center border-t border-gray-200 bg-gray-50">
                    <button
                      onClick={handleLoadMore}
                      disabled={loadMoreButtonDisabled}
                      className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      {loadMoreButtonDisabled ? "Loading..." : "Load more"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}