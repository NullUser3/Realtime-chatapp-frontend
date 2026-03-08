
export const formatLastSeen = (date) => {
  if (!date) return null;

  const lastSeen = new Date(date);
  const now = new Date();
  const diffMs = now - lastSeen;

  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays < 1) {
    return lastSeen.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (diffDays < 2) {
    return "Yesterday";
  }

  if (diffDays < 7) {
    return lastSeen.toLocaleDateString([], { weekday: "short" });
  }

  return lastSeen.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
};