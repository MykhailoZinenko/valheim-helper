import React, { useState } from "react"
import { Code, CopyCheck, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface APIBlockProps {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  endpoint: string
  example: {
    request?: {
      params?: Record<string, any>
      body?: Record<string, any>
      headers?: Record<string, string>
    }
    response: string
  }
}

const SUPPORTED_LANGUAGES = {
  curl: "cURL",
  javascript: "JavaScript",
  python: "Python",
  go: "Go",
  ruby: "Ruby",
} as const

type Language = keyof typeof SUPPORTED_LANGUAGES

const methodBadgeStyles = {
  GET: "bg-emerald-500/10 text-emerald-500 ring-emerald-500/20",
  POST: "bg-blue-500/10 text-blue-500 ring-blue-500/20",
  PUT: "bg-amber-500/10 text-amber-500 ring-amber-500/20",
  DELETE: "bg-red-500/10 text-red-500 ring-red-500/20",
  PATCH: "bg-violet-500/10 text-violet-500 ring-violet-500/20",
}

const generateCode = (
  language: Language,
  method: APIBlockProps["method"],
  endpoint: string,
  example: APIBlockProps["example"]
): string => {
  const baseUrl = "https://valheim-helper-server.onrender.com/api"
  const fullUrl = `${baseUrl}${endpoint}`

  switch (language) {
    case "curl": {
      let curlCmd = `curl -X ${method} "${fullUrl}"`
      if (example.request?.headers) {
        Object.entries(example.request.headers).forEach(([key, value]) => {
          curlCmd += ` \\\n  -H "${key}: ${value}"`
        })
      }
      if (example.request?.body) {
        curlCmd += ` \\\n  -d '${JSON.stringify(example.request.body)}'`
      }
      return curlCmd
    }

    case "javascript": {
      let jsCode = `const response = await fetch("${fullUrl}", {
  method: "${method}",`
      if (example.request?.headers) {
        jsCode += `\n  headers: ${JSON.stringify(example.request.headers, null, 2)},`
      }
      if (example.request?.body) {
        jsCode += `\n  body: JSON.stringify(${JSON.stringify(example.request.body, null, 2)}),`
      }
      jsCode += `\n});

const data = await response.json();`
      return jsCode
    }

    case "python": {
      let pyCode = `import requests

response = requests.${method.toLowerCase()}(
    "${fullUrl}"`
      if (example.request?.headers) {
        pyCode += `,\n    headers=${JSON.stringify(example.request.headers, null, 4)}`
      }
      if (example.request?.body) {
        pyCode += `,\n    json=${JSON.stringify(example.request.body, null, 4)}`
      }
      pyCode += `\n)

data = response.json()`
      return pyCode
    }

    case "go": {
      let goCode = `package main

import (
    "fmt"
    "io/ioutil"
    "net/http"
    ${example.request?.body ? `"bytes"\n    "encoding/json"` : ""}
)

func main() {`
      if (example.request?.body) {
        goCode += `
    payload, _ := json.Marshal(${JSON.stringify(example.request.body, null, 4)})`
      }
      goCode += `
    req, err := http.NewRequest("${method}", "${fullUrl}", ${example.request?.body ? "bytes.NewBuffer(payload)" : "nil"})
    if err != nil {
        panic(err)
    }`
      if (example.request?.headers) {
        Object.entries(example.request.headers).forEach(([key, value]) => {
          goCode += `\n    req.Header.Set("${key}", "${value}")`
        })
      }
      goCode += `

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()

    body, _ := ioutil.ReadAll(resp.Body)
    fmt.Println(string(body))
}`
      return goCode
    }

    case "ruby": {
      let rubyCode = `require 'net/http'
require 'json'

uri = URI('${fullUrl}')
http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = true

request = Net::HTTP::${method.charAt(0) + method.slice(1).toLowerCase()}.new(uri)`
      if (example.request?.headers) {
        Object.entries(example.request.headers).forEach(([key, value]) => {
          rubyCode += `\nrequest["${key}"] = "${value}"`
        })
      }
      if (example.request?.body) {
        rubyCode += `\nrequest.body = ${JSON.stringify(example.request.body)}`
      }
      rubyCode += `

response = http.request(request)
data = JSON.parse(response.body)`
      return rubyCode
    }

    default:
      return "Language not supported"
  }
}

const APIBlock: React.FC<APIBlockProps> = ({ method, endpoint, example }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("curl")
  const [copiedStates, setCopiedStates] = useState({
    endpoint: false,
    request: false,
    response: false,
  })

  const handleCopy = (text: string, key: keyof typeof copiedStates) => {
    navigator.clipboard.writeText(text)
    setCopiedStates((prev) => ({
      ...prev,
      [key]: true,
    }))
    setTimeout(
      () =>
        setCopiedStates((prev) => ({
          ...prev,
          [key]: false,
        })),
      2000
    )
  }

  const generatedCode = example.request
    ? generateCode(selectedLanguage, method, endpoint, example)
    : null

  return (
    <div className="w-full rounded-xl border border-accent/10 bg-color-primary-bg/30 backdrop-blur-sm transition-all duration-300 hover:border-accent/20">
      {/* Header with endpoint info */}
      <div className="flex items-center gap-2 p-3 sm:gap-3 sm:p-4 border-b border-accent/10">
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold ring-1 ${methodBadgeStyles[method]}`}
        >
          {method}
        </span>
        <code className="font-mono text-xs sm:text-sm truncate overflow-hidden whitespace-nowrap">
          {endpoint}
        </code>
        <button
          onClick={() => handleCopy(`${method} ${endpoint}`, "endpoint")}
          className="ml-auto p-1 sm:p-1.5 hover:bg-accent/10 rounded-md transition-colors"
        >
          {copiedStates.endpoint ? (
            <CopyCheck className="w-3 h-3 sm:w-4 sm:h-4 text-accent" />
          ) : (
            <Copy className="w-3 h-3 sm:w-4 sm:h-4 text-accent/60" />
          )}
        </button>
      </div>

      {/* Code examples */}
      <div className="grid divide-y divide-accent/10">
        {/* Request (if provided) */}
        {example.request && (
          <div className="p-3 sm:p-4 overflow-x-auto">
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-medium text-color-text-secondary">
                  Request
                </span>
                <Select
                  value={selectedLanguage}
                  onValueChange={(value) =>
                    setSelectedLanguage(value as Language)
                  }
                >
                  <SelectTrigger className="h-7 w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SUPPORTED_LANGUAGES).map(
                      ([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
              <button
                onClick={() => handleCopy(generatedCode!, "request")}
                className="p-1 sm:p-1.5 hover:bg-accent/10 rounded-md transition-colors"
              >
                {copiedStates.request ? (
                  <CopyCheck className="w-3 h-3 sm:w-4 sm:h-4 text-accent" />
                ) : (
                  <Copy className="w-3 h-3 sm:w-4 sm:h-4 text-accent/60" />
                )}
              </button>
            </div>
            <pre className="font-mono text-xs sm:text-sm overflow-x-auto p-2 sm:p-3 rounded-lg bg-color-primary-bg/50">
              <code>{generatedCode}</code>
            </pre>
          </div>
        )}

        {/* Response */}
        <div className="p-3 sm:p-4 overflow-x-auto">
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <span className="text-xs sm:text-sm font-medium text-color-text-secondary">
              Response
            </span>
            <button
              onClick={() => handleCopy(example.response, "response")}
              className="p-1 sm:p-1.5 hover:bg-accent/10 rounded-md transition-colors"
            >
              {copiedStates.response ? (
                <CopyCheck className="w-3 h-3 sm:w-4 sm:h-4 text-accent" />
              ) : (
                <Copy className="w-3 h-3 sm:w-4 sm:h-4 text-accent/60" />
              )}
            </button>
          </div>
          <pre className="font-mono text-xs sm:text-sm overflow-x-auto p-2 sm:p-3 rounded-lg bg-color-primary-bg/50">
            <code>{example.response}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}

export default APIBlock
