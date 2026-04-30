"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ErrorState } from "@/components/ui/ErrorState";
import { APP_COPY } from "@/constants/copy";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <Container className="py-10">
      <ErrorState action={<Button onClick={reset}>{APP_COPY.retryAction}</Button>} />
    </Container>
  );
}
