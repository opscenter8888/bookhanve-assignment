import { APP_COPY } from "@/constants/copy";

type LoadingStateProps = {
  message?: string;
};

export function LoadingState({ message = APP_COPY.loadingBooks }: LoadingStateProps) {
  return (
    <div
      className="rounded-lg border border-line bg-white p-6 text-sm text-muted"
      role="status"
    >
      {message}
    </div>
  );
}
