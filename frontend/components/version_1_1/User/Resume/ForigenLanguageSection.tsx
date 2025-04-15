type Props = {}

const ForeignLanguageSection = (props: Props) => {
  // Language proficiency data
  const languages = [
    { name: "English", proficiency: 100, code: "EN" },
    { name: "Spanish", proficiency: 80, code: "ES" },
    { name: "French", proficiency: 70, code: "FR" },
    { name: "German", proficiency: 50, code: "DE" },
    { name: "Japanese", proficiency: 50, code: "JP" },
  ]

  return (
    <div className="w-full min-h-48 bg-gray-950 rounded-3xl p-8">
      <h2 className="text-2xl font-bold text-white mb-8 text-center">زبان هایی که بلدم</h2>

      <div className="flex flex-wrap justify-center gap-8">
        {languages.map((language, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="relative w-24 h-24 mb-2">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#333" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#8b5cf6"
                  strokeWidth="8"
                  strokeDasharray={`${(2 * Math.PI * 40 * language.proficiency) / 100} ${2 * Math.PI * 40 * (1 - language.proficiency / 100)}`}
                  strokeDashoffset={2 * Math.PI * 40 * 0.25}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              {/* Language code in center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-xl font-medium">{language.code}</span>
              </div>
            </div>
            <div className="text-violet-500  text-xl font-bold">{language.proficiency}%</div>
            <div className="text-gray-400  text-sm">{language.name}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ForeignLanguageSection
