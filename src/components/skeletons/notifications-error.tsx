import { memo } from 'react'

/**
 * NotificationsError renders an error state with a retry action.
 */
const NotificationsError = memo(
  ({
    message = 'Failed to load notifications',
    onRetry,
  }: {
    message?: string
    onRetry?: () => void
  }) => {
    return (
      <div className="min-w-lg">
        <div className="p-8 text-center">
          <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
            <span className="text-xl" role="img" aria-label="error">
              ⚠️
            </span>
          </div>
          <h3 className="text-lg font-medium text-gray-800">{message}</h3>
          <p className="text-sm text-gray-500 mt-1">
            Please check your connection and try again.
          </p>
          <div className="mt-4">
            <button
              type="button"
              onClick={onRetry}
              className="px-4 py-2 rounded-md bg-primary text-white disabled:opacity-50"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  },
)

NotificationsError.displayName = 'NotificationsError'

export default NotificationsError
