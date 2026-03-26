"use client";

import { useState, useEffect } from "react";

export default function QueuePage() {
  // Mock data state for the hackathon demo
  const [queuePosition, setQueuePosition] = useState(4);
  const [estimatedWait, setEstimatedWait] = useState(20);
  const totalQueueLength = 6; // To calculate the progress bar

  // Simulate the queue moving forward every 5 seconds for the demo
  useEffect(() => {
    if (queuePosition <= 1) return;

    const timer = setInterval(() => {
      setQueuePosition((prev) => prev - 1);
      setEstimatedWait((prev) => Math.max(0, prev - 5));
    }, 5000); // Updates every 5 seconds

    return () => clearInterval(timer);
  }, [queuePosition]);

  // Calculate progress percentage
  const progressPercentage =
    ((totalQueueLength - queuePosition) / (totalQueueLength - 1)) * 100;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center transition-colors duration-300">
      <div className="max-w-md w-full space-y-6 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden transition-colors duration-300">
        {/* 🌍 THE KILLER FEATURE: Offline/Low Network Mode Banner */}
        <div className="bg-red-50 dark:bg-red-900/30 border-b border-red-100 dark:border-red-800/50 absolute top-0 left-0 w-full px-4 py-2 flex items-center justify-center space-x-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <p className="text-xs font-medium text-red-700 dark:text-red-400">
            Low network detected. Queue updates syncing offline.
          </p>
        </div>

        {/* Header Section (Pushed down slightly to account for the banner) */}
        <div className="text-center pt-6">
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Live Queue Status
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Auto-refreshing every 5 seconds
          </p>
        </div>

        {/* Appointment Details Card */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border border-blue-100 dark:border-blue-800/50 transition-colors duration-300">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider">
                Doctor
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                Dr. Sharma
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider">
                Time
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                11:30 AM
              </p>
            </div>
          </div>

          <hr className="border-blue-200 dark:border-blue-800/50 my-4" />

          {/* Core Queue Metric */}
          <div className="text-center py-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Your Position
            </p>
            <div className="flex justify-center items-baseline space-x-1">
              <span className="text-5xl font-extrabold text-blue-600 dark:text-blue-400">
                #{queuePosition}
              </span>
            </div>
            {queuePosition === 1 && (
              <p className="mt-2 text-sm font-bold text-green-600 dark:text-green-400 animate-pulse">
                You are next! Please head to the cabin.
              </p>
            )}
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div>
          <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            <span>Joined Queue</span>
            <span>Your Turn</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full transition-all duration-1000 ease-in-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Wait Time & WhatsApp Reminder */}
        <div className="text-center space-y-3">
          <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
            Estimated Wait:{" "}
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {estimatedWait} mins
            </span>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-100 dark:border-gray-600 transition-colors duration-300">
            📱 We will send a WhatsApp message when you are 2 patients away. You
            can safely close this page.
          </p>
        </div>
      </div>
    </div>
  );
}
