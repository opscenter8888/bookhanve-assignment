import { BookGridSkeleton } from "@/components/book/BookGridSkeleton";
import { Container } from "@/components/ui/Container";
import { LoadingState } from "@/components/ui/LoadingState";

export default function Loading() {
  return (
    <Container className="space-y-6 py-10">
      <LoadingState />
      <BookGridSkeleton />
    </Container>
  );
}
