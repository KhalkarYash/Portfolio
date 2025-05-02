'use client'
import { Component } from 'react'
import { trackEvent } from '@/utils/analytics'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    })

    // Track the error
    trackEvent('error_boundary_catch', {
      error: error.toString(),
      componentStack: errorInfo.componentStack,
      type: 'runtime_error'
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div 
          role="alert"
          className="min-h-screen flex items-center justify-center bg-dark p-4"
        >
          <div className="max-w-md w-full bg-gray-900 rounded-lg shadow-xl p-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-400 mb-6">
              We apologize for the inconvenience. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 
                rounded-full hover:opacity-90 transition-opacity focus:outline-none 
                focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Refresh Page
            </button>
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-6 text-left">
                <details className="text-red-400">
                  <summary className="cursor-pointer">Error Details</summary>
                  <pre className="mt-2 text-sm overflow-auto p-2 bg-gray-800 rounded">
                    {this.state.error && this.state.error.toString()}
                    <br />
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              </div>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}