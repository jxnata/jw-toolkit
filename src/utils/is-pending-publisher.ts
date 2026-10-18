type PublisherStatus = {
	level?: number | null
	approved?: boolean | null
	congregation?: { id: string } | null
}

// A publisher who joined a congregation but was not approved by an admin yet.
// Admins are never pending: older admin records may not have `approved` set.
export const isPendingPublisher = (publisher: PublisherStatus | null | undefined): boolean => {
	if (!publisher?.congregation) return false
	if (publisher.level === 1) return false
	return publisher.approved !== true
}
