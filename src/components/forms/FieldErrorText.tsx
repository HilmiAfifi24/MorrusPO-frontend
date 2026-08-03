export default function FieldErrorText({ message }: { message?: string | null }) {
  if (!message) {
    return null;
  }

  return <span className="mt-2 block text-xs text-error-600">{message}</span>;
}
