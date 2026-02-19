import { EmptyFiles } from "@/components/EmptyFiles/EmptyFiles";

export default function NotFound() {
  return (
    <EmptyFiles
      title="Page not found"
      description="The requested page was not found."
      image="/not-found.svg"
      imageAlt="Page not found"
    />
  );
}