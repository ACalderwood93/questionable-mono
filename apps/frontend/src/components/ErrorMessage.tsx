interface ErrorMessageProps {
  message: string;
  size?: "small" | "medium";
}

export function ErrorMessage({ message, size = "medium" }: ErrorMessageProps) {
  const fontSize = size === "small" ? "text-xs" : "text-sm";
  return (
    <div className={`bg-red-600 border-2 border-red-500 text-white p-4 mb-5 ${fontSize}`}>
      <p>{message}</p>
    </div>
  );
}
