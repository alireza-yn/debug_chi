"use client"

import type React from "react"
import { useState } from "react"
import { Plus } from "lucide-react"

interface JobEntry {
  id: string
  companyName: string
  jobTitle: string
  description: string
  startDate: string
  endDate: string
  responsibilities: string
}

// HeroButton
const HeroButton = ({
  children,
  onClick,
  variant = "primary",
  className = "",
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: "primary" | "outline" | "dashed"
  className?: string
}) => {
  const baseClasses =
    "px-4 py-2 rounded-md font-medium transition-all duration-200 flex items-center justify-center"

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg",
    outline:
      "border-2 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700",
    dashed:
      "border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700",
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

// HeroCard
const HeroCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}
    >
      {children}
    </div>
  )
}

// HeroCardContent
const HeroCardContent = ({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <div className={`p-4 ${className}`}>{children}</div>
}

// HeroDialog
const HeroDialog = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      ></div>
      <div className="relative bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-auto">
        {children}
      </div>
    </div>
  )
}

// HeroDialogHeader
const HeroDialogHeader = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{children}</h2>
    </div>
  )
}

// HeroDialogFooter
const HeroDialogFooter = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-2">
      {children}
    </div>
  )
}

// HeroInput
const HeroInput = ({
  label,
  id,
  name,
  value,
  onChange,
  type = "text",
  as = "input",
}: {
  label: string
  id: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  type?: string
  as?: "input" | "textarea"
}) => {
  const inputClasses =
    "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      {as === "textarea" ? (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className={`${inputClasses} min-h-[100px]`}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          className={inputClasses}
        />
      )}
    </div>
  )
}

// Main Component
const JobHistory = () => {
  const [jobs, setJobs] = useState<JobEntry[]>([
    {
      id: "1",
      companyName: "Acme Corporation",
      jobTitle: "Senior Developer",
      description: "Led development team for web applications",
      startDate: "2020-01",
      endDate: "2023-01",
      responsibilities: "Frontend development, team management, code reviews",
    },
    {
      id: "2",
      companyName: "Tech Innovators",
      jobTitle: "Web Developer",
      description: "Worked on various client projects",
      startDate: "2018-03",
      endDate: "2019-12",
      responsibilities: "JavaScript development, responsive design, API integration",
    },
  ])

  const [newJob, setNewJob] = useState<Omit<JobEntry, "id">>({
    companyName: "",
    jobTitle: "",
    description: "",
    startDate: "",
    endDate: "",
    responsibilities: "",
  })

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewJob((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const addNewJob = () => {
    const jobWithId: JobEntry = {
      ...newJob,
      id: Date.now().toString(),
    }

    setJobs((prev) => [...prev, jobWithId])

    setNewJob({
      companyName: "",
      jobTitle: "",
      description: "",
      startDate: "",
      endDate: "",
      responsibilities: "",
    })

    setIsDialogOpen(false)
  }

  return (
    <div className="p-6 max-w-7xl mx-auto text-gray-800 dark:text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Job History
        </h1>

        <HeroButton onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Job
        </HeroButton>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {jobs.map((job) => (
          <div key={job.id} className="flex flex-col items-center">
            <HeroCard className="w-full mb-2 bg-gradient-to-b from-purple-50 to-white dark:from-purple-900 dark:to-gray-800">
              <HeroCardContent className="text-center">
                <h3 className="font-bold text-lg text-purple-800 dark:text-purple-300">
                  {job.companyName}
                </h3>
              </HeroCardContent>
            </HeroCard>

            <div className="h-4 w-0.5 bg-gradient-to-b from-purple-400 to-indigo-500"></div>

            <HeroCard className="w-full mb-2">
              <HeroCardContent className="text-center">
                <div className="font-medium text-gray-800 dark:text-gray-200">{job.jobTitle}</div>
              </HeroCardContent>
            </HeroCard>

            <div className="h-4 w-0.5 bg-gradient-to-b from-purple-400 to-indigo-500"></div>

            <HeroCard className="w-full mb-2">
              <HeroCardContent className="text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {job.startDate} - {job.endDate}
                </div>
              </HeroCardContent>
            </HeroCard>

            <div className="h-4 w-0.5 bg-gradient-to-b from-purple-400 to-indigo-500"></div>

            <HeroCard className="w-full mb-2">
              <HeroCardContent>
                <div className="text-sm text-gray-700 dark:text-gray-300">{job.description}</div>
              </HeroCardContent>
            </HeroCard>

            <div className="h-4 w-0.5 bg-gradient-to-b from-purple-400 to-indigo-500"></div>

            <HeroCard className="w-full">
              <HeroCardContent>
                <h4 className="text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">
                  Responsibilities:
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{job.responsibilities}</p>
              </HeroCardContent>
            </HeroCard>
          </div>
        ))}
      </div>

      <HeroDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <HeroDialogHeader>Add New Job Experience</HeroDialogHeader>
        <div className="p-4">
          <HeroInput label="Company" id="companyName" name="companyName" value={newJob.companyName} onChange={handleInputChange} />
          <HeroInput label="Job Title" id="jobTitle" name="jobTitle" value={newJob.jobTitle} onChange={handleInputChange} />
          <HeroInput label="Description" id="description" name="description" value={newJob.description} onChange={handleInputChange} as="textarea" />
          <HeroInput label="Start Date" id="startDate" name="startDate" type="month" value={newJob.startDate} onChange={handleInputChange} />
          <HeroInput label="End Date" id="endDate" name="endDate" type="month" value={newJob.endDate} onChange={handleInputChange} />
          <HeroInput label="Responsibilities" id="responsibilities" name="responsibilities" value={newJob.responsibilities} onChange={handleInputChange} as="textarea" />
        </div>
        <HeroDialogFooter>
          <HeroButton variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</HeroButton>
          <HeroButton onClick={addNewJob}>Save</HeroButton>
        </HeroDialogFooter>
      </HeroDialog>
    </div>
  )
}

export default JobHistory
